
import { GitHubRepo } from "@/types/github";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Hash, Star, Clock } from "lucide-react";

interface TrendingTopicsProps {
  repos: GitHubRepo[];
}

export const TrendingTopics = ({ repos }: TrendingTopicsProps) => {
  const getAllTopics = () => {
    const topicCounts = repos.reduce((acc, repo) => {
      if (repo.topics && repo.topics.length > 0) {
        repo.topics.forEach(topic => {
          if (!acc[topic]) {
            acc[topic] = { count: 0, totalStars: 0, repos: [] };
          }
          acc[topic].count++;
          acc[topic].totalStars += repo.stargazers_count;
          acc[topic].repos.push(repo);
        });
      }
      return acc;
    }, {} as Record<string, { count: number; totalStars: number; repos: GitHubRepo[] }>);

    return Object.entries(topicCounts)
      .sort(([,a], [,b]) => b.count - a.count)
      .slice(0, 20);
  };

  const getLanguageTrends = () => {
    const languageCounts = repos.reduce((acc, repo) => {
      if (repo.language) {
        if (!acc[repo.language]) {
          acc[repo.language] = { count: 0, totalStars: 0, avgStars: 0 };
        }
        acc[repo.language].count++;
        acc[repo.language].totalStars += repo.stargazers_count;
      }
      return acc;
    }, {} as Record<string, { count: number; totalStars: number; avgStars: number }>);

    // Calculate average stars per repository for each language
    Object.keys(languageCounts).forEach(lang => {
      languageCounts[lang].avgStars = languageCounts[lang].totalStars / languageCounts[lang].count;
    });

    return Object.entries(languageCounts)
      .sort(([,a], [,b]) => b.count - a.count)
      .slice(0, 10);
  };

  const getPopularityTrend = (topic: string, data: { totalStars: number; count: number }) => {
    const avgStars = data.totalStars / data.count;
    if (avgStars > 10) return { level: 'Hot', color: 'bg-red-500/20 text-red-300 border-red-400/30' };
    if (avgStars > 5) return { level: 'Trending', color: 'bg-orange-500/20 text-orange-300 border-orange-400/30' };
    if (avgStars > 1) return { level: 'Popular', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30' };
    return { level: 'Emerging', color: 'bg-blue-500/20 text-blue-300 border-blue-400/30' };
  };

  const allTopics = getAllTopics();
  const languageTrends = getLanguageTrends();

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-orange-600/20 to-red-800/20 backdrop-blur-sm border-orange-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-400" />
            Trending Topics & Technologies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-orange-200 font-semibold mb-3 flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Popular Topics
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {allTopics.slice(0, 12).map(([topic, data]) => {
                const trend = getPopularityTrend(topic, data);
                return (
                  <div key={topic} className="p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-orange-200 text-sm font-medium truncate">{topic}</span>
                      <Badge className={`${trend.color} text-xs`}>
                        {trend.level}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-orange-300">
                      <span>{data.count} repos</span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {data.totalStars}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-orange-200 font-semibold mb-3">Language Trends</h4>
            <div className="space-y-2">
              {languageTrends.map(([language, data], index) => (
                <div key={language} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-bold text-orange-400 w-6">#{index + 1}</div>
                    <div>
                      <span className="text-orange-200 font-medium">{language}</span>
                      <div className="text-xs text-orange-300">
                        {data.count} repositories • Avg {data.avgStars.toFixed(1)} stars
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-orange-300 font-bold">{data.totalStars}</div>
                    <div className="text-xs text-orange-400">total stars</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-lg">
            <h4 className="text-orange-200 font-semibold mb-2">Trend Analysis</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-orange-300">{allTopics.length}</div>
                <div className="text-xs text-orange-200">Unique Topics</div>
              </div>
              <div>
                <div className="text-xl font-bold text-orange-300">{languageTrends.length}</div>
                <div className="text-xs text-orange-200">Languages Used</div>
              </div>
              <div>
                <div className="text-xl font-bold text-orange-300">
                  {allTopics.reduce((sum, [,data]) => sum + data.count, 0)}
                </div>
                <div className="text-xs text-orange-200">Tagged Repos</div>
              </div>
              <div>
                <div className="text-xl font-bold text-orange-300">
                  {((repos.filter(r => r.topics && r.topics.length > 0).length / repos.length) * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-orange-200">Topic Coverage</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
