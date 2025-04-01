
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-b from-aiml-accent to-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Your <span className="gradient-heading">AI-powered</span> learning journey starts here
            </h1>
            <p className="text-lg text-gray-600">
              AIML Odyssey creates personalized learning paths for mastering AI and Machine Learning, tailored to your goals, schedule, and learning style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link to="/onboarding">
                  Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/courses">
                  Explore Courses
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200 max-w-md mx-auto">
              <div className="space-y-4">
                <div className="h-2 w-20 bg-aiml-primary rounded"></div>
                <h3 className="text-xl font-semibold">Your Personalized Roadmap</h3>
                <div className="space-y-3">
                  {['Python Fundamentals', 'Data Analysis with Pandas', 'Machine Learning Basics', 'Neural Networks'].map((item, index) => (
                    <div key={index} className="flex items-center p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <div className={`h-3 w-3 rounded-full mr-3 ${index <= 1 ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                      <span className="text-sm font-medium">{item}</span>
                      {index <= 1 && (
                        <div className="ml-auto px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                          Completed
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="pt-2">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-aiml-primary to-aiml-secondary rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">45% completed</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -top-6 -left-6 w-20 h-20 bg-aiml-secondary/10 rounded-full z-[-1]"></div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-aiml-primary/10 rounded-full z-[-1]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
