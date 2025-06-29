
import { useState } from "react";
import { GitHubUser, GitHubRepo } from "@/types/github";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  GitCompare, 
  Star, 
  GitFork, 
  Calendar,
  TrendingUp,
  Award,
  Target
} from "lucide-react";

interface ComparisonToolsProps {
  currentUser: GitHubUser;
  currentRepos: GitHubRepo[];
}

export const ComparisonTools = ({ currentUser, currentRepos }: ComparisonToolsProps) => {
  const [compareUsername, setCompareUsername] = useState("");
  const [compareUser, setCompareUser] = useState<GitHubUser | null>(null);
  const [compareRepos, setCompareRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchCompareUser = async () => {
    if (!compareUsername.trim()) return;
    
    setLoading(true);
    try {
      const userResponse = await fetch(`https://api.github.com/users/${compareUsername}`);
      if (!userResponse.ok) throw new Error("User not found");
      
      const userData = await userResponse.json();
      
      const reposResponse = await fetch(`https://api.github.com/users/${compareUsername}/repos?sort=updated&per_page=100`);
      const reposData = await reposResponse.json();
      
      setCompareUser(userData);
      setCompareRepos(reposData);
      
      toast({
        title: "Success!",
        description: `Loaded ${userData.name || userData.login} for comparison`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch user for comparison",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (user: GitHubUser, repos: GitHubRepo[]) => {
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
    const languages = new Set(repos.map(r => r.language).filter(Boolean)).size;
    const avgStarsPerRepo = totalStars / repos.length || 0;
    
    return {
      totalStars,
      totalForks,
      languages,
      avgStarsPerRepo,
      followerRatio: user.following > 0 ? user.followers / user.following : user.followers
    };
  };

  const currentStats = calculateStats(currentUser, currentRepos);
  const compareStats = compareUser ? calculateStats(compareUser, compareRepos) : null;

  const getComparisonIcon = (current: number, compare: number) => {
    if (current > compare) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (current < compare) return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />;
    return <Target className="w-4 h-4 text-yellow-400" />;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-cyan-600/20 to-blue-800/20 backdrop-blur-sm border-cyan-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-cyan-400" />
            Developer Comparison
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2">
            <Input
              placeholder="Enter GitHub username to compare..."
              value={compareUsername}
              onChange={(e) => setCompareUsername(e.target.value)}
              className="bg-white/10 border-cyan-400/30 text-white placeholder:text-gray-400"
              onKeyPress={(e) => e.key === 'Enter' && fetchCompareUser()}
            />
            <Button 
              onClick={fetchCompareUser}
              disabled={loading || !compareUsername.trim()}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              {loading ? "Loading..." : "Compare"}
            </Button>
          </div>

          {compareUser && compareStats && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <img
                    src={currentUser.avatar_url}
                    alt={currentUser.login}
                    className="w-16 h-16 rounded-full mx-auto mb-2"
                  />
                  <h3 className="text-white font-semibold">{currentUser.name || currentUser.login}</h3>
                  <Badge className="bg-cyan-500/20 text-cyan-300">Current</Badge>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <img
                    src={compareUser.avatar_url}
                    alt={compareUser.login}
                    className="w-16 h-16 rounded-full mx-auto mb-2"
                  />
                  <h3 className="text-white font-semibold">{compareUser.name || compareUser.login}</h3>
                  <Badge className="bg-blue-500/20 text-blue-300">Compare</Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-cyan-200">Public Repositories</span>
                  <div className="flex items-center gap-4">
                    <span className="text-cyan-300">{currentUser.public_repos}</span>
                    {getComparisonIcon(currentUser.public_repos, compareUser.public_repos)}
                    <span className="text-blue-300">{compareUser.public_repos}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-cyan-200">Total Stars</span>
                  <div className="flex items-center gap-4">
                    <span className="text-cyan-300">{currentStats.totalStars}</span>
                    {getComparisonIcon(currentStats.totalStars, compareStats.totalStars)}
                    <span className="text-blue-300">{compareStats.totalStars}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-cyan-200">Followers</span>
                  <div className="flex items-center gap-4">
                    <span className="text-cyan-300">{currentUser.followers}</span>
                    {getComparisonIcon(currentUser.followers, compareUser.followers)}
                    <span className="text-blue-300">{compareUser.followers}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-cyan-200">Languages Used</span>
                  <div className="flex items-center gap-4">
                    <span className="text-cyan-300">{currentStats.languages}</span>
                    {getComparisonIcon(currentStats.languages, compareStats.languages)}
                    <span className="text-blue-300">{compareStats.languages}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-cyan-200">Avg Stars per Repo</span>
                  <div className="flex items-center gap-4">
                    <span className="text-cyan-300">{currentStats.avgStarsPerRepo.toFixed(1)}</span>
                    {getComparisonIcon(currentStats.avgStarsPerRepo, compareStats.avgStarsPerRepo)}
                    <span className="text-blue-300">{compareStats.avgStarsPerRepo.toFixed(1)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-cyan-200">Account Age (years)</span>
                  <div className="flex items-center gap-4">
                    <span className="text-cyan-300">
                      {new Date().getFullYear() - new Date(currentUser.created_at).getFullYear()}
                    </span>
                    {getComparisonIcon(
                      new Date().getFullYear() - new Date(currentUser.created_at).getFullYear(),
                      new Date().getFullYear() - new Date(compareUser.created_at).getFullYear()
                    )}
                    <span className="text-blue-300">
                      {new Date().getFullYear() - new Date(compareUser.created_at).getFullYear()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
