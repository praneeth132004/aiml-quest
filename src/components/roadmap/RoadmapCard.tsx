
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Check, ExternalLink, Lock } from "lucide-react";
import { Link } from "react-router-dom";

export interface Module {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "locked";
  estimatedHours: number;
  resources: {
    readings: string[];
    videos: string[];
  };
  progress: number;
}

interface RoadmapCardProps {
  module: Module;
}

const RoadmapCard: React.FC<RoadmapCardProps> = ({ module }) => {
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "in-progress":
        return "bg-blue-100 text-blue-700";
      case "locked":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in-progress":
        return "In Progress";
      case "locked":
        return "Locked";
      default:
        return status;
    }
  };

  return (
    <Card className={`border ${module.status === "locked" ? "opacity-70" : ""} card-hover`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{module.title}</CardTitle>
          <Badge className={getStatusColor(module.status)} variant="secondary">
            {module.status === "locked" && <Lock className="mr-1 h-3 w-3" />}
            {module.status === "completed" && <Check className="mr-1 h-3 w-3" />}
            {getStatusText(module.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">{module.description}</p>
          
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>{module.estimatedHours} hours estimated</span>
            <span>{module.progress}% complete</span>
          </div>
          
          <Progress value={module.progress} className="h-2" />

          {expanded && (
            <div className="pt-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Reading Materials</h4>
                <ul className="space-y-1">
                  {module.resources.readings.map((reading, index) => (
                    <li key={index} className="text-sm flex">
                      <ExternalLink className="h-4 w-4 mr-2 flex-shrink-0 text-gray-400" />
                      <a href="#" className="text-blue-600 hover:underline">{reading}</a>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Video Resources</h4>
                <ul className="space-y-1">
                  {module.resources.videos.map((video, index) => (
                    <li key={index} className="text-sm flex">
                      <ExternalLink className="h-4 w-4 mr-2 flex-shrink-0 text-gray-400" />
                      <a href="#" className="text-blue-600 hover:underline">{video}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Show Less" : "Show More"}
            </Button>
            
            {module.status !== "locked" && (
              <Button size="sm" asChild>
                <Link to={`/courses/${module.id}`}>
                  {module.status === "completed" ? "Review" : "Continue"}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoadmapCard;
