// Define the search result types
export interface SearchResult {
  id: string;
  title: string;
  description: string;
  path: string;
  type: 'page' | 'quiz' | 'course' | 'post';
  icon?: string;
}

// Define the pages to search
const pages: SearchResult[] = [
  {
    id: 'home',
    title: 'Home',
    description: 'Main landing page',
    path: '/',
    type: 'page'
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Your personal dashboard',
    path: '/dashboard',
    type: 'page'
  },
  {
    id: 'roadmap',
    title: 'Learning Roadmap',
    description: 'AI/ML learning path',
    path: '/roadmap',
    type: 'page'
  },
  {
    id: 'quizzes',
    title: 'Quizzes',
    description: 'Test your knowledge',
    path: '/quizzes',
    type: 'page'
  },
  {
    id: 'courses',
    title: 'Courses',
    description: 'Video courses and tutorials',
    path: '/courses',
    type: 'page'
  },
  {
    id: 'community',
    title: 'Community',
    description: 'Discussion forum',
    path: '/community',
    type: 'page'
  },
  {
    id: 'chatbot',
    title: 'AI Chatbot',
    description: 'Get help from our AI assistant',
    path: '/chatbot',
    type: 'page'
  },
  {
    id: 'profile',
    title: 'Profile',
    description: 'View your user profile',
    path: '/profile',
    type: 'page'
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Manage your account settings',
    path: '/settings',
    type: 'page'
  }
];

// Mock function to get quizzes - in a real app, this would fetch from your data source
const getQuizzes = (): SearchResult[] => {
  return [
    {
      id: 'quiz-1',
      title: 'Introduction to Machine Learning',
      description: 'Basic concepts of ML',
      path: '/quizzes?search=machine+learning',
      type: 'quiz'
    },
    {
      id: 'quiz-2',
      title: 'Neural Networks Fundamentals',
      description: 'Learn about neural networks',
      path: '/quizzes?search=neural+networks',
      type: 'quiz'
    }
  ];
};

// Mock function to get courses
const getCourses = (): SearchResult[] => {
  return [
    {
      id: 'course-1',
      title: 'Python for Data Science',
      description: 'Learn Python basics for DS',
      path: '/courses?search=python',
      type: 'course'
    },
    {
      id: 'course-2',
      title: 'Deep Learning with TensorFlow',
      description: 'Build neural networks with TF',
      path: '/courses?search=tensorflow',
      type: 'course'
    }
  ];
};

// Mock function to get community posts
const getPosts = (): SearchResult[] => {
  return [
    {
      id: 'post-1',
      title: 'How to start with AI?',
      description: 'Community discussion',
      path: '/community?search=start+with+ai',
      type: 'post'
    },
    {
      id: 'post-2',
      title: 'Best resources for ML beginners',
      description: 'Community resources',
      path: '/community?search=resources',
      type: 'post'
    }
  ];
};

// Add these helper functions to enhance search capabilities
const getAdditionalSearchTerms = (result: SearchResult): string[] => {
  switch (result.id) {
    case 'profile':
      return ['account', 'user', 'personal information', 'my profile'];
    case 'settings':
      return ['preferences', 'account settings', 'configuration', 'options'];
    case 'dashboard':
      return ['overview', 'home', 'my dashboard', 'learning progress'];
    default:
      return [];
  }
};

// Search function that combines all sources
export const search = (query: string): SearchResult[] => {
  if (!query.trim()) {
    return pages;
  }

  const lowerQuery = query.toLowerCase();
  
  // Search pages with enhanced matching
  const matchedPages = pages.filter(page => 
    page.title.toLowerCase().includes(lowerQuery) ||
    page.description.toLowerCase().includes(lowerQuery) ||
    getAdditionalSearchTerms(page).some(term => term.toLowerCase().includes(lowerQuery))
  );
  
  // Search quizzes
  const matchedQuizzes = getQuizzes().filter(quiz => 
    quiz.title.toLowerCase().includes(lowerQuery) ||
    quiz.description.toLowerCase().includes(lowerQuery)
  );
  
  // Search courses
  const matchedCourses = getCourses().filter(course => 
    course.title.toLowerCase().includes(lowerQuery) ||
    course.description.toLowerCase().includes(lowerQuery)
  );
  
  // Search posts
  const matchedPosts = getPosts().filter(post => 
    post.title.toLowerCase().includes(lowerQuery) ||
    post.description.toLowerCase().includes(lowerQuery)
  );
  
  // Combine all results
  return [
    ...matchedPages,
    ...matchedQuizzes,
    ...matchedCourses,
    ...matchedPosts
  ];
};
