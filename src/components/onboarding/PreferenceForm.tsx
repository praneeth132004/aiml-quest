
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

const PreferenceForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formState, setFormState] = useState({
    goalArea: "",
    experienceLevel: "",
    timeCommitment: [10], // hours per week, default 10
    learningStyle: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call to generate roadmap
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Preferences saved!",
        description: "Your personalized learning roadmap is ready.",
      });
      navigate("/roadmap");
    }, 2000);
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Personalize Your Learning</CardTitle>
        <CardDescription>
          Tell us about your goals and preferences to create your custom AI/ML learning roadmap.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="goalArea">Your Primary Goal</Label>
            <Select
              required
              onValueChange={(value) => handleChange("goalArea", value)}
              value={formState.goalArea}
            >
              <SelectTrigger id="goalArea">
                <SelectValue placeholder="Select your primary goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="data-science">Career in Data Science</SelectItem>
                <SelectItem value="ml-engineer">Become an ML Engineer</SelectItem>
                <SelectItem value="ai-researcher">AI Research</SelectItem>
                <SelectItem value="business-ai">Apply AI in Business</SelectItem>
                <SelectItem value="hobby">Learning as a Hobby</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experienceLevel">Your Experience Level</Label>
            <Select
              required
              onValueChange={(value) => handleChange("experienceLevel", value)}
              value={formState.experienceLevel}
            >
              <SelectTrigger id="experienceLevel">
                <SelectValue placeholder="Select your experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner (New to Programming)</SelectItem>
                <SelectItem value="intermediate">Intermediate (Some Programming Experience)</SelectItem>
                <SelectItem value="advanced">Advanced (Experienced Programmer)</SelectItem>
                <SelectItem value="expert">Expert (Professional Developer)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="timeCommitment">Weekly Time Commitment</Label>
              <span className="text-sm text-gray-500">{formState.timeCommitment[0]} hours/week</span>
            </div>
            <Slider
              id="timeCommitment"
              min={1}
              max={20}
              step={1}
              value={formState.timeCommitment}
              onValueChange={(value) => handleChange("timeCommitment", value)}
              className="py-4"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="learningStyle">Preferred Learning Style</Label>
            <Select
              required
              onValueChange={(value) => handleChange("learningStyle", value)}
              value={formState.learningStyle}
            >
              <SelectTrigger id="learningStyle">
                <SelectValue placeholder="Select your learning style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visual">Visual (Videos, Diagrams)</SelectItem>
                <SelectItem value="reading">Reading (Articles, Books)</SelectItem>
                <SelectItem value="practical">Practical (Projects, Exercises)</SelectItem>
                <SelectItem value="mixed">Mixed Approach</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          disabled={isSubmitting}
          onClick={handleSubmit}
          className="w-full"
        >
          {isSubmitting ? "Generating Your Roadmap..." : "Create My Learning Roadmap"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PreferenceForm;
