 import type { Tables } from '@/integrations/supabase/types';

// Define the type for a single module based on the Supabase table row
// This represents the raw data structure before adding progress/status
type RoadmapModuleData = Tables<'modules'>;

export const allRoadmapModules: RoadmapModuleData[] = [
  {
    id: "dd411cd7-b168-4e37-aed4-a3558764d04e",
    title: "Python Fundamentals for AI/ML",
    description: "Learn the basics of Python programming specifically focused on data manipulation and analysis for AI/ML applications.",
    difficulty_level: "beginner", // Changed from Beginner to beginner to match fetched data
    estimated_hours: 10,
    prerequisites: [],
    category: "programming",
    learning_style: ["visual", "hands-on"],
    resources: {
      videos: ["Python Crash Course", "Python for Beginners"],
      projects: ["Data Analysis Mini-Project"],
      readings: ["Introduction to Python", "Python for Data Science"],
      exercises: ["Basic Python Syntax", "Working with Data Types"]
    },
    created_at: "2025-04-13 09:24:04.927209+00",
    updated_at: "2025-04-13 09:24:04.927209+00"
  },
  {
    id: "4436f953-5044-4fe1-979b-b0bc13356ebe",
    title: "Data Analysis with Pandas",
    description: "Master data manipulation and analysis using the Pandas library in Python.",
    difficulty_level: "beginner", // Changed from Beginner to beginner
    estimated_hours: 15,
    prerequisites: [],
    category: "data-analysis",
    learning_style: ["hands-on", "project-based"],
    resources: {
      videos: ["Pandas Tutorial Series", "Data Analysis Workflows"],
      projects: ["Real-world Data Analysis Project"],
      readings: ["Pandas Documentation", "Data Analysis Guide"],
      exercises: ["Data Cleaning", "Data Transformation"]
    },
    created_at: "2025-04-13 09:24:04.927209+00",
    updated_at: "2025-04-13 09:24:04.927209+00"
  },
  {
    id: "dabd1d9c-99ec-4536-948a-399c8d4b356e",
    title: "Machine Learning Basics",
    description: "Introduction to fundamental machine learning concepts and algorithms.",
    difficulty_level: "intermediate", // Changed from Intermediate to intermediate
    estimated_hours: 20,
    prerequisites: [],
    category: "machine-learning",
    learning_style: ["theoretical", "hands-on"],
    resources: {
      videos: ["ML Algorithms Explained", "Practical ML Implementation"],
      projects: ["Classification Project", "Regression Project"],
      readings: ["ML Fundamentals", "Scikit-learn Documentation"],
      exercises: ["Model Training", "Model Evaluation"]
    },
    created_at: "2025-04-13 09:24:04.927209+00",
    updated_at: "2025-04-13 09:24:04.927209+00"
  },
  {
    id: "5c85ccb5-9222-4863-ae34-3463b38c9ac6",
    title: "Neural Networks and Deep Learning",
    description: "Deep dive into neural networks architecture and implementation using modern frameworks.",
    difficulty_level: "advanced", // Changed from Advanced to advanced
    estimated_hours: 25,
    prerequisites: [],
    category: "deep-learning",
    learning_style: ["theoretical", "project-based"],
    resources: {
      videos: ["Neural Networks from Scratch", "PyTorch Tutorials"],
      projects: ["Image Classification", "Natural Language Processing"],
      readings: ["Deep Learning Book", "Neural Networks Guide"],
      exercises: ["Building Neural Networks", "Training Deep Models"]
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
      videos: ["Essence of Linear Algebra", "Khan Academy Linear Algebra"],
      projects: [],
      readings: ["Linear Algebra Review Notes", "Chapter 2 of Deep Learning Book"],
      exercises: ["Vector Operations", "Matrix Multiplication"]
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
    prerequisites: ["dd411cd7-b168-4e37-aed4-a3558764d04e", "dabd1d9c-99ec-4536-948a-399c8d4b356e"], // Python, ML Basics
    category: "nlp",
    learning_style: ["theoretical", "hands-on"],
    resources: {
      videos: ["NLP Course by Dan Jurafsky", "spaCy Basics"],
      projects: ["Sentiment Analysis Project"],
      readings: ["Speech and Language Processing (Jurafsky & Martin)", "NLTK Book"],
      exercises: ["Text Preprocessing", "Tokenization"]
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
    prerequisites: ["dd411cd7-b168-4e37-aed4-a3558764d04e"], // Python
    category: "computer-vision",
    learning_style: ["project-based", "hands-on"],
    resources: {
      videos: ["OpenCV Python Tutorials", "Intro to Computer Vision"],
      projects: ["Object Detection Mini-Project"],
      readings: ["OpenCV Documentation", "Learning OpenCV Book"],
      exercises: ["Image Filtering", "Feature Detection"]
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
    prerequisites: ["dabd1d9c-99ec-4536-948a-399c8d4b356e", "5c85ccb5-9222-4863-ae34-3463b38c9ac6"], // ML Basics, Deep Learning
    category: "mlops",
    learning_style: ["theoretical", "hands-on"],
    resources: {
      videos: ["MLOps Zoomcamp", "AWS SageMaker Intro"],
      projects: ["Simple Model Deployment Pipeline"],
      readings: ["Designing Machine Learning Systems Book", "Google MLOps Whitepaper"],
      exercises: ["Containerizing a Model", "Setting up Monitoring"]
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
    prerequisites: ["dd411cd7-b168-4e37-aed4-a3558764d04e", "4436f953-5044-4fe1-979b-b0bc13356ebe"], // Python, Pandas
    category: "data-analysis",
    learning_style: ["visual", "hands-on"],
    resources: {
      videos: ["Matplotlib Tutorial", "Seaborn Guide"],
      projects: ["Exploratory Data Analysis Visualization"],
      readings: ["Matplotlib Documentation", "Seaborn Examples Gallery"],
      exercises: ["Creating Different Plot Types", "Customizing Plots"]
    },
    created_at: "2025-04-26 18:00:00.000000+00",
    updated_at: "2025-04-26 18:00:00.000000+00"
  }
];
