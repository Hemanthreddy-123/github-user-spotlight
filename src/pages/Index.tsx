
import { useState } from "react";
import { SearchForm } from "@/components/SearchForm";
import { GitHubProfile } from "@/components/GitHubProfile";
import { Github } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  location: string;
  company: string;
  blog: string;
  created_at: string;
  html_url: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  updated_at: string;
}

const Index = () => {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchGitHubData = async (username: string) => {
    setLoading(true);
    try {
      // Fetch user data
      const userResponse = await fetch(`https://api.github.com/users/${username}`);
      if (!userResponse.ok) {
        throw new Error("User not found");
      }
      const userData = await userResponse.json();

      // Fetch repositories
      const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
      const reposData = await reposResponse.json();

      setUser(userData);
      setRepos(reposData);
      
      toast({
        title: "Success!",
        description: `Loaded profile for ${userData.name || userData.login}`,
      });
    } catch (error) {
      console.error("Error fetching GitHub data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch GitHub profile. Please check the username and try again.",
        variant: "destructive",
      });
      setUser(null);
      setRepos([]);
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
              GitHub Profile Fetcher
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover and showcase GitHub profiles with comprehensive insights and professional presentation
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-md mx-auto mb-12">
          <SearchForm onSearch={fetchGitHubData} loading={loading} />
        </div>

        {/* Profile Display */}
        {user && (
          <GitHubProfile user={user} repos={repos} loading={loading} />
        )}

        {/* Welcome State */}
        {!user && !loading && (
          <div className="text-center py-20">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 max-w-2xl mx-auto border border-white/10">
              <Github className="w-20 h-20 text-gray-400 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-white mb-4">
                Enter a GitHub username to get started
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Search for any GitHub user to view their profile, repositories, and contribution statistics in a beautiful, professional format.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
