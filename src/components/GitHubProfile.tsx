
import { GitHubUser, GitHubRepo } from "@/pages/Index";
import { RepositoryCard } from "@/components/RepositoryCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Building, 
  Link as LinkIcon, 
  Calendar, 
  Users, 
  BookOpen, 
  UserPlus,
  ExternalLink 
} from "lucide-react";

interface GitHubProfileProps {
  user: GitHubUser;
  repos: GitHubRepo[];
  loading: boolean;
}

export const GitHubProfile = ({ user, repos, loading }: GitHubProfileProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Profile Header */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <img
                src={user.avatar_url}
                alt={user.name}
                className="w-32 h-32 rounded-full border-4 border-white/20 shadow-2xl"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-grow space-y-4">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {user.name || user.login}
                </h2>
                <p className="text-xl text-gray-300">@{user.login}</p>
              </div>

              {user.bio && (
                <p className="text-gray-200 text-lg leading-relaxed max-w-2xl">
                  {user.bio}
                </p>
              )}

              {/* Profile Details */}
              <div className="flex flex-wrap gap-4 text-gray-300">
                {user.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                  </div>
                )}
                {user.company && (
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    <span>{user.company}</span>
                  </div>
                )}
                {user.blog && (
                  <div className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" />
                    <a
                      href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {user.blog}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatDate(user.created_at)}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <Button
                  asChild
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  variant="outline"
                >
                  <a
                    href={user.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on GitHub
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-sm border-blue-400/30">
          <CardContent className="p-6 text-center">
            <BookOpen className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">
              {user.public_repos}
            </div>
            <div className="text-blue-200">Public Repositories</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-sm border-purple-400/30">
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">
              {user.followers}
            </div>
            <div className="text-purple-200">Followers</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-sm border-green-400/30">
          <CardContent className="p-6 text-center">
            <UserPlus className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">
              {user.following}
            </div>
            <div className="text-green-200">Following</div>
          </CardContent>
        </Card>
      </div>

      {/* Repositories */}
      {repos.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">
              Recent Repositories
            </h3>
            <Badge variant="secondary" className="bg-white/10 text-gray-300">
              {repos.length} repositories
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map((repo) => (
              <RepositoryCard key={repo.id} repo={repo} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
