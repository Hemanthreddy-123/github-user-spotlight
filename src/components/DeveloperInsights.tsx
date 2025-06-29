
import { GitHubUser, GitHubRepo } from "@/types/github";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Target, 
  Award, 
  TrendingUp,
  Users,
  Star,
  GitFork,
  Code,
  Lightbulb,
  Rocket
} from "lucide-react";

interface DeveloperInsightsProps {
  user: GitHubUser;
  repos: GitHubRepo[];
}

export const DeveloperInsights = ({ user, repos }: DeveloperInsightsProps) => {
  const calculateDeveloperLevel = () => {
    let score = 0;
    
    // Repository count
    score += Math.min(user.public_repos * 2, 100);
    
    // Stars received
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    score += Math.min(totalStars * 5, 200);
    
    // Followers
    score += Math.min(user.followers * 3, 150);
    
    // Account age
    const accountAge = new Date().getFullYear() - new Date(user.created_at).getFullYear();
    score += Math.min(accountAge * 20, 100);
    
    // Diversity (languages)
    const languages = new Set(repos.map(r => r.language).filter(Boolean));
    score += Math.min(languages.size * 10, 100);
    
    return Math.min(score, 1000);
  };

  const getDeveloperType = () => {
    const languages = repos.reduce((acc, repo) => {
      if (repo.language) {
        acc[repo.language] = (acc[repo.language] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const topLanguages = Object.entries(languages)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([lang]) => lang);

    if (topLanguages.includes('JavaScript') || topLanguages.includes('TypeScript')) {
      return { type: 'Full-Stack Developer', icon: Code, color: 'text-yellow-400' };
    }
    if (topLanguages.includes('Python')) {
      return { type: 'Data Scientist', icon: Brain, color: 'text-blue-400' };
    }
    if (topLanguages.includes('Java') || topLanguages.includes('C#')) {
      return { type: 'Backend Developer', icon: Target, color: 'text-red-400' };
    }
    if (topLanguages.includes('Swift') || topLanguages.includes('Kotlin')) {
      return { type: 'Mobile Developer', icon: Rocket, color: 'text-green-400' };
    }
    return { type: 'Polyglot Developer', icon: Lightbulb, color: 'text-purple-400' };
  };

  const getInfluenceScore = () => {
    const followers = user.followers;
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
    
    return Math.min((followers * 2 + totalStars + totalForks) / 10, 100);
  };

  const getCollaborationScore = () => {
    const forkedRepos = repos.filter(r => r.fork).length;
    const following = user.following;
    const contributedRepos = repos.filter(r => r.forks_count > 0).length;
    
    return Math.min(((forkedRepos + following + contributedRepos) / repos.length) * 100, 100);
  };

  const getInnovationScore = () => {
    const originalRepos = repos.filter(r => !r.fork).length;
    const starredRepos = repos.filter(r => r.stargazers_count > 0).length;
    const uniqueLanguages = new Set(repos.map(r => r.language).filter(Boolean)).size;
    
    return Math.min(((originalRepos + starredRepos + uniqueLanguages) / repos.length) * 100, 100);
  };

  const developerLevel = calculateDeveloperLevel();
  const developerType = getDeveloperType();
  const influenceScore = getInfluenceScore();
  const collaborationScore = getCollaborationScore();
  const innovationScore = getInnovationScore();

  const getLevelBadge = (score: number) => {
    if (score >= 800) return { level: 'Expert', color: 'bg-purple-500/20 text-purple-300 border-purple-400/30' };
    if (score >= 600) return { level: 'Advanced', color: 'bg-blue-500/20 text-blue-300 border-blue-400/30' };
    if (score >= 400) return { level: 'Intermediate', color: 'bg-green-500/20 text-green-300 border-green-400/30' };
    if (score >= 200) return { level: 'Beginner', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30' };
    return { level: 'Newcomer', color: 'bg-gray-500/20 text-gray-300 border-gray-400/30' };
  };

  const levelBadge = getLevelBadge(developerLevel);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-indigo-600/20 to-purple-800/20 backdrop-blur-sm border-indigo-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-400" />
            Developer Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <developerType.icon className={`w-8 h-8 ${developerType.color}`} />
              <div>
                <h3 className="text-xl font-bold text-white">{developerType.type}</h3>
                <Badge className={levelBadge.color}>
                  {levelBadge.level} Level
                </Badge>
              </div>
            </div>
            <div className="text-3xl font-bold text-indigo-300 mb-2">{developerLevel}</div>
            <div className="text-sm text-indigo-200">Developer Score</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <TrendingUp className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-white">{influenceScore.toFixed(0)}%</div>
              <div className="text-xs text-indigo-200">Influence</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <Users className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-white">{collaborationScore.toFixed(0)}%</div>
              <div className="text-xs text-indigo-200">Collaboration</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <Lightbulb className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-white">{innovationScore.toFixed(0)}%</div>
              <div className="text-xs text-indigo-200">Innovation</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-indigo-200 font-semibold">Skills Assessment</h4>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-indigo-200">Technical Influence</span>
                <span className="text-indigo-300">{influenceScore.toFixed(0)}%</span>
              </div>
              <Progress value={influenceScore} className="h-2 bg-indigo-900/30" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-indigo-200">Community Collaboration</span>
                <span className="text-indigo-300">{collaborationScore.toFixed(0)}%</span>
              </div>
              <Progress value={collaborationScore} className="h-2 bg-indigo-900/30" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-indigo-200">Innovation Index</span>
                <span className="text-indigo-300">{innovationScore.toFixed(0)}%</span>
              </div>
              <Progress value={innovationScore} className="h-2 bg-indigo-900/30" />
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-lg">
            <h4 className="text-indigo-200 font-semibold mb-2">Developer Summary</h4>
            <p className="text-sm text-indigo-100 leading-relaxed">
              This {developerType.type.toLowerCase()} has been active for{' '}
              {new Date().getFullYear() - new Date(user.created_at).getFullYear()} years, 
              contributing {user.public_repos} public repositories with a total of{' '}
              {repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)} stars received.
              Their {levelBadge.level.toLowerCase()} level reflects their experience and 
              community engagement in the developer ecosystem.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
