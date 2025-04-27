
import { Link } from 'react-router-dom';
import { BookOpen, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-aiml-light border-t mt-12">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-aiml-primary to-aiml-secondary flex items-center justify-center mr-2">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl">AIML Odyssey</span>
            </div>
            <p className="text-gray-600 text-sm">
              Your personalized journey through the world of AI and Machine Learning, crafted just for you.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-aiml-primary">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-aiml-primary">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-aiml-primary">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Explore</h3>
            <ul className="space-y-2">
              <li><Link to="/roadmap" className="text-gray-600 hover:text-aiml-primary text-sm">Roadmap</Link></li>
              <li><Link to="/courses" className="text-gray-600 hover:text-aiml-primary text-sm">Courses</Link></li>
              <li><Link to="/quizzes" className="text-gray-600 hover:text-aiml-primary text-sm">Quizzes</Link></li>
              <li><Link to="/community" className="text-gray-600 hover:text-aiml-primary text-sm">Community</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-aiml-primary text-sm">Terms of Service</a></li>
              <li><a href="#" className="text-gray-600 hover:text-aiml-primary text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-aiml-primary text-sm">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} AIML Odyssey. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
