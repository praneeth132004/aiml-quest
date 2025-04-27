// Renamed interface and added optional thumbnailUrl
export interface CourseItemData {
  title: string;
  url: string; // Link to the course/video
  thumbnailUrl?: string; // Optional: Direct link to thumbnail image
}

export interface CourseCategory {
  categoryTitle: string;
  items: CourseItemData[]; // Renamed 'videos' to 'items'
}

export const courses: CourseCategory[] = [
  // --- Existing YouTube Categories (using new interface) ---
  {
    categoryTitle: "Career in Data Science (YouTube)",
    items: [
      { title: "How to tell if a career in Data Analytics is right for you...", url: "http://www.youtube.com/watch?v=NOJKAzIH8hA" },
      { title: "What Is Data Analytics? - An Introduction (Full Guide)", url: "http://www.youtube.com/watch?v=yZvFH7B6gKI" },
      { title: "What is Data Science?", url: "http://www.youtube.com/watch?v=RBSUwFGa6Fk" },
    ],
  },
  {
    categoryTitle: "Become an ML Engineer (YouTube)",
    items: [
      { title: "The Complete Machine Learning Roadmap", url: "http://www.youtube.com/watch?v=7IgVGSaQPaw" },
      { title: "How to Become a Machine Learning Engineer in 2025", url: "http://www.youtube.com/watch?v=t8kDfChhjQU" },
      { title: "The Exact Skills and Certifications for an Entry Level Machine Learning Engineer", url: "http://www.youtube.com/watch?v=wlIKCJZEImw" },
    ],
  },
  {
    categoryTitle: "AI Research (YouTube)",
    items: [
      { title: "What Is AI? | Artificial Intelligence | What is Artificial Intelligence? | AI In 5 Mins |Simplilearn", url: "http://www.youtube.com/watch?v=ad79nYk2keg" },
      { title: "Google’s AI Course for Beginners (in 10 minutes)!", url: "http://www.youtube.com/watch?v=Yq0QkCxoTHM" },
      { title: "AI, Machine Learning, Deep Learning and Generative AI Explained", url: "http://www.youtube.com/watch?v=qYNweeDHiyU" },
    ],
  },
  {
    categoryTitle: "Apply AI in Business (YouTube)",
    items: [
      { title: "Select the right AI use case for your business", url: "http://www.youtube.com/watch?v=C1ecR-sIE1A" },
      { title: "How AI Could Empower Any Business | Andrew Ng | TED", url: "http://www.youtube.com/watch?v=reUZRyXxUs4" },
      { title: "Generative AI in Business: 5 Use Cases", url: "http://www.youtube.com/watch?v=vW9fIro6N6g" },
    ],
  },
  // --- NEW SAMPLE CATEGORIES ---
  {
    categoryTitle: "Structured Courses (Coursera)",
    items: [
      {
        title: "IBM Data Science Professional Certificate",
        url: "https://www.coursera.org/professional-certificates/ibm-data-science",
        thumbnailUrl: "https://images.ctfassets.net/wp1lcwdav1p1/7kOP7XhGtGmHK1LFCRQAjn/a6765a11e69f9c70a51a0b8d359d38e1/IBM_Data_Science_Professional_Certificate_Coursera.png" // Example thumbnail
      },
      {
        title: "Machine Learning by Stanford University",
        url: "https://www.coursera.org/learn/machine-learning",
        thumbnailUrl: "https://images.ctfassets.net/wp1lcwdav1p1/3S50j5w0Qn6KdOBjP5Qo7T/a0b543f5b103603ae1b3a4a991b0405d/Coursera_-_Machine_Learning_by_Stanford_University.png" // Example thumbnail
      }
    ]
  },
  {
    categoryTitle: "Practical Skills (Udemy)",
    items: [
      {
        title: "Python for Data Science and Machine Learning Bootcamp",
        url: "https://www.udemy.com/course/python-for-data-science-and-machine-learning-bootcamp/",
        thumbnailUrl: "https://img-c.udemycdn.com/course/750x422/903744_8eb2.jpg" // Example thumbnail
      },
      {
        title: "The Complete SQL Bootcamp 2022: Go from Zero to Hero",
        url: "https://www.udemy.com/course/the-complete-sql-bootcamp/",
        thumbnailUrl: "https://img-c.udemycdn.com/course/750x422/762616_7693_3.jpg" // Example thumbnail
      }
    ]
  }
];

// Helper function to extract YouTube video ID (remains the same)
export const getYouTubeVideoId = (url: string): string | null => {
  // Regular expression to find YouTube video ID in various URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);

  // Return the video ID if found and it's 11 characters long, otherwise null
  return (match && match[2].length === 11) ? match[2] : null;
};
