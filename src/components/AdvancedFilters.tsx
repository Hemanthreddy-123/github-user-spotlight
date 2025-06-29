import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Search, SortAsc, SortDesc, Calendar, Star, GitFork, Eye } from "lucide-react";

interface AdvancedFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  onSortChange: (sort: SortOptions) => void;
  totalRepos: number;
}

export interface FilterOptions {
  language: string;
  hasIssues: boolean;
  isFork: boolean;
  hasWiki: boolean;
  hasPages: boolean;
  searchQuery: string;
  minStars: number;
  dateRange: string;
}

export interface SortOptions {
  field: 'updated' | 'created' | 'stars' | 'forks' | 'name';
  direction: 'asc' | 'desc';
}

export const AdvancedFilters = ({ onFilterChange, onSortChange, totalRepos }: AdvancedFiltersProps) => {
  const [filters, setFilters] = useState<FilterOptions>({
    language: 'all',
    hasIssues: false,
    isFork: false,
    hasWiki: false,
    hasPages: false,
    searchQuery: '',
    minStars: 0,
    dateRange: 'all'
  });

  const [sort, setSort] = useState<SortOptions>({
    field: 'updated',
    direction: 'desc'
  });

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (field: SortOptions['field']) => {
    const newDirection: 'asc' | 'desc' = sort.field === field && sort.direction === 'desc' ? 'asc' : 'desc';
    const newSort: SortOptions = { field, direction: newDirection };
    setSort(newSort);
    onSortChange(newSort);
  };

  const clearFilters = () => {
    const defaultFilters: FilterOptions = {
      language: 'all',
      hasIssues: false,
      isFork: false,
      hasWiki: false,
      hasPages: false,
      searchQuery: '',
      minStars: 0,
      dateRange: 'all'
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Advanced Filters & Sorting
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
            {totalRepos} repos
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search repositories..."
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
          />
        </div>

        {/* Language Filter */}
        <Select value={filters.language} onValueChange={(value) => handleFilterChange('language', value)}>
          <SelectTrigger className="bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Filter by language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Languages</SelectItem>
            <SelectItem value="JavaScript">JavaScript</SelectItem>
            <SelectItem value="TypeScript">TypeScript</SelectItem>
            <SelectItem value="Python">Python</SelectItem>
            <SelectItem value="Java">Java</SelectItem>
            <SelectItem value="Go">Go</SelectItem>
            <SelectItem value="Rust">Rust</SelectItem>
          </SelectContent>
        </Select>

        {/* Min Stars */}
        <div>
          <label className="text-sm text-gray-300 mb-2 block">Minimum Stars</label>
          <Input
            type="number"
            min="0"
            value={filters.minStars}
            onChange={(e) => handleFilterChange('minStars', parseInt(e.target.value) || 0)}
            className="bg-white/10 border-white/20 text-white"
          />
        </div>

        {/* Repository Features */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={filters.hasIssues ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterChange('hasIssues', !filters.hasIssues)}
            className="text-xs"
          >
            Has Issues
          </Button>
          <Button
            variant={filters.isFork ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterChange('isFork', !filters.isFork)}
            className="text-xs"
          >
            Forks Only
          </Button>
          <Button
            variant={filters.hasWiki ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterChange('hasWiki', !filters.hasWiki)}
            className="text-xs"
          >
            Has Wiki
          </Button>
          <Button
            variant={filters.hasPages ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterChange('hasPages', !filters.hasPages)}
            className="text-xs"
          >
            Has Pages
          </Button>
        </div>

        {/* Sort Options */}
        <div className="border-t border-white/10 pt-4">
          <h4 className="text-sm font-medium text-white mb-3">Sort by:</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={sort.field === 'updated' ? "default" : "outline"}
              size="sm"
              onClick={() => handleSortChange('updated')}
              className="text-xs justify-between"
            >
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Updated
              </span>
              {sort.field === 'updated' && (
                sort.direction === 'desc' ? <SortDesc className="w-3 h-3" /> : <SortAsc className="w-3 h-3" />
              )}
            </Button>
            <Button
              variant={sort.field === 'stars' ? "default" : "outline"}
              size="sm"
              onClick={() => handleSortChange('stars')}
              className="text-xs justify-between"
            >
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                Stars
              </span>
              {sort.field === 'stars' && (
                sort.direction === 'desc' ? <SortDesc className="w-3 h-3" /> : <SortAsc className="w-3 h-3" />
              )}
            </Button>
            <Button
              variant={sort.field === 'forks' ? "default" : "outline"}
              size="sm"
              onClick={() => handleSortChange('forks')}
              className="text-xs justify-between"
            >
              <span className="flex items-center gap-1">
                <GitFork className="w-3 h-3" />
                Forks
              </span>
              {sort.field === 'forks' && (
                sort.direction === 'desc' ? <SortDesc className="w-3 h-3" /> : <SortAsc className="w-3 h-3" />
              )}
            </Button>
            <Button
              variant={sort.field === 'name' ? "default" : "outline"}
              size="sm"
              onClick={() => handleSortChange('name')}
              className="text-xs justify-between"
            >
              Name
              {sort.field === 'name' && (
                sort.direction === 'desc' ? <SortDesc className="w-3 h-3" /> : <SortAsc className="w-3 h-3" />
              )}
            </Button>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="w-full text-gray-300 hover:text-white"
        >
          Clear All Filters
        </Button>
      </CardContent>
    </Card>
  );
};
