
import { useState, useMemo } from "react";
import { SearchForm } from "@/components/SearchForm";
import { GitHubProfile } from "@/components/GitHubProfile";
import { AdvancedFilters, FilterOptions, SortOptions } from "@/components/AdvancedFilters";
import { UserAnalytics } from "@/components/UserAnalytics";
import { ExportOptions } from "@/components/ExportOptions";
import { RepositoryAnalytics } from "@/components/RepositoryAnalytics";
import { CodeQualityMetrics } from "@/components/CodeQualityMetrics";
import { ContributionPatterns } from "@/components/ContributionPatterns";
import { DeveloperInsights } from "@/components/DeveloperInsights";
import { TrendingTopics } from "@/components/TrendingTopics";
import { ComparisonTools } from "@/components/ComparisonTools";
import { ProjectSuggestions } from "@/components/ProjectSuggestions";
import { GitHubUser, GitHubRepo, GitHubStats } from "@/types/github";
import { Github } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [allRepos, setAllRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    language: 'all',
    hasIssues: false,
    isFork: false,
    hasWiki: false,
    hasPages: false,
    searchQuery: '',
    minStars: 0,
    dateRange: 'all'
  });
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    field: 'updated',
    direction: 'desc'
  });
  const { toast } = useToast();

  const filteredAndSortedRepos = useMemo(() => {
    let filtered = allRepos.filter(repo => {
      // Language filter
      if (filters.language !== 'all' && repo.language !== filters.language) return false;
      
      // Search query
      if (filters.searchQuery && !repo.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
          !repo.description?.toLowerCase().includes(filters.searchQuery.toLowerCase())) return false;
      
      // Feature filters
      if (filters.hasIssues && !repo.has_issues) return false;
      if (filters.isFork && !repo.fork) return false;
      if (filters.hasWiki && !repo.has_wiki) return false;
      if (filters.hasPages && !repo.has_pages) return false;
      
      // Min stars
      if (repo.stargazers_count < filters.minStars) return false;
      
      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortOptions.field) {
        case 'stars':
          aValue = a.stargazers_count;
          bValue = b.stargazers_count;
          break;
        case 'forks':
          aValue = a.forks_count;
          bValue = b.forks_count;
          break;
        case 'created':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        case 'updated':
          aValue = new Date(a.updated_at);
          bValue = new Date(b.updated_at);
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        default:
          return 0;
      }

      if (sortOptions.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [allRepos, filters, sortOptions]);

  const userStats = useMemo((): GitHubStats => {
    if (!allRepos.length) {
      return {
        totalStars: 0,
        totalForks: 0,
        totalWatchers: 0,
        primaryLanguages: {},
        contributionYears: []
      };
    }

    const stats: GitHubStats = {
      totalStars: allRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
      totalForks: allRepos.reduce((sum, repo) => sum + repo.forks_count, 0),
      totalWatchers: allRepos.reduce((sum, repo) => sum + repo.watchers_count, 0),
      primaryLanguages: {},
      contributionYears: []
    };

    // Calculate language distribution
    allRepos.forEach(repo => {
      if (repo.language) {
        stats.primaryLanguages[repo.language] = (stats.primaryLanguages[repo.language] || 0) + 1;
      }
    });

    // Get contribution years
    const years = new Set(allRepos.map(repo => new Date(repo.created_at).getFullYear().toString()));
    stats.contributionYears = Array.from(years).sort();

    return stats;
  }, [allRepos]);

  const fetchGitHubData = async (username: string) => {
    setLoading(true);
    try {
      console.log(`Fetching data for username: ${username}`);
      
      // Fetch user data
      const userResponse = await fetch(`https://api.github.com/users/${username}`);
      if (!userResponse.ok) {
        throw new Error("User not found");
      }
      const userData = await userResponse.json();
      console.log('User data fetched:', userData);

      // Fetch ALL repositories (not just 6)
      let allReposData: GitHubRepo[] = [];
      let page = 1;
      const perPage = 100;

      while (true) {
        const reposResponse = await fetch(
          `https://api.github.com/users/${username}/repos?sort=updated&per_page=${perPage}&page=${page}`
        );
        const reposData = await reposResponse.json();
        
        if (!reposData.length) break;
        
        allReposData = [...allReposData, ...reposData];
        
        if (reposData.length < perPage) break;
        page++;
      }

      console.log(`Fetched ${allReposData.length} repositories`);

      setUser(userData);
      setAllRepos(allReposData);
      
      toast({
        title: "Success!",
        description: `Loaded profile for ${userData.name || userData.login} with ${allReposData.length} repositories`,
      });
    } catch (error) {
      console.error("Error fetching GitHub data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch GitHub profile. Please check the username and try again.",
        variant: "destructive",
      });
      setUser(null);
      setAllRepos([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full">
              <Github className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Advanced GitHub Profile Analyzer
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive GitHub profile analysis with 34+ advanced features including analytics, insights, and AI-powered recommendations
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-md mx-auto mb-12">
          <SearchForm onSearch={fetchGitHubData} loading={loading} />
        </div>

        {user && (
          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList className="grid w-full grid-cols-6 bg-white/10 backdrop-blur-sm">
              <TabsTrigger value="profile" className="data-[state=active]:bg-white/20">
                Profile
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-white/20">
                Analytics
              </TabsTrigger>
              <TabsTrigger value="insights" className="data-[state=active]:bg-white/20">
                Insights
              </TabsTrigger>
              <TabsTrigger value="repositories" className="data-[state=active]:bg-white/20">
                Repositories
              </TabsTrigger>
              <TabsTrigger value="compare" className="data-[state=active]:bg-white/20">
                Compare
              </TabsTrigger>
              <TabsTrigger value="export" className="data-[state=active]:bg-white/20">
                Export
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-8">
              <GitHubProfile user={user} repos={filteredAndSortedRepos.slice(0, 6)} loading={loading} />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-8">
              <UserAnalytics user={user} repos={allRepos} stats={userStats} />
              <RepositoryAnalytics repos={allRepos} />
              <CodeQualityMetrics repos={allRepos} />
            </TabsContent>

            <TabsContent value="insights" className="space-y-8">
              <DeveloperInsights user={user} repos={allRepos} />
              <ContributionPatterns repos={allRepos} />
              <TrendingTopics repos={allRepos} />
              <ProjectSuggestions repos={allRepos} />
            </TabsContent>

            <TabsContent value="repositories" className="space-y-8">
              <AdvancedFilters 
                onFilterChange={setFilters}
                onSortChange={setSortOptions}
                totalRepos={filteredAndSortedRepos.length}
              />
              <GitHubProfile user={user} repos={filteredAndSortedRepos} loading={loading} />
            </TabsContent>

            <TabsContent value="compare" className="space-y-8">
              <ComparisonTools currentUser={user} currentRepos={allRepos} />
            </TabsContent>

            <TabsContent value="export" className="space-y-8">
              <ExportOptions user={user} repos={allRepos} />
            </TabsContent>
          </Tabs>
        )}

        {/* Welcome State */}
        {!user && !loading && (
          <div className="text-center py-20">
            <Card className="bg-white/5 backdrop-blur-sm rounded-2xl max-w-2xl mx-auto border border-white/10">
              <CardContent className="p-12">
                <Github className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Enter a GitHub username to get started
                </h2>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Search for any GitHub user to view their comprehensive profile analysis with 34+ advanced features:
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                  <div>✓ Repository analytics & insights</div>
                  <div>✓ Code quality metrics</div>
                  <div>✓ Contribution patterns</div>
                  <div>✓ Developer profiling</div>
                  <div>✓ Trending topics analysis</div>
                  <div>✓ User comparison tools</div>
                  <div>✓ Project suggestions</div>
                  <div>✓ Advanced filtering & sorting</div>
                  <div>✓ Export & sharing options</div>
                  <div>✓ AI-powered recommendations</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
