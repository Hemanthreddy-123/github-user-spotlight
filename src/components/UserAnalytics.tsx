
import { GitHubUser, GitHubRepo, GitHubStats } from "@/types/github";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Calendar, 
  Code, 
  Star, 
  GitFork, 
  Eye, 
  Clock,
  Award,
  Target,
  Activity
} from "lucide-react";

interface UserAnalyticsProps {
  user: GitHubUser;
  repos: GitHubRepo[];
  stats: GitHubStats;
}

export const UserAnalytics = ({ user, repos, stats }: UserAnalyticsProps) => {
  const calculateActivityScore = () => {
    const recentRepos = repos.filter(repo => {
      const updatedDate = new Date(repo.updated_at);
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      return updatedDate > sixMonthsAgo;
    }).length;

    return Math.min(100, (recentRepos / repos.length * 100) || 0);
  };

  const getTopLanguages = () => {
    return Object.entries(stats.primaryLanguages)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  const calculateEngagementRate = () => {
    if (repos.length === 0) return 0;
    const avgStars = stats.totalStars / repos.length;
    return Math.min(100, avgStars * 10);
  };

  const getContributionStreak = () => {
    const accountAge = Math.floor(
      (new Date().getTime() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)
    );
    return Math.floor(accountAge / 30); // Approximate months
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Activity Analysis */}
      <Card className="bg-gradient-to-br from-green-600/20 to-emerald-800/20 backdrop-blur-sm border-green-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-400" />
            Development Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-green-200">Recent Activity Score</span>
              <span className="text-green-300">{calculateActivityScore().toFixed(0)}%</span>
            </div>
            <Progress value={calculateActivityScore()} className="h-2 bg-green-900/30" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-300">{repos.length}</div>
              <div className="text-xs text-green-200">Total Repos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-300">{getContributionStreak()}</div>
              <div className="text-xs text-green-200">Months Active</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language Proficiency */}
      <Card className="bg-gradient-to-br from-blue-600/20 to-indigo-800/20 backdrop-blur-sm border-blue-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Code className="w-5 h-5 text-blue-400" />
            Language Proficiency
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {getTopLanguages().map(([language, count], index) => (
            <div key={language}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-blue-200">{language}</span>
                <span className="text-blue-300">{count} repos</span>
              </div>
              <Progress 
                value={(count / repos.length) * 100} 
                className="h-1.5 bg-blue-900/30" 
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Engagement Metrics */}
      <Card className="bg-gradient-to-br from-purple-600/20 to-violet-800/20 backdrop-blur-sm border-purple-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            Engagement Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-xl font-bold text-purple-300">{stats.totalStars}</div>
              <div className="text-xs text-purple-200 flex items-center justify-center gap-1">
                <Star className="w-3 h-3" />
                Total Stars
              </div>
            </div>
            <div>
              <div className="text-xl font-bold text-purple-300">{stats.totalForks}</div>
              <div className="text-xs text-purple-200 flex items-center justify-center gap-1">
                <GitFork className="w-3 h-3" />
                Total Forks
              </div>
            </div>
            <div>
              <div className="text-xl font-bold text-purple-300">{stats.totalWatchers}</div>
              <div className="text-xs text-purple-200 flex items-center justify-center gap-1">
                <Eye className="w-3 h-3" />
                Watchers
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-purple-200">Engagement Rate</span>
              <span className="text-purple-300">{calculateEngagementRate().toFixed(0)}%</span>
            </div>
            <Progress value={calculateEngagementRate()} className="h-2 bg-purple-900/30" />
          </div>
        </CardContent>
      </Card>

      {/* Developer Profile */}
      <Card className="bg-gradient-to-br from-orange-600/20 to-red-800/20 backdrop-blur-sm border-orange-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-orange-400" />
            Developer Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-orange-200 text-sm">Account Type</span>
            <Badge variant="secondary" className="bg-orange-500/20 text-orange-300">
              {user.type}
            </Badge>
          </div>
          
          {user.hireable && (
            <div className="flex items-center justify-between">
              <span className="text-orange-200 text-sm">Available for Hire</span>
              <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
                Yes
              </Badge>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-orange-200 text-sm">Member Since</span>
            <span className="text-orange-300 text-sm">
              {new Date(user.created_at).getFullYear()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-orange-200 text-sm">Public Gists</span>
            <span className="text-orange-300 text-sm">{user.public_gists}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-orange-200 text-sm">Follower Ratio</span>
            <span className="text-orange-300 text-sm">
              {user.following > 0 ? (user.followers / user.following).toFixed(1) : user.followers}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
