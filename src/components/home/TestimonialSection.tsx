
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    quote: "AIML Odyssey revolutionized my learning experience. The personalized roadmap helped me focus on exactly what I needed to learn without wasting time.",
    name: "Sarah Johnson",
    role: "Data Scientist",
    avatar: "SJ",
  },
  {
    quote: "As someone who tried to learn AI/ML multiple times before, this platform finally made the concepts click for me. The quiz system is especially helpful.",
    name: "Michael Chen",
    role: "Software Engineer",
    avatar: "MC",
  },
  {
    quote: "The community feature is incredible. I've connected with peers who have similar interests and we collaborate on projects together.",
    name: "Aisha Patel",
    role: "ML Engineer",
    avatar: "AP",
  },
];

const TestimonialSection = () => {
  return (
    <section className="py-16 bg-aiml-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Learners Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover how AIML Odyssey has helped professionals and beginners alike master AI and Machine Learning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white border-none shadow-md card-hover">
              <CardContent className="pt-6">
                <div className="mb-6">
                  <svg
                    className="h-8 w-8 text-aiml-secondary opacity-50"
                    fill="currentColor"
                    viewBox="0 0 32 32"
                    aria-hidden="true"
                  >
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                </div>
                <p className="text-gray-700 mb-6">{testimonial.quote}</p>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarFallback className="bg-aiml-primary text-white">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
