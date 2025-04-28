 import type { Tables } from '@/integrations/supabase/types';

// Define the type for a single module based on the Supabase table row
type RoadmapModuleData = Tables<'modules'>;

interface ResourceLink {
  title: string;
  url: string;
  provider?: string;
}

interface ModuleResources {
  videos: ResourceLink[];
  projects: ResourceLink[];
  readings: ResourceLink[];
  exercises: ResourceLink[];
}

export const allRoadmapModules: RoadmapModuleData[] = [
  {
    id: "dd411cd7-b168-4e37-aed4-a3558764d04e",
    title: "Python Fundamentals for AI/ML",
    description: "Learn the basics of Python programming specifically focused on data manipulation and analysis for AI/ML applications.",
    difficulty_level: "beginner",
    estimated_hours: 10,
    prerequisites: [],
    category: "programming",
    learning_style: ["visual", "hands-on"],
    resources: {
      videos: [
        {
          title: "Python Crash Course",
          url: "https://www.youtube.com/watch?v=JJmcL1N2KQs",
          provider: "freeCodeCamp"
        },
        {
          title: "Python for Beginners",
          url: "https://www.coursera.org/learn/python-for-applied-data-science-ai",
          provider: "Coursera"
        }
      ],
      projects: [
        {
          title: "Data Analysis Mini-Project",
          url: "https://github.com/practical-tutorials/python-mini-projects",
          provider: "GitHub"
        }
      ],
      readings: [
        {
          title: "Introduction to Python",
          url: "https://docs.python.org/3/tutorial/",
          provider: "Python.org"
        },
        {
          title: "Python for Data Science",
          url: "https://jakevdp.github.io/PythonDataScienceHandbook/",
          provider: "Jake VanderPlas"
        }
      ],
      exercises: [
        {
          title: "Basic Python Syntax",
          url: "https://www.w3schools.com/python/exercise.asp",
          provider: "W3Schools"
        },
        {
          title: "Working with Data Types",
          url: "https://www.hackerrank.com/domains/python",
          provider: "HackerRank"
        }
      ]
    },
    created_at: "2025-04-13 09:24:04.927209+00",
    updated_at: "2025-04-13 09:24:04.927209+00"
  },
  {
    id: "4436f953-5044-4fe1-979b-b0bc13356ebe",
    title: "Data Analysis with Pandas",
    description: "Master data manipulation and analysis using the Pandas library in Python.",
    difficulty_level: "beginner",
    estimated_hours: 15,
    prerequisites: [],
    category: "data-analysis",
    learning_style: ["hands-on", "project-based"],
    resources: {
      videos: [
        {
          title: "Pandas Tutorial Series",
          url: "https://www.youtube.com/watch?v=ZyhVh-qRZPA&list=PL-osiE80TeTsWmV9i9c58mdDCSskIFdDS",
          provider: "Corey Schafer"
        },
        {
          title: "Data Analysis Workflows",
          url: "https://www.datacamp.com/courses/pandas-foundations",
          provider: "DataCamp"
        }
      ],
      projects: [
        {
          title: "Real-world Data Analysis Project",
          url: "https://www.kaggle.com/learn/pandas",
          provider: "Kaggle"
        }
      ],
      readings: [
        {
          title: "Pandas Documentation",
          url: "https://pandas.pydata.org/docs/",
          provider: "pandas.org"
        },
        {
          title: "Data Analysis Guide",
          url: "https://pandas.pydata.org/pandas-docs/stable/user_guide/10min.html",
          provider: "pandas.org"
        }
      ],
      exercises: [
        {
          title: "Data Cleaning",
          url: "https://www.kaggle.com/learn/data-cleaning",
          provider: "Kaggle"
        },
        {
          title: "Data Transformation",
          url: "https://www.kaggle.com/learn/data-visualization",
          provider: "Kaggle"
        }
      ]
    },
    created_at: "2025-04-13 09:24:04.927209+00",
    updated_at: "2025-04-13 09:24:04.927209+00"
  },
  {
    id: "dabd1d9c-99ec-4536-948a-399c8d4b356e",
    title: "Machine Learning Basics",
    description: "Introduction to fundamental machine learning concepts and algorithms.",
    difficulty_level: "intermediate",
    estimated_hours: 20,
    prerequisites: [],
    category: "machine-learning",
    learning_style: ["theoretical", "hands-on"],
    resources: {
      videos: [
        {
          title: "ML Algorithms Explained",
          url: "https://www.coursera.org/learn/machine-learning",
          provider: "Coursera - Andrew Ng"
        },
        {
          title: "Practical ML Implementation",
          url: "https://www.fast.ai/",
          provider: "fast.ai"
        }
      ],
      projects: [
        {
          title: "Classification Project",
          url: "https://www.kaggle.com/competitions/titanic",
          provider: "Kaggle"
        },
        {
          title: "Regression Project",
          url: "https://www.kaggle.com/competitions/house-prices-advanced-regression-techniques",
          provider: "Kaggle"
        }
      ],
      readings: [
        {
          title: "ML Fundamentals",
          url: "https://developers.google.com/machine-learning/crash-course",
          provider: "Google"
        },
        {
          title: "Scikit-learn Documentation",
          url: "https://scikit-learn.org/stable/tutorial/index.html",
          provider: "scikit-learn"
        }
      ],
      exercises: [
        {
          title: "Model Training",
          url: "https://www.kaggle.com/learn/intro-to-machine-learning",
          provider: "Kaggle"
        },
        {
          title: "Model Evaluation",
          url: "https://www.kaggle.com/learn/intermediate-machine-learning",
          provider: "Kaggle"
        }
      ]
    },
    created_at: "2025-04-13 09:24:04.927209+00",
    updated_at: "2025-04-13 09:24:04.927209+00"
  },
  {
    id: "5c85ccb5-9222-4863-ae34-3463b38c9ac6",
    title: "Neural Networks and Deep Learning",
    description: "Deep dive into neural networks architecture and implementation using modern frameworks.",
    difficulty_level: "advanced",
    estimated_hours: 25,
    prerequisites: [],
    category: "deep-learning",
    learning_style: ["theoretical", "project-based"],
    resources: {
      videos: [
        {
          title: "Neural Networks from Scratch",
          url: "https://www.youtube.com/watch?v=aircAruvnKk",
          provider: "3Blue1Brown"
        },
        {
          title: "PyTorch Tutorials",
          url: "https://pytorch.org/tutorials/",
          provider: "PyTorch"
        }
      ],
      projects: [
        {
          title: "Image Classification",
          url: "https://www.kaggle.com/competitions/cifar-10",
          provider: "Kaggle"
        },
        {
          title: "Natural Language Processing",
          url: "https://www.kaggle.com/competitions/jigsaw-toxic-comment-classification-challenge",
          provider: "Kaggle"
        }
      ],
      readings: [
        {
          title: "Deep Learning Book",
          url: "https://www.deeplearningbook.org/",
          provider: "Ian Goodfellow, Yoshua Bengio, Aaron Courville"
        },
        {
          title: "Neural Networks Guide",
          url: "https://www.deeplearning.ai/ai-notes/ai-notes-neural-networks/",
          provider: "DeepLearning.ai"
        }
      ],
      exercises: [
        {
          title: "Building Neural Networks",
          url: "https://www.coursera.org/learn/neural-networks-deep-learning",
          provider: "Coursera"
        },
        {
          title: "Training Deep Models",
          url: "https://www.fast.ai/2018/04/29/deep-learning/",
          provider: "fast.ai"
        }
      ]
    },
    created_at: "2025-04-13 09:24:04.927209+00",
    updated_at: "2025-04-13 09:24:04.927209+00"
  },
  {
    id: "a1b2c3d4-e5f6-7890-1234-567890abcdef", // Example UUID - replace with actual generation if possible
    title: "Linear Algebra for Machine Learning",
    description: "Fundamental concepts of linear algebra essential for understanding many ML algorithms.",
    difficulty_level: "beginner",
    estimated_hours: 12,
    prerequisites: [],
    category: "mathematical-foundations",
    learning_style: ["theoretical", "visual"],
    resources: {
      videos: [
        {
          title: "Essence of Linear Algebra",
          url: "https://www.youtube.com/watch?v=fNk_zzaMoSs",
          provider: "3Blue1Brown"
        },
        {
          title: "Khan Academy Linear Algebra",
          url: "https://www.khanacademy.org/math/linear-algebra",
          provider: "Khan Academy"
        }
      ],
      projects: [],
      readings: [
        {
          title: "Linear Algebra Review Notes",
          url: "https://www.math.uwaterloo.ca/~cswartz/LinearAlgebra/LinearAlgebra.pdf",
          provider: "University of Waterloo"
        },
        {
          title: "Chapter 2 of Deep Learning Book",
          url: "https://www.deeplearningbook.org/contents/linear-algebra.html",
          provider: "Ian Goodfellow, Yoshua Bengio, Aaron Courville"
        }
      ],
      exercises: [
        {
          title: "Vector Operations",
          url: "https://www.khanacademy.org/math/linear-algebra/vectors-and-spaces",
          provider: "Khan Academy"
        },
        {
          title: "Matrix Multiplication",
          url: "https://www.khanacademy.org/math/linear-algebra/matrix-transformations",
          provider: "Khan Academy"
        }
      ]
    },
    created_at: "2025-04-26 18:00:00.000000+00",
    updated_at: "2025-04-26 18:00:00.000000+00"
  },
  {
    id: "b2c3d4e5-f6a7-8901-2345-67890abcdef1", // Example UUID
    title: "Introduction to Natural Language Processing",
    description: "Explore techniques for processing and understanding human language.",
    difficulty_level: "intermediate",
    estimated_hours: 18,
    prerequisites: ["Python Fundamentals for AI/ML", "Machine Learning Basics"],
    category: "nlp",
    learning_style: ["theoretical", "hands-on"],
    resources: {
      videos: [
        {
          title: "NLP Course by Dan Jurafsky",
          url: "https://www.youtube.com/playlist?list=PL397E765BA0822230",
          provider: "Stanford University"
        },
        {
          title: "spaCy Basics",
          url: "https://spacy.io/usage/spacy-101",
          provider: "spaCy"
        }
      ],
      projects: [
        {
          title: "Sentiment Analysis Project",
          url: "https://github.com/practical-tutorials/nlp-mini-projects",
          provider: "GitHub"
        }
      ],
      readings: [
        {
          title: "Speech and Language Processing (Jurafsky & Martin)",
          url: "https://web.stanford.edu/~jurafsky/slp3/",
          provider: "Stanford University"
        },
        {
          title: "NLTK Book",
          url: "https://www.nltk.org/book/",
          provider: "NLTK"
        }
      ],
      exercises: [
        {
          title: "Text Preprocessing",
          url: "https://www.kaggle.com/learn/natural-language-processing",
          provider: "Kaggle"
        },
        {
          title: "Tokenization",
          url: "https://www.kaggle.com/learn/word2vec-nlp-tutorial",
          provider: "Kaggle"
        }
      ]
    },
    created_at: "2025-04-26 18:00:00.000000+00",
    updated_at: "2025-04-26 18:00:00.000000+00"
  },
  {
    id: "c3d4e5f6-a7b8-9012-3456-7890abcdef12", // Example UUID
    title: "Computer Vision Fundamentals with OpenCV",
    description: "Learn the basics of image processing and computer vision using the OpenCV library.",
    difficulty_level: "intermediate",
    estimated_hours: 20,
    prerequisites: ["Python Fundamentals for AI/ML"],
    category: "computer-vision",
    learning_style: ["project-based", "hands-on"],
    resources: {
      videos: [
        {
          title: "OpenCV Python Tutorials",
          url: "https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html",
          provider: "OpenCV"
        },
        {
          title: "Intro to Computer Vision",
          url: "https://www.youtube.com/watch?v=0F3oYcd514g",
          provider: "freeCodeCamp"
        }
      ],
      projects: [
        {
          title: "Object Detection Mini-Project",
          url: "https://github.com/practical-tutorials/opencv-mini-projects",
          provider: "GitHub"
        }
      ],
      readings: [
        {
          title: "OpenCV Documentation",
          url: "https://docs.opencv.org/4.x/",
          provider: "OpenCV"
        },
        {
          title: "Learning OpenCV Book",
          url: "https://www.amazon.com/Learning-OpenCV-Computer-Vision-Library/dp/0596516134",
          provider: "Amazon"
        }
      ],
      exercises: [
        {
          title: "Image Filtering",
          url: "https://docs.opencv.org/4.x/d4/d86/tutorial_py_image_filtering.html",
          provider: "OpenCV"
        },
        {
          title: "Feature Detection",
          url: "https://docs.opencv.org/4.x/dc/d01/tutorial_py_feature_detection.html",
          provider: "OpenCV"
        }
      ]
    },
    created_at: "2025-04-26 18:00:00.000000+00",
    updated_at: "2025-04-26 18:00:00.000000+00"
  },
  {
    id: "d4e5f6a7-b8c9-0123-4567-890abcdef123", // Example UUID
    title: "Introduction to MLOps",
    description: "Understand the principles and practices for deploying, monitoring, and maintaining ML models in production.",
    difficulty_level: "advanced",
    estimated_hours: 22,
    prerequisites: ["Machine Learning Basics", "Neural Networks and Deep Learning"],
    category: "mlops",
    learning_style: ["theoretical", "hands-on"],
    resources: {
      videos: [
        {
          title: "MLOps Zoomcamp",
          url: "https://www.youtube.com/watch?v=UdAa0GzgGjw",
          provider: "MLOps Zoomcamp"
        },
        {
          title: "AWS SageMaker Intro",
          url: "https://www.youtube.com/watch?v=5GzvGzvGzvG",
          provider: "AWS"
        }
      ],
      projects: [
        {
          title: "Simple Model Deployment Pipeline",
          url: "https://github.com/practical-tutorials/mlops-mini-projects",
          provider: "GitHub"
        }
      ],
      readings: [
        {
          title: "Designing Machine Learning Systems Book",
          url: "https://www.manning.com/books/designing-machine-learning-systems",
          provider: "Manning Publications"
        },
        {
          title: "Google MLOps Whitepaper",
          url: "https://ai.google/research/mlops",
          provider: "Google"
        }
      ],
      exercises: [
        {
          title: "Containerizing a Model",
          url: "https://www.kaggle.com/learn/docker",
          provider: "Kaggle"
        },
        {
          title: "Setting up Monitoring",
          url: "https://www.kaggle.com/learn/mlops",
          provider: "Kaggle"
        }
      ]
    },
    created_at: "2025-04-26 18:00:00.000000+00",
    updated_at: "2025-04-26 18:00:00.000000+00"
  },
  {
    id: "e5f6a7b8-c9d0-1234-5678-90abcdef1234", // Example UUID
    title: "Data Visualization with Matplotlib & Seaborn",
    description: "Learn to create informative and visually appealing plots for data exploration and communication.",
    difficulty_level: "beginner",
    estimated_hours: 10,
    prerequisites: ["Python Fundamentals for AI/ML", "Data Analysis with Pandas"],
    category: "data-analysis",
    learning_style: ["visual", "hands-on"],
    resources: {
      videos: [
        {
          title: "Matplotlib Tutorial",
          url: "https://www.youtube.com/watch?v=UO98lJQ5QmM",
          provider: "freeCodeCamp"
        },
        {
          title: "Seaborn Guide",
          url: "https://seaborn.pydata.org/tutorial.html",
          provider: "Seaborn"
        }
      ],
      projects: [
        {
          title: "Exploratory Data Analysis Visualization",
          url: "https://github.com/practical-tutorials/eda-mini-projects",
          provider: "GitHub"
        }
      ],
      readings: [
        {
          title: "Matplotlib Documentation",
          url: "https://matplotlib.org/stable/contents.html",
          provider: "Matplotlib"
        },
        {
          title: "Seaborn Examples Gallery",
          url: "https://seaborn.pydata.org/examples/index.html",
          provider: "Seaborn"
        }
      ],
      exercises: [
        {
          title: "Creating Different Plot Types",
          url: "https://matplotlib.org/stable/gallery/index.html",
          provider: "Matplotlib"
        },
        {
          title: "Customizing Plots",
          url: "https://seaborn.pydata.org/tutorial/aesthetics.html",
          provider: "Seaborn"
        }
      ]
    },
    created_at: "2025-04-26 18:00:00.000000+00",
    updated_at: "2025-04-26 18:00:00.000000+00"
  }
];
