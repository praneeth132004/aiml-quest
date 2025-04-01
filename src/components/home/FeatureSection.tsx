
import { BookOpen, BarChart2, Users, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Personalized Learning Paths",
    description: "Our AI analyzes your goals, experience, and learning style to create a custom roadmap just for you.",
    icon: <BarChart2 className="h-10 w-10 text-aiml-primary" />,
  },
  {
    title: "Interactive Courses",
    description: "Engage with hands-on projects, video lectures, and coding exercises designed to reinforce learning.",
    icon: <BookOpen className="h-10 w-10 text-aiml-primary" />,
  },
  {
    title: "AI/ML Community",
    description: "Connect with fellow learners, share insights, ask questions, and collaborate on real-world projects.",
    icon: <Users className="h-10 w-10 text-aiml-primary" />,
  },
  {
    title: "Track Your Progress",
    description: "Monitor your advancement with detailed analytics and receive personalized recommendations to keep improving.",
    icon: <CheckCircle className="h-10 w-10 text-aiml-primary" />,
  },
];

const FeatureSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How AIML Odyssey Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our AI-powered platform adapts to your needs, creating a truly customized learning experience that evolves as you progress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border border-gray-200 card-hover">
              <CardHeader className="pb-2">
                <div className="mb-4">{feature.icon}</div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
