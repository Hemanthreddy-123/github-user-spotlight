
import { GitHubRepo } from "@/types/github";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Code, 
  FileText, 
  Shield, 
  Award, 
  Target,
  CheckCircle,
  AlertTriangle,
  XCircle
} from "lucide-react";

interface CodeQualityMetricsProps {
  repos: GitHubRepo[];
}

export const CodeQualityMetrics = ({ repos }: CodeQualityMetricsProps) => {
  const calculateQualityScore = (repo: GitHubRepo) => {
    let score = 0;
    
    // Documentation
    if (repo.description) score += 15;
    if (repo.has_wiki) score += 10;
    
    // Licensing
    if (repo.license) score += 20;
    
    // Community
    if (repo.has_issues) score += 10;
    if (repo.stargazers_count > 0) score += 10;
    if (repo.forks_count > 0) score += 10;
    
    // Topics/Tags
    if (repo.topics && repo.topics.length > 0) score += 15;
    
    // Homepage/Demo
    if (repo.homepage) score += 10;
    
    return score;
  };

  const getQualityLevel = (score: number) => {
    if (score >= 80) return { level: "Excellent", color: "text-green-400", icon: CheckCircle };
    if (score >= 60) return { level: "Good", color: "text-blue-400", icon: CheckCircle };
    if (score >= 40) return { level: "Fair", color: "text-yellow-400", icon: AlertTriangle };
    return { level: "Needs Work", color: "text-red-400", icon: XCircle };
  };

  const qualityDistribution = repos.reduce((acc, repo) => {
    const score = calculateQualityScore(repo);
    const { level } = getQualityLevel(score);
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const avgQuality = repos.reduce((sum, repo) => sum + calculateQualityScore(repo), 0) / repos.length;

  const documentationScore = (repos.filter(r => r.description).length / repos.length) * 100;
  const licensingScore = (repos.filter(r => r.license).length / repos.length) * 100;
  const communityScore = (repos.filter(r => r.has_issues).length / repos.length) * 100;

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-purple-600/20 to-indigo-800/20 backdrop-blur-sm border-purple-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Code className="w-5 h-5 text-purple-400" />
            Code Quality Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-300">{avgQuality.toFixed(0)}%</div>
              <div className="text-xs text-purple-200">Overall Quality</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-300">{documentationScore.toFixed(0)}%</div>
              <div className="text-xs text-purple-200">Documentation</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-300">{licensingScore.toFixed(0)}%</div>
              <div className="text-xs text-purple-200">Licensed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-300">{communityScore.toFixed(0)}%</div>
              <div className="text-xs text-purple-200">Community Ready</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-purple-200 font-semibold">Quality Distribution</h4>
            {Object.entries(qualityDistribution).map(([level, count]) => {
              const { color, icon: Icon } = getQualityLevel(level === "Excellent" ? 90 : level === "Good" ? 70 : level === "Fair" ? 50 : 30);
              return (
                <div key={level} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${color}`} />
                    <span className="text-purple-200">{level}</span>
                  </div>
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                    {count} repos
                  </Badge>
                </div>
              );
            })}
          </div>

          <div className="space-y-3">
            <h4 className="text-purple-200 font-semibold">Quality Metrics</h4>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-purple-200">Documentation Coverage</span>
                <span className="text-purple-300">{documentationScore.toFixed(0)}%</span>
              </div>
              <Progress value={documentationScore} className="h-2 bg-purple-900/30" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-purple-200">Licensing Coverage</span>
                <span className="text-purple-300">{licensingScore.toFixed(0)}%</span>
              </div>
              <Progress value={licensingScore} className="h-2 bg-purple-900/30" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-purple-200">Community Features</span>
                <span className="text-purple-300">{communityScore.toFixed(0)}%</span>
              </div>
              <Progress value={communityScore} className="h-2 bg-purple-900/30" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
