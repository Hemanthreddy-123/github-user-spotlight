
import { GitHubRepo } from "@/types/github";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Lightbulb, 
  Rocket, 
  Target, 
  Star,
  Code,
  BookOpen,
  Zap,
  Sparkles
} from "lucide-react";

interface ProjectSuggestionsProps {
  repos: GitHubRepo[];
}

export const ProjectSuggestions = ({ repos }: ProjectSuggestionsProps) => {
  const getLanguageStats = () => {
    const languages = repos.reduce((acc, repo) => {
      if (repo.language) {
        acc[repo.language] = (acc[repo.language] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(languages)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  const generateSuggestions = () => {
    const languages = getLanguageStats();
    const hasDocumentation = repos.some(r => r.has_wiki || r.description);
    const hasWebProjects = repos.some(r => r.language === 'JavaScript' || r.language === 'TypeScript');
    const hasMobileProjects = repos.some(r => r.language === 'Swift' || r.language === 'Kotlin' || r.language === 'Dart');
    const hasDataProjects = repos.some(r => r.language === 'Python' || r.language === 'R');
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    
    const suggestions = [];

    // Documentation suggestions
    if (!hasDocumentation) {
      suggestions.push({
        title: "Create a Developer Portfolio",
        description: "Build a personal website showcasing your projects and skills",
        type: "Portfolio",
        priority: "High",
        icon: BookOpen,
        color: "bg-blue-500/20 text-blue-300 border-blue-400/30"
      });
    }

    // Language-specific suggestions
    if (languages[0] && languages[0][0] === 'JavaScript') {
      suggestions.push({
        title: "Build a Full-Stack Web Application",
        description: "Create a modern web app with React/Vue.js and Node.js backend",
        type: "Web Development",
        priority: "High",
        icon: Code,
        color: "bg-yellow-500/20 text-yellow-300 border-yellow-400/30"
      });
    }

    if (languages[0] && languages[0][0] === 'Python') {
      suggestions.push({
        title: "Data Science Project",
        description: "Analyze interesting datasets and create visualizations",
        type: "Data Science",
        priority: "Medium",
        icon: Target,
        color: "bg-green-500/20 text-green-300 border-green-400/30"
      });
    }

    // Mobile development
    if (!hasMobileProjects && hasWebProjects) {
      suggestions.push({
        title: "Cross-Platform Mobile App",
        description: "Expand your web skills to mobile with React Native or Flutter",
        type: "Mobile Development",
        priority: "Medium",
        icon: Rocket,
        color: "bg-purple-500/20 text-purple-300 border-purple-400/30"
      });
    }

    // Open source contribution
    if (totalStars < 50) {
      suggestions.push({
        title: "Contribute to Open Source",
        description: "Find popular repositories in your tech stack and contribute",
        type: "Open Source",
        priority: "High",
        icon: Star,
        color: "bg-orange-500/20 text-orange-300 border-orange-400/30"
      });
    }

    // API project
    suggestions.push({
      title: "Build a RESTful API",
      description: "Create a robust API with authentication and documentation",
      type: "Backend",
      priority: "Medium",
      icon: Zap,
      color: "bg-red-500/20 text-red-300 border-red-400/30"
    });

    // DevOps project
    suggestions.push({
      title: "DevOps Pipeline Project",
      description: "Set up CI/CD, containerization, and cloud deployment",
      type: "DevOps",
      priority: "Low",
      icon: Sparkles,
      color: "bg-cyan-500/20 text-cyan-300 border-cyan-400/30"
    });

    return suggestions.slice(0, 6);
  };

  const learningPaths = [
    {
      title: "Master Modern JavaScript",
      description: "ES6+, async/await, modules, and frameworks",
      skills: ["JavaScript", "TypeScript", "React", "Node.js"]
    },
    {
      title: "Cloud Native Development",
      description: "Microservices, containers, and cloud platforms",
      skills: ["Docker", "Kubernetes", "AWS", "CI/CD"]
    },
    {
      title: "Full-Stack Development",
      description: "End-to-end application development",
      skills: ["Frontend", "Backend", "Database", "API Design"]
    },
    {
      title: "Data Engineering",
      description: "Big data processing and analytics",
      skills: ["Python", "SQL", "Apache Spark", "Machine Learning"]
    }
  ];

  const suggestions = generateSuggestions();

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-pink-600/20 to-rose-800/20 backdrop-blur-sm border-pink-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-pink-400" />
            Project Suggestions & Learning Paths
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-pink-200 font-semibold mb-3">Recommended Projects</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="p-4 bg-white/5 rounded-lg">
                  <div className="flex items-start gap-3 mb-3">
                    <suggestion.icon className="w-5 h-5 text-pink-400 mt-1" />
                    <div className="flex-grow">
                      <h5 className="text-white font-medium mb-1">{suggestion.title}</h5>
                      <p className="text-pink-200 text-sm mb-2">{suggestion.description}</p>
                      <div className="flex gap-2">
                        <Badge className={suggestion.color}>
                          {suggestion.type}
                        </Badge>
                        <Badge variant="outline" className="border-pink-400/30 text-pink-300">
                          {suggestion.priority} Priority
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-pink-200 font-semibold mb-3">Learning Paths</h4>
            <div className="space-y-3">
              {learningPaths.map((path, index) => (
                <div key={index} className="p-4 bg-white/5 rounded-lg">
                  <h5 className="text-white font-medium mb-2">{path.title}</h5>
                  <p className="text-pink-200 text-sm mb-3">{path.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {path.skills.map((skill, skillIndex) => (
                      <Badge 
                        key={skillIndex} 
                        variant="secondary" 
                        className="bg-pink-500/20 text-pink-300 text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-lg">
            <h4 className="text-pink-200 font-semibold mb-2">Next Steps</h4>
            <div className="space-y-2 text-sm text-pink-100">
              <p>• Choose a project that aligns with your current skills and interests</p>
              <p>• Start with a small MVP and iterate based on feedback</p>
              <p>• Document your learning journey and share progress</p>
              <p>• Consider collaborating with other developers</p>
              <p>• Deploy your projects to showcase your work</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
