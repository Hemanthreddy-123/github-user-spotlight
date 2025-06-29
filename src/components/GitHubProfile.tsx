
import { GitHubUser, GitHubRepo } from "@/types/github";
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
  ExternalLink,
  Mail,
  Twitter,
  Clock,
  Shield,
  GitFork,
  Star,
  Eye
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

  const formatDetailedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAccountAge = () => {
    const createdDate = new Date(user.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}, ${months} month${months > 1 ? 's' : ''}`;
    }
    return `${months} month${months > 1 ? 's' : ''}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Enhanced Profile Header */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar and Basic Info */}
            <div className="flex-shrink-0 text-center md:text-left">
              <img
                src={user.avatar_url}
                alt={user.name}
                className="w-32 h-32 rounded-full border-4 border-white/20 shadow-2xl mx-auto md:mx-0"
              />
              <div className="mt-4 space-y-2">
                <Badge 
                  variant="secondary" 
                  className={`${user.type === 'User' ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'}`}
                >
                  {user.type}
                </Badge>
                {user.site_admin && (
                  <Badge className="bg-red-500/20 text-red-300 border-red-400/30">
                    <Shield className="w-3 h-3 mr-1" />
                    Admin
                  </Badge>
                )}
              </div>
            </div>

            {/* Detailed Profile Info */}
            <div className="flex-grow space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {user.name || user.login}
                </h2>
                <p className="text-xl text-gray-300 mb-2">@{user.login}</p>
                {user.hireable && (
                  <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
                    Available for hire
                  </Badge>
                )}
              </div>

              {user.bio && (
                <p className="text-gray-200 text-lg leading-relaxed max-w-2xl">
                  {user.bio}
                </p>
              )}

              {/* Enhanced Profile Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                {user.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{user.location}</span>
                  </div>
                )}
                {user.company && (
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span>{user.company}</span>
                  </div>
                )}
                {user.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a
                      href={`mailto:${user.email}`}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {user.email}
                    </a>
                  </div>
                )}
                {user.twitter_username && (
                  <div className="flex items-center gap-2">
                    <Twitter className="w-4 h-4 text-gray-400" />
                    <a
                      href={`https://twitter.com/${user.twitter_username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      @{user.twitter_username}
                    </a>
                  </div>
                )}
                {user.blog && (
                  <div className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-gray-400" />
                    <a
                      href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors truncate"
                    >
                      {user.blog}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Joined {formatDate(user.created_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>Active for {getAccountAge()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4">
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
                
                {user.email && (
                  <Button
                    asChild
                    variant="outline"
                    className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                  >
                    <a href={`mailto:${user.email}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Contact
                    </a>
                  </Button>
                )}

                {user.twitter_username && (
                  <Button
                    asChild
                    variant="outline"
                    className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border-blue-400/30"
                  >
                    <a
                      href={`https://twitter.com/${user.twitter_username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Twitter className="w-4 h-4 mr-2" />
                      Follow
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-sm border-blue-400/30">
          <CardContent className="p-6 text-center">
            <BookOpen className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">
              {user.public_repos}
            </div>
            <div className="text-blue-200 text-sm">Public Repositories</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-sm border-purple-400/30">
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">
              {user.followers}
            </div>
            <div className="text-purple-200 text-sm">Followers</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-sm border-green-400/30">
          <CardContent className="p-6 text-center">
            <UserPlus className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">
              {user.following}
            </div>
            <div className="text-green-200 text-sm">Following</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 backdrop-blur-sm border-orange-400/30">
          <CardContent className="p-6 text-center">
            <Star className="w-8 h-8 text-orange-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">
              {user.public_gists}
            </div>
            <div className="text-orange-200 text-sm">Public Gists</div>
          </CardContent>
        </Card>
      </div>

      {/* Repository Display */}
      {repos.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">
              Repositories
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-white/10 text-gray-300">
                {repos.length} shown
              </Badge>
              {repos.length < user.public_repos && (
                <Badge variant="outline" className="border-yellow-400/30 text-yellow-300">
                  {user.public_repos - repos.length} more available
                </Badge>
              )}
            </div>
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
