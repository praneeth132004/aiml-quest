import { useState } from "react";
import { Tables } from "@/integrations/supabase/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, BookOpen, Video, Code, ChevronDown, ChevronUp, Lock, CheckCircle } from "lucide-react";

// Define the structure of resources
interface ModuleResources {
  readings?: string[];
  videos?: string[];
  exercises?: string[];
  projects?: string[];
}

export type Module = Tables<"modules"> & {
  progress: number;
  status: "completed" | "in-progress" | "locked";
  resources?: ModuleResources;
};

interface RoadmapCardProps {
  module: Module;
  onProgressUpdate: (progress: number) => void;
}

const RoadmapCard: React.FC<RoadmapCardProps> = ({ module, onProgressUpdate }) => {
  const [expanded, setExpanded] = useState(false);

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-700";
      case "intermediate":
        return "bg-yellow-100 text-yellow-700";
      case "advanced":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = () => {
    switch (module.status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <div className="h-5 w-5 rounded-full bg-yellow-400"></div>;
      case "locked":
        return <Lock className="h-5 w-5 text-gray-400" />;
      default:
        return null;
    }
  };

  const handleProgressUpdate = () => {
    // If module is locked, do nothing
    if (module.status === "locked") return;

    // If module is completed, reset to in-progress
    if (module.status === "completed") {
      onProgressUpdate(50);
      return;
    }

    // If module is in-progress, mark as completed
    onProgressUpdate(100);
  };

  return (
    <Card className={`border ${module.status === "locked" ? "opacity-70" : "card-hover"}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <CardTitle className="text-lg font-semibold">{module.title}</CardTitle>
          </div>
          <Badge
            className={getDifficultyColor(module.difficulty_level)}
            variant="secondary"
          >
            {module.difficulty_level.charAt(0).toUpperCase() + module.difficulty_level.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{module.description}</p>

        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm text-gray-500">{module.progress}%</span>
        </div>
        <Progress value={module.progress} className="mb-4" />

        <div className="flex space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{module.estimated_hours} hours</span>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 mr-1 rounded-full bg-gray-200"></div>
            <span>{module.category}</span>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-semibold mb-2">Resources</h4>
            <div className="space-y-3">
              {module.resources && module.resources.readings && module.resources.readings.length > 0 && (
                <div>
                  <h5 className="text-xs font-medium flex items-center">
                    <BookOpen className="h-3 w-3 mr-1" /> Reading Materials
                  </h5>
                  <ul className="text-xs text-gray-600 ml-4 mt-1 list-disc">
                    {module.resources.readings?.map((reading: string, idx: number) => (
                      <li key={idx}>{reading}</li>
                    ))}
                  </ul>
                </div>
              )}

              {module.resources && module.resources.videos && module.resources.videos.length > 0 && (
                <div>
                  <h5 className="text-xs font-medium flex items-center">
                    <Video className="h-3 w-3 mr-1" /> Video Resources
                  </h5>
                  <ul className="text-xs text-gray-600 ml-4 mt-1 list-disc">
                    {module.resources.videos?.map((video: string, idx: number) => (
                      <li key={idx}>{video}</li>
                    ))}
                  </ul>
                </div>
              )}

              {module.resources && module.resources.exercises && module.resources.exercises.length > 0 && (
                <div>
                  <h5 className="text-xs font-medium flex items-center">
                    <Code className="h-3 w-3 mr-1" /> Exercises
                  </h5>
                  <ul className="text-xs text-gray-600 ml-4 mt-1 list-disc">
                    {module.resources.exercises?.map((exercise: string, idx: number) => (
                      <li key={idx}>{exercise}</li>
                    ))}
                  </ul>
                </div>
              )}

              {(!module.resources ||
                (!module.resources.readings || module.resources.readings.length === 0) &&
                (!module.resources.videos || module.resources.videos.length === 0) &&
                (!module.resources.exercises || module.resources.exercises.length === 0)) && (
                <p className="text-xs text-gray-500">Resources will be available soon.</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="text-gray-500"
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

        <Button
          size="sm"
          variant={module.status === "completed" ? "outline" : "default"}
          disabled={module.status === "locked"}
          onClick={handleProgressUpdate}
        >
          {module.status === "completed" ? "Review" : module.status === "in-progress" ? "Continue" : "Locked"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RoadmapCard;
