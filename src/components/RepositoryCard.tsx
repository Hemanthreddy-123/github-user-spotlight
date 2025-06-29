
import { GitHubRepo } from "@/pages/Index";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, GitFork, ExternalLink, Calendar } from "lucide-react";

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
    };
    return colors[language] || "bg-gray-400";
  };

  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 group">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg font-semibold truncate">
          {repo.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {repo.description && (
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
            {repo.description}
          </p>
        )}

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
          </div>
        </div>

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
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(repo.updated_at)}</span>
          </div>
        </div>

        <Button
          asChild
          variant="outline"
          size="sm"
          className="w-full bg-white/5 hover:bg-white/10 text-white border-white/20 group-hover:border-white/30 transition-all duration-300"
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
      </CardContent>
    </Card>
  );
};
