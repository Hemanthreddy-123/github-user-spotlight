
import { useState } from "react";
import { GitHubUser, GitHubRepo } from "@/types/github";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Download, 
  FileText, 
  Image, 
  Link2, 
  Share2, 
  Copy,
  Mail,
  Printer,
  FileJson
} from "lucide-react";

interface ExportOptionsProps {
  user: GitHubUser;
  repos: GitHubRepo[];
}

export const ExportOptions = ({ user, repos }: ExportOptionsProps) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const exportToJSON = () => {
    const data = {
      user,
      repos,
      exportedAt: new Date().toISOString(),
      totalStats: {
        totalStars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
        totalForks: repos.reduce((sum, repo) => sum + repo.forks_count, 0),
        languages: [...new Set(repos.map(repo => repo.language).filter(Boolean))]
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${user.login}-github-profile.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Profile data exported as JSON file",
    });
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Repository', 'Language', 'Stars', 'Forks', 'Created', 'Updated', 'Description'].join(','),
      ...repos.map(repo => [
        repo.name,
        repo.language || 'N/A',
        repo.stargazers_count,
        repo.forks_count,
        new Date(repo.created_at).toLocaleDateString(),
        new Date(repo.updated_at).toLocaleDateString(),
        `"${repo.description?.replace(/"/g, '""') || 'N/A'}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${user.login}-repositories.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Repository data exported as CSV file",
    });
  };

  const copyProfileURL = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast({
      title: "URL Copied",
      description: "Profile URL copied to clipboard",
    });
  };

  const shareProfile = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user.name || user.login}'s GitHub Profile`,
          text: `Check out ${user.name || user.login}'s GitHub profile with ${user.public_repos} repositories!`,
          url: window.location.href,
        });
      } catch (error) {
        copyProfileURL();
      }
    } else {
      copyProfileURL();
    }
  };

  const generateMarkdown = () => {
    const markdown = `# ${user.name || user.login}'s GitHub Profile

## Profile Information
- **Username:** ${user.login}
- **Name:** ${user.name || 'N/A'}
- **Bio:** ${user.bio || 'N/A'}
- **Location:** ${user.location || 'N/A'}
- **Company:** ${user.company || 'N/A'}
- **Blog:** ${user.blog || 'N/A'}
- **Twitter:** ${user.twitter_username || 'N/A'}
- **Public Repositories:** ${user.public_repos}
- **Followers:** ${user.followers}
- **Following:** ${user.following}

## Recent Repositories

${repos.map(repo => `### [${repo.name}](${repo.html_url})
${repo.description || 'No description available'}

- **Language:** ${repo.language || 'N/A'}
- **Stars:** ${repo.stargazers_count}
- **Forks:** ${repo.forks_count}
- **Created:** ${new Date(repo.created_at).toLocaleDateString()}
- **Updated:** ${new Date(repo.updated_at).toLocaleDateString()}

---`).join('\n\n')}

*Profile generated on ${new Date().toLocaleDateString()}*
`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${user.login}-profile-readme.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Markdown Generated",
      description: "Profile README.md file downloaded",
    });
  };

  const printProfile = () => {
    window.print();
    toast({
      title: "Print Dialog Opened",
      description: "You can now print or save as PDF",
    });
  };

  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export & Share Options
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={exportToJSON}
            className="bg-white/5 hover:bg-white/10 text-white border-white/20 flex items-center gap-2"
          >
            <FileJson className="w-4 h-4" />
            JSON
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={exportToCSV}
            className="bg-white/5 hover:bg-white/10 text-white border-white/20 flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            CSV
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={generateMarkdown}
            className="bg-white/5 hover:bg-white/10 text-white border-white/20 flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            README
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={printProfile}
            className="bg-white/5 hover:bg-white/10 text-white border-white/20 flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={copyProfileURL}
            className="bg-white/5 hover:bg-white/10 text-white border-white/20 flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy URL
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={shareProfile}
            className="bg-white/5 hover:bg-white/10 text-white border-white/20 flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
