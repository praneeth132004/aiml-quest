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
          title: "Python for Everybody (Full University Course)",
          url: "https://www.youtube.com/watch?v=8DvywoWv6fI",
          provider: "freeCodeCamp"
        },
        {
          title: "AI Python for Beginners",
          url: "https://www.deeplearning.ai/short-courses/ai-python-for-beginners/",
          provider: "DeepLearning.AI"
        }
      ],
      projects: [
        {
          title: "Python Practice",
          url: "https://www.hackerrank.com/domains/python",
          provider: "HackerRank"
        }
      ],
      readings: [
        {
          title: "The Python Tutorial",
          url: "https://docs.python.org/3/tutorial/index.html",
          provider: "Python.org"
        },
        {
          title: "Automate the Boring Stuff with Python",
          url: "https://automatetheboringstuff.com/",
          provider: "Al Sweigart"
        }
      ],
      exercises: [
        {
          title: "Python Course",
          url: "https://www.kaggle.com/learn/python",
          provider: "Kaggle Learn"
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
          title: "Pandas Playlist",
          url: "https://www.youtube.com/playlist?list=PL-osiE80TeTsWmV9i9c58mdDCSskIFdDS",
          provider: "Corey Schafer"
        },
        {
          title: "Pandas Q&A",
          url: "https://www.youtube.com/playlist?list=PL5-da3qGB5IAMNCDP07y3v7MAwG9S9w9_",
          provider: "Data School"
        }
      ],
      projects: [
        {
          title: "Pandas Course",
          url: "https://www.kaggle.com/learn/pandas",
          provider: "Kaggle Learn"
        }
      ],
      readings: [
        {
          title: "Pandas User Guide",
          url: "https://pandas.pydata.org/docs/user_guide/index.html",
          provider: "pandas.org"
        },
        {
          title: "Python for Data Analysis, 3rd Edition",
          url: "https://github.com/wesm/pydata-book",
          provider: "Wes McKinney"
        }
      ],
      exercises: [
        {
          title: "Modern Pandas",
          url: "https://tomaugspurger.github.io/modern-pandas",
          provider: "Tom Augspurger"
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
          title: "Machine Learning Specialization",
          url: "https://www.coursera.org/specializations/machine-learning-introduction",
          provider: "Coursera - Andrew Ng"
        },
        {
          title: "StatQuest with Josh Starmer",
          url: "https://www.youtube.com/c/statquest",
          provider: "YouTube"
        }
      ],
      projects: [
        {
          title: "Scikit-learn Tutorials",
          url: "https://scikit-learn.org/stable/tutorial/index.html",
          provider: "scikit-learn"
        },
        {
          title: "Getting Started Competitions",
          url: "https://www.kaggle.com/competitions?competitionType=gettingStarted",
          provider: "Kaggle"
        }
      ],
      readings: [
        {
          title: "An Introduction to Statistical Learning",
          url: "https://www.statlearning.com/",
          provider: "James, Witten, Hastie, Tibshirani"
        },
        {
          title: "Machine Learning Crash Course",
          url: "https://developers.google.com/machine-learning/crash-course",
          provider: "Google"
        }
      ],
      exercises: [
        {
          title: "Scikit-learn Tutorials",
          url: "https://scikit-learn.org/stable/tutorial/index.html",
          provider: "scikit-learn"
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
          title: "Deep Learning Specialization",
          url: "https://www.coursera.org/specializations/deep-learning",
          provider: "DeepLearning.AI"
        },
        {
          title: "Neural Networks Series",
          url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab",
          provider: "3Blue1Brown"
        }
      ],
      projects: [
        {
          title: "Practical Deep Learning for Coders",
          url: "https://course.fast.ai/",
          provider: "Fast.ai"
        },
        {
          title: "Basic Classification / Image Classification",
          url: "https://www.tensorflow.org/tutorials/keras/classification",
          provider: "TensorFlow"
        }
      ],
      readings: [
        {
          title: "Neural Networks and Deep Learning",
          url: "http://neuralnetworksanddeeplearning.com/",
          provider: "Michael Nielsen"
        },
        {
          title: "Deep Learning Book",
          url: "https://www.deeplearningbook.org/",
          provider: "Goodfellow, Bengio, Courville"
        }
      ],
      exercises: [
        {
          title: "Practical Deep Learning for Coders",
          url: "https://course.fast.ai/",
          provider: "Fast.ai"
        }
      ]
    },
    created_at: "2025-04-13 09:24:04.927209+00",
    updated_at: "2025-04-13 09:24:04.927209+00"
  },
  {
    id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
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
          url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab",
          provider: "3Blue1Brown"
        },
        {
          title: "Linear Algebra",
          url: "https://www.khanacademy.org/math/linear-algebra",
          provider: "Khan Academy"
        }
      ],
      projects: [
        {
          title: "NumPy: the absolute basics for beginners",
          url: "https://numpy.org/doc/stable/user/absolute_beginners.html",
          provider: "NumPy"
        }
      ],
      readings: [
        {
          title: "Mathematics for Machine Learning",
          url: "https://mml-book.github.io/",
          provider: "Deisenroth, Faisal, Ong"
        },
        {
          title: "Linear Algebra - MIT OpenCourseWare",
          url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/",
          provider: "Gilbert Strang"
        }
      ],
      exercises: [
        {
          title: "NumPy: the absolute basics for beginners",
          url: "https://numpy.org/doc/stable/user/absolute_beginners.html",
          provider: "NumPy"
        }
      ]
    },
    created_at: "2025-04-26 18:00:00.000000+00",
    updated_at: "2025-04-26 18:00:00.000000+00"
  },
  {
    id: "b2c3d4e5-f6a7-8901-2345-67890abcdef1",
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
          title: "NLP with Deep Learning",
          url: "https://www.youtube.com/playlist?list=PLoROMvodv4rOhcuXMZkNm7j3fVwBBY42z",
          provider: "Stanford CS224N"
        },
        {
          title: "Natural Language Processing Specialization",
          url: "https://www.coursera.org/specializations/natural-language-processing",
          provider: "DeepLearning.AI"
        }
      ],
      projects: [
        {
          title: "Hugging Face Course",
          url: "https://huggingface.co/learn/nlp-course",
          provider: "Hugging Face"
        }
      ],
      readings: [
        {
          title: "Speech and Language Processing",
          url: "https://web.stanford.edu/~jurafsky/slp3/",
          provider: "Jurafsky & Martin"
        },
        {
          title: "NLTK Book",
          url: "https://www.nltk.org/book/",
          provider: "NLTK"
        }
      ],
      exercises: [
        {
          title: "Natural Language Processing",
          url: "https://www.kaggle.com/learn/natural-language-processing",
          provider: "Kaggle Learn"
        }
      ]
    },
    created_at: "2025-04-26 18:00:00.000000+00",
    updated_at: "2025-04-26 18:00:00.000000+00"
  },
  {
    id: "c3d4e5f6-a7b8-9012-3456-7890abcdef12",
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
          title: "OpenCV Tutorials",
          url: "https://docs.opencv.org/4.x/d6/d00/tutorial_table_of_content_core.html",
          provider: "OpenCV"
        },
        {
          title: "OpenCV Course",
          url: "https://www.youtube.com/watch?v=oXlwWbU8l2o",
          provider: "freeCodeCamp"
        }
      ],
      projects: [
        {
          title: "PyImageSearch Blog",
          url: "https://pyimagesearch.com/",
          provider: "Adrian Rosebrock"
        }
      ],
      readings: [
        {
          title: "OpenCV-Python Tutorials",
          url: "https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html",
          provider: "OpenCV"
        },
        {
          title: "Learn OpenCV",
          url: "https://learnopencv.com/",
          provider: "LearnOpenCV"
        }
      ],
      exercises: [
        {
          title: "OpenCV Official Tutorials",
          url: "https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html",
          provider: "OpenCV"
        }
      ]
    },
    created_at: "2025-04-26 18:00:00.000000+00",
    updated_at: "2025-04-26 18:00:00.000000+00"
  },
  {
    id: "d4e5f6a7-b8c9-0123-4567-890abcdef123",
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
          title: "MLOps Specialization",
          url: "https://www.coursera.org/specializations/machine-learning-engineering-for-production-mlops",
          provider: "DeepLearning.AI"
        },
        {
          title: "MLOps Videos",
          url: "https://www.youtube.com/@GoogleCloudTech/search?query=mlops",
          provider: "Google Cloud Tech"
        }
      ],
      projects: [
        {
          title: "MLflow Documentation - Tutorials & Examples",
          url: "https://mlflow.org/docs/latest/tutorials-and-examples/index.html",
          provider: "MLflow"
        }
      ],
      readings: [
        {
          title: "MLOps Principles",
          url: "https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning",
          provider: "Google Cloud"
        },
        {
          title: "Awesome MLOps",
          url: "https://github.com/visenger/awesome-mlops",
          provider: "GitHub"
        }
      ],
      exercises: [
        {
          title: "MLOps Tutorials & Projects",
          url: "https://dagshub.com/docs/tutorials/",
          provider: "DAGsHub"
        }
      ]
    },
    created_at: "2025-04-26 18:00:00.000000+00",
    updated_at: "2025-04-26 18:00:00.000000+00"
  },
  {
    id: "e5f6a7b8-c9d0-1234-5678-90abcdef1234",
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
          title: "Matplotlib Playlist",
          url: "https://www.youtube.com/playlist?list=PL-osiE80TeTvipOqomVEeZ1HRrcEvtZB_",
          provider: "Corey Schafer"
        },
        {
          title: "Introduction to Data Visualization with Seaborn",
          url: "https://www.datacamp.com/courses/introduction-to-data-visualization-with-seaborn",
          provider: "DataCamp"
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
