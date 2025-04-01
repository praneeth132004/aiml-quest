
import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import RoadmapCard, { Module } from "@/components/roadmap/RoadmapCard";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2, BookOpen, Calendar, Download } from "lucide-react";

// Mock data for roadmap modules
const mockModules: Module[] = [
  {
    id: "module-1",
    title: "Python Fundamentals for AI/ML",
    description: "Learn the basics of Python programming specifically focused on data manipulation and analysis for AI/ML applications.",
    status: "completed",
    estimatedHours: 10,
    resources: {
      readings: ["Introduction to Python", "Python for Data Science"],
      videos: ["Python Crash Course", "Python for Beginners"],
    },
    progress: 100,
  },
  {
    id: "module-2",
    title: "Data Analysis with Pandas",
    description: "Master data manipulation, cleaning, and exploratory analysis using the powerful Pandas library.",
    status: "in-progress",
    estimatedHours: 15,
    resources: {
      readings: ["Pandas Documentation", "Data Cleaning with Python"],
      videos: ["Pandas Tutorial Series", "Data Analysis Masterclass"],
    },
    progress: 60,
  },
  {
    id: "module-3",
    title: "Introduction to Machine Learning",
    description: "Learn fundamental ML concepts, including supervised and unsupervised learning, model evaluation, and basic algorithms.",
    status: "locked",
    estimatedHours: 20,
    resources: {
      readings: ["ML Fundamentals", "Introduction to Statistical Learning"],
      videos: ["ML Crash Course by Google", "Andrew Ng's ML Course"],
    },
    progress: 0,
  },
  {
    id: "module-4",
    title: "Neural Networks and Deep Learning",
    description: "Explore the fundamentals of neural networks, backpropagation, and deep learning architectures.",
    status: "locked",
    estimatedHours: 25,
    resources: {
      readings: ["Deep Learning Book", "Neural Networks for Beginners"],
      videos: ["Deep Learning Specialization", "PyTorch Tutorials"],
    },
    progress: 0,
  },
];

const RoadmapPage = () => {
  const [activeTab, setActiveTab] = useState("all");

  // Calculate overall progress
  const totalModules = mockModules.length;
  const completedModules = mockModules.filter(m => m.status === "completed").length;
  const inProgressModules = mockModules.filter(m => m.status === "in-progress").length;
  const overallProgress = Math.round(
    (completedModules + inProgressModules * 0.5) / totalModules * 100
  );

  // Filter modules based on active tab
  const filteredModules = mockModules.filter(module => {
    if (activeTab === "all") return true;
    return module.status === activeTab;
  });

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Learning Roadmap</h1>
            <p className="text-gray-600 mb-4">
              Your personalized journey to mastering AI and Machine Learning.
            </p>
          </div>
          <Button variant="outline" className="mt-4 md:mt-0">
            <Download className="mr-2 h-4 w-4" />
            Export Roadmap
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-2">
                <BookOpen className="h-5 w-5 text-aiml-primary mr-2" />
                <h3 className="font-semibold">Overall Progress</h3>
              </div>
              <div className="mt-2">
                <div className="flex justify-between mb-1 text-sm">
                  <span>{overallProgress}% Complete</span>
                  <span>{completedModules}/{totalModules} Modules</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-2">
                <BarChart2 className="h-5 w-5 text-aiml-primary mr-2" />
                <h3 className="font-semibold">Time Invested</h3>
              </div>
              <div className="mt-2 space-y-1">
                <div className="text-2xl font-bold">{completedModules * 10}+ hours</div>
                <div className="text-sm text-gray-500">Learning time logged</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-2">
                <Calendar className="h-5 w-5 text-aiml-primary mr-2" />
                <h3 className="font-semibold">Estimated Completion</h3>
              </div>
              <div className="mt-2 space-y-1">
                <div className="text-2xl font-bold">6 weeks</div>
                <div className="text-sm text-gray-500">At your current pace</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setActiveTab("all")}>All Modules</TabsTrigger>
            <TabsTrigger value="in-progress" onClick={() => setActiveTab("in-progress")}>In Progress</TabsTrigger>
            <TabsTrigger value="completed" onClick={() => setActiveTab("completed")}>Completed</TabsTrigger>
            <TabsTrigger value="locked" onClick={() => setActiveTab("locked")}>Upcoming</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredModules.map((module) => (
            <RoadmapCard key={module.id} module={module} />
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default RoadmapPage;
