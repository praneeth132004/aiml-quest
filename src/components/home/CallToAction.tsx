
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Master AI and Machine Learning?</h2>
          <p className="text-gray-600 mb-8">
            Join thousands of learners who have accelerated their AI/ML careers with our personalized learning platform.
          </p>
          <div className="bg-gradient-to-r from-aiml-primary to-aiml-secondary p-8 rounded-lg shadow-lg">
            <h3 className="text-white text-2xl font-bold mb-4">Begin Your AI/ML Journey Today</h3>
            <p className="text-white/90 mb-6">
              In just 5 minutes, we'll create a customized learning path to help you achieve your goals.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/onboarding">
                Create Your Roadmap <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
