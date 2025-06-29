
import { GitHubRepo } from "@/types/github";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  Star, 
  GitFork, 
  Eye,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";

interface RepositoryAnalyticsProps {
  repos: GitHubRepo[];
}

export const RepositoryAnalytics = ({ repos }: RepositoryAnalyticsProps) => {
  const calculateRepoHealth = (repo: GitHubRepo) => {
    let score = 0;
    if (repo.description) score += 20;
    if (repo.stargazers_count > 0) score += 15;
    if (repo.has_wiki) score += 10;
    if (repo.homepage) score += 10;
    if (repo.license) score += 20;
    if (repo.topics && repo.topics.length > 0) score += 15;
    if (repo.has_issues) score += 10;
    return score;
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getHealthIcon = (score: number) => {
    if (score >= 80) return CheckCircle;
    if (score >= 60) return AlertTriangle;
    return XCircle;
  };

  const calculateActivityScore = (repo: GitHubRepo) => {
    const daysSinceUpdate = Math.floor(
      (new Date().getTime() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceUpdate < 7) return 100;
    if (daysSinceUpdate < 30) return 80;
    if (daysSinceUpdate < 90) return 60;
    if (daysSinceUpdate < 365) return 40;
    return 20;
  };

  const topRepos = repos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 10);

  const avgHealth = repos.reduce((sum, repo) => sum + calculateRepoHealth(repo), 0) / repos.length;

  return (
    <div className="space-y-6">
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Repository Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{avgHealth.toFixed(0)}%</div>
              <div className="text-sm text-gray-300">Avg Health Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {repos.filter(r => r.stargazers_count > 0).length}
              </div>
              <div className="text-sm text-gray-300">Starred Repos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {repos.filter(r => r.fork).length}
              </div>
              <div className="text-sm text-gray-300">Forked Repos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {repos.filter(r => r.archived).length}
              </div>
              <div className="text-sm text-gray-300">Archived</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-semibold">Top Repositories by Stars</h4>
            {topRepos.map((repo, index) => {
              const health = calculateRepoHealth(repo);
              const activity = calculateActivityScore(repo);
              const HealthIcon = getHealthIcon(health);
              
              return (
                <div key={repo.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <div className="text-lg font-bold text-gray-400 w-6">#{index + 1}</div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium">{repo.name}</span>
                      <HealthIcon className={`w-4 h-4 ${getHealthColor(health)}`} />
                      <Badge variant="secondary" className="text-xs">
                        Health: {health}%
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-300">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {repo.stargazers_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="w-3 h-3" />
                        {repo.forks_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Activity: {activity}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
