
import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import PostCard, { Post } from "@/components/community/PostCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, TrendingUp, Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for community posts
const mockPosts: Post[] = [
  {
    id: "post-1",
    title: "How to optimize hyperparameters in neural networks?",
    content: "I've been working with neural networks for my image classification project, but I'm struggling with hyperparameter tuning. What approaches do you recommend for effectively optimizing learning rate, batch size, and network architecture? I've tried grid search but it's computationally expensive.",
    author: {
      name: "Alex Johnson",
      avatar: "",
      initials: "AJ",
    },
    createdAt: "2 hours ago",
    tags: ["neural-networks", "optimization", "hyperparameters"],
    upvotes: 24,
    downvotes: 2,
    comments: 8,
  },
  {
    id: "post-2",
    title: "Best resources to learn reinforcement learning from scratch?",
    content: "I'm looking to dive into reinforcement learning but finding the learning curve quite steep. Can anyone recommend good beginner-friendly resources (books, courses, tutorials) that helped you get started? I have a strong background in Python and basic ML concepts.",
    author: {
      name: "Maya Patel",
      avatar: "",
      initials: "MP",
    },
    createdAt: "5 hours ago",
    tags: ["reinforcement-learning", "resources", "beginner"],
    upvotes: 31,
    downvotes: 0,
    comments: 12,
  },
  {
    id: "post-3",
    title: "Handling imbalanced datasets for fraud detection",
    content: "I'm working on a fraud detection model where only about 0.5% of transactions are fraudulent. What techniques have worked well for you in handling such extreme class imbalance? I've tried SMOTE and class weights but still struggling with false positives.",
    author: {
      name: "Sam Wilson",
      avatar: "",
      initials: "SW",
    },
    createdAt: "12 hours ago",
    tags: ["imbalanced-data", "fraud-detection", "classification"],
    upvotes: 18,
    downvotes: 1,
    comments: 7,
  },
  {
    id: "post-4",
    title: "Transitioning from software engineering to ML engineering",
    content: "I've been a backend software engineer for 5 years and want to transition to ML engineering. What skills should I focus on learning first? How different is the day-to-day work? Any advice from those who made a similar career switch would be much appreciated.",
    author: {
      name: "Jordan Lee",
      avatar: "",
      initials: "JL",
    },
    createdAt: "1 day ago",
    tags: ["career", "ml-engineering", "transition"],
    upvotes: 42,
    downvotes: 3,
    comments: 15,
  },
];

const CommunityPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("trending");

  // Filter posts based on search
  const filteredPosts = mockPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort posts based on active tab
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (activeTab === "trending") {
      return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
    } else if (activeTab === "recent") {
      // This is simplified - in a real app, you'd use actual dates
      return a.createdAt.localeCompare(b.createdAt);
    } else if (activeTab === "most-commented") {
      return b.comments - a.comments;
    }
    return 0;
  });

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Community</h1>
            <p className="text-gray-600">
              Connect with fellow learners, ask questions, and share your knowledge.
            </p>
          </div>
          <Button className="mt-4 md:mt-0" asChild>
            <Link to="/community/create-post">
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
          <Input
            placeholder="Search discussions..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Tabs defaultValue="trending" className="mb-8">
          <TabsList>
            <TabsTrigger 
              value="trending" 
              onClick={() => setActiveTab("trending")}
              className="flex items-center"
            >
              <TrendingUp className="mr-1 h-4 w-4" />
              Trending
            </TabsTrigger>
            <TabsTrigger 
              value="recent" 
              onClick={() => setActiveTab("recent")}
              className="flex items-center"
            >
              <Clock className="mr-1 h-4 w-4" />
              Recent
            </TabsTrigger>
            <TabsTrigger 
              value="most-commented" 
              onClick={() => setActiveTab("most-commented")}
              className="flex items-center"
            >
              <Star className="mr-1 h-4 w-4" />
              Most Discussed
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-6">
          {sortedPosts.length > 0 ? (
            sortedPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500">No posts found matching your search.</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link to="/community/create-post">Create a New Post</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default CommunityPage;
