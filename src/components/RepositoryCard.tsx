
import { GitHubRepo } from "@/types/github";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  GitFork, 
  ExternalLink, 
  Calendar, 
  Eye,
  Lock,
  Unlock,
  GitBranch,
  AlertCircle,
  Book,
  Globe,
  Archive
} from "lucide-react";

interface RepositoryCardProps {
  repo: GitHubRepo;
}

export const RepositoryCard = ({ repo }: RepositoryCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      JavaScript: "bg-yellow-500",
      TypeScript: "bg-blue-500",
      Python: "bg-green-500",
      Java: "bg-red-500",
      "C++": "bg-pink-500",
      C: "bg-gray-500",
      Go: "bg-cyan-500",
      Rust: "bg-orange-500",
      PHP: "bg-purple-500",
      Ruby: "bg-red-600",
      Swift: "bg-orange-600",
      Kotlin: "bg-purple-600",
      HTML: "bg-orange-400",
      CSS: "bg-blue-400",
      Shell: "bg-green-600",
      Dockerfile: "bg-blue-600",
      Vue: "bg-green-400",
      React: "bg-cyan-400",
    };
    return colors[language] || "bg-gray-400";
  };

  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 group relative">
      {/* Repository Status Indicators */}
      <div className="absolute top-3 right-3 flex gap-1">
        {repo.private && (
          <Badge className="bg-red-500/20 text-red-300 border-red-400/30 text-xs">
            <Lock className="w-3 h-3 mr-1" />
            Private
          </Badge>
        )}
        {repo.fork && (
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 text-xs">
            <GitFork className="w-3 h-3 mr-1" />
            Fork
          </Badge>
        )}
        {repo.archived && (
          <Badge className="bg-gray-500/20 text-gray-300 border-gray-400/30 text-xs">
            <Archive className="w-3 h-3 mr-1" />
            Archived
          </Badge>
        )}
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg font-semibold truncate pr-20">
          {repo.name}
        </CardTitle>
        {repo.description && (
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
            {repo.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Repository Features */}
        <div className="flex flex-wrap gap-2">
          {repo.has_issues && (
            <Badge variant="outline" className="border-gray-400/30 text-gray-300 text-xs">
              <AlertCircle className="w-3 h-3 mr-1" />
              Issues
            </Badge>
          )}
          {repo.has_wiki && (
            <Badge variant="outline" className="border-gray-400/30 text-gray-300 text-xs">
              <Book className="w-3 h-3 mr-1" />
              Wiki
            </Badge>
          )}
          {repo.has_pages && (
            <Badge variant="outline" className="border-gray-400/30 text-gray-300 text-xs">
              <Globe className="w-3 h-3 mr-1" />
              Pages
            </Badge>
          )}
        </div>

        {/* Topics */}
        {repo.topics && repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {repo.topics.slice(0, 3).map((topic) => (
              <Badge 
                key={topic} 
                variant="secondary" 
                className="bg-blue-500/10 text-blue-300 border-blue-400/20 text-xs"
              >
                {topic}
              </Badge>
            ))}
            {repo.topics.length > 3 && (
              <Badge variant="secondary" className="bg-gray-500/10 text-gray-300 text-xs">
                +{repo.topics.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Language and Main Branch */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            {repo.language && (
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language)}`}
                />
                <span className="text-gray-300">{repo.language}</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-gray-400">
              <GitBranch className="w-3 h-3" />
              <span className="text-xs">{repo.default_branch}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-gray-400 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              <span>{repo.stargazers_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="w-4 h-4" />
              <span>{repo.forks_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{repo.watchers_count}</span>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Created {formatDate(repo.created_at)}</span>
          </div>
          <span>Updated {formatDate(repo.updated_at)}</span>
        </div>

        {/* License */}
        {repo.license && (
          <div className="text-xs text-gray-400">
            License: {repo.license.name}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="flex-1 bg-white/5 hover:bg-white/10 text-white border-white/20 group-hover:border-white/30 transition-all duration-300"
          >
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Repository
              <ExternalLink className="w-3 h-3 ml-2" />
            </a>
          </Button>
          
          {repo.homepage && (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="bg-green-500/10 hover:bg-green-500/20 text-green-300 border-green-400/30"
            >
              <a
                href={repo.homepage.startsWith('http') ? repo.homepage : `https://${repo.homepage}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Globe className="w-3 h-3" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
