import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  BookOpen, 
  Video, 
  Code, 
  ChevronDown, 
  ChevronUp, 
  Lock, 
  CheckCircle, 
  ExternalLink,
  Sparkles, // New icon for featured content
  Target // New icon for prerequisites
} from "lucide-react";
import { Module } from "@/types/roadmap";
import { cn } from "@/lib/utils";

interface RoadmapCardProps {
  module: Module;
  onProgressUpdate: (progress: number) => void;
}

const getDifficultyBadgeVariant = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return "bg-green-100 text-green-700 hover:bg-green-100/80";
    case 'intermediate':
      return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80";
    case 'advanced':
      return "bg-red-100 text-red-700 hover:bg-red-100/80";
    default:
      return "bg-gray-100 text-gray-700 hover:bg-gray-100/80";
  }
};

export default function RoadmapCard({ module, onProgressUpdate }: RoadmapCardProps) {
  const [expanded, setExpanded] = useState(false);

  const renderResourceLink = (resource: { title: string; url: string; provider?: string }) => (
    <div className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-2 transition-colors">
      <a 
        href={resource.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 flex items-center group flex-1"
      >
        {resource.title}
        <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
      </a>
      {resource.provider && (
        <Badge variant="outline" className="ml-2 text-xs">
          {resource.provider}
        </Badge>
      )}
    </div>
  );

  return (
    <Card className={cn(
      "w-full transition-all duration-300 hover:shadow-lg",
      module.status === 'locked' ? 'opacity-75 bg-gray-50' : 'bg-white',
      expanded && 'border-blue-200'
    )}>
      <CardHeader className="space-y-4">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <CardTitle className="text-xl flex items-center gap-2">
              {module.title}
              {module.featured && (
                <Sparkles className="h-5 w-5 text-yellow-500" />
              )}
            </CardTitle>
            <p className="text-sm text-gray-600">{module.description}</p>
          </div>
          <Badge variant={
            module.status === 'completed' ? 'success' :
            module.status === 'in-progress' ? 'warning' :
            'secondary'
          } className="flex items-center gap-1 px-3 py-1">
            {module.status === 'completed' ? (
              <CheckCircle className="h-4 w-4" />
            ) : module.status === 'locked' ? (
              <Lock className="h-4 w-4" />
            ) : null}
            {module.status.charAt(0).toUpperCase() + module.status.slice(1)}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Badge 
            variant="secondary"
            className={cn(
              getDifficultyBadgeVariant(module.difficulty_level),
              "px-3 py-1"
            )}
          >
            {module.difficulty_level.charAt(0).toUpperCase() + module.difficulty_level.slice(1)}
          </Badge>
          <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
            <Clock className="h-4 w-4 mr-1.5" />
            {module.estimated_hours}h
          </div>
        </div>

        {module.prerequisites.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Target className="h-4 w-4" />
              Prerequisites:
            </div>
            <div className="flex flex-wrap gap-2">
              {module.prerequisites.map((prereq, index) => (
                <Badge key={index} variant="outline" className="bg-white">
                  {prereq}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Progress 
          value={module.progress} 
          className="h-2"
          indicatorClassName={cn(
            module.status === 'completed' ? 'bg-green-500' :
            module.status === 'in-progress' ? 'bg-blue-500' :
            'bg-gray-200'
          )}
        />
      </CardHeader>

      {expanded && (
        <CardContent className="border-t pt-4">
          <div className="space-y-6">
            {module.resources.videos.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium flex items-center gap-2 text-gray-700">
                  <Video className="h-4 w-4" /> Video Resources
                </h5>
                <div className="ml-6">
                  {module.resources.videos.map((video, idx) => renderResourceLink(video))}
                </div>
              </div>
            )}

            {module.resources.readings.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium flex items-center gap-2 text-gray-700">
                  <BookOpen className="h-4 w-4" /> Reading Materials
                </h5>
                <div className="ml-6">
                  {module.resources.readings.map((reading, idx) => renderResourceLink(reading))}
                </div>
              </div>
            )}

            {module.resources.exercises.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium flex items-center gap-2 text-gray-700">
                  <Code className="h-4 w-4" /> Exercises
                </h5>
                <div className="ml-6">
                  {module.resources.exercises.map((exercise, idx) => renderResourceLink(exercise))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      )}

      <CardFooter className="flex justify-between border-t pt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className={cn(
            "text-gray-500 hover:text-gray-700",
            expanded && "bg-gray-50"
          )}
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" /> Hide Resources
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" /> View Resources
            </>
          )}
        </Button>
        
        {module.status !== 'locked' && (
          <Button
            variant={module.status === 'completed' ? 'outline' : 'default'}
            size="sm"
            onClick={() => onProgressUpdate(Math.min(100, module.progress + 10))}
            className={cn(
              module.status === 'completed' && "text-green-600 border-green-200 hover:bg-green-50"
            )}
          >
            {module.status === 'completed' ? 'Completed' : 'Update Progress'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
