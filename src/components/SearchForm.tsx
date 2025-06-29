
import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";

interface SearchFormProps {
  onSearch: (username: string) => void;
  loading: boolean;
}

export const SearchForm = ({ onSearch, loading }: SearchFormProps) => {
  const [username, setUsername] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSearch(username.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Enter GitHub username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="pl-10 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-300 focus:border-blue-400 focus:ring-blue-400"
          disabled={loading}
        />
      </div>
      <Button
        type="submit"
        disabled={!username.trim() || loading}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 transition-all duration-200"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Fetching Profile...
          </>
        ) : (
          <>
            <Search className="w-4 h-4 mr-2" />
            Search Profile
          </>
        )}
      </Button>
    </form>
  );
};
