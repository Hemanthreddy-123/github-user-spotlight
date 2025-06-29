
import { GitHubRepo } from "@/types/github";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  GitBranch, 
  Clock, 
  TrendingUp,
  Activity,
  Zap
} from "lucide-react";

interface ContributionPatternsProps {
  repos: GitHubRepo[];
}

export const ContributionPatterns = ({ repos }: ContributionPatternsProps) => {
  const getYearlyContributions = () => {
    const years = repos.reduce((acc, repo) => {
      const year = new Date(repo.created_at).getFullYear();
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    return Object.entries(years)
      .sort(([a], [b]) => parseInt(b) - parseInt(a))
      .slice(0, 5);
  };

  const getActivityPattern = () => {
    const now = new Date();
    const patterns = {
      'Last 7 days': 0,
      'Last 30 days': 0,
      'Last 90 days': 0,
      'Last year': 0,
      'Older': 0
    };

    repos.forEach(repo => {
      const updated = new Date(repo.updated_at);
      const daysDiff = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= 7) patterns['Last 7 days']++;
      else if (daysDiff <= 30) patterns['Last 30 days']++;
      else if (daysDiff <= 90) patterns['Last 90 days']++;
      else if (daysDiff <= 365) patterns['Last year']++;
      else patterns['Older']++;
    });

    return patterns;
  };

  const getContributionStreak = () => {
    const sortedRepos = repos
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    
    let streak = 0;
    const now = new Date();
    
    for (const repo of sortedRepos) {
      const daysDiff = Math.floor((now.getTime() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff <= 30) streak++;
      else break;
    }
    
    return streak;
  };

  const yearlyContributions = getYearlyContributions();
  const activityPattern = getActivityPattern();
  const streak = getContributionStreak();

  const mostActiveYear = yearlyContributions[0];
  const totalContributions = repos.length;
  const avgPerYear = totalContributions / yearlyContributions.length;

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-green-600/20 to-teal-800/20 backdrop-blur-sm border-green-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-400" />
            Contribution Patterns
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-300">{streak}</div>
              <div className="text-xs text-green-200">Active Repos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-300">{totalContributions}</div>
              <div className="text-xs text-green-200">Total Repos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-300">{avgPerYear.toFixed(1)}</div>
              <div className="text-xs text-green-200">Avg Per Year</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-300">
                {mostActiveYear ? mostActiveYear[0] : 'N/A'}
              </div>
              <div className="text-xs text-green-200">Most Active Year</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-green-200 font-semibold">Yearly Contributions</h4>
            {yearlyContributions.map(([year, count]) => (
              <div key={year} className="flex items-center justify-between">
                <span className="text-green-200">{year}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-green-900/30 rounded-full h-2">
                    <div 
                      className="bg-green-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(count / Math.max(...yearlyContributions.map(([,c]) => c))) * 100}%` }}
                    />
                  </div>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-300 text-xs">
                    {count}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h4 className="text-green-200 font-semibold">Activity Pattern</h4>
            {Object.entries(activityPattern).map(([period, count]) => (
              <div key={period} className="flex items-center justify-between">
                <span className="text-green-200 text-sm">{period}</span>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${
                    count > 0 ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-400'
                  }`}
                >
                  {count} repos
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
