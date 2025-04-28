import React, { useState, useEffect } from 'react';

// --- Mock UI Components (Replacing Shadcn/ui imports) ---
// These components remain the same as the previous version.
// ... (Card, CardHeader, CardTitle, CardContent, CardFooter)
const Card = ({ className, children }: { className?: string, children: React.ReactNode }) => <div className={`border rounded-lg shadow-sm ${className}`}>{children}</div>;
const CardHeader = ({ className, children }: { className?: string, children: React.ReactNode }) => <div className={`p-4 ${className}`}>{children}</div>;
const CardTitle = ({ className, children }: { className?: string, children: React.ReactNode }) => <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
const CardContent = ({ className, children }: { className?: string, children: React.ReactNode }) => <div className={`p-4 pt-0 ${className}`}>{children}</div>;
const CardFooter = ({ className, children }: { className?: string, children: React.ReactNode }) => <div className={`flex items-center p-4 pt-0 ${className}`}>{children}</div>;

// ... (Button)
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
}
const Button: React.FC<ButtonProps> = ({ className, variant = 'default', children, onClick, ...props }) => {
  const baseStyle = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 px-4 py-2";
  const variantStyle = variant === 'outline'
    ? "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
    : "bg-blue-600 text-white hover:bg-blue-700/90"; // Adjusted primary color
  return <button className={`${baseStyle} ${variantStyle} ${className}`} onClick={onClick} {...props}>{children}</button>;
};

// ... (Badge)
interface BadgeProps {
    className?: string;
    variant?: 'default' | 'secondary';
    children: React.ReactNode;
}
const Badge: React.FC<BadgeProps> = ({ className, variant = 'default', children }) => {
    // variant 'secondary' is approximated here
    const variantStyle = variant === 'secondary' ? 'border-transparent bg-gray-100 text-gray-800 hover:bg-gray-100/80' : 'border-transparent bg-blue-600 text-white hover:bg-blue-600/80'; // Adjusted primary color
    return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variantStyle} ${className}`}>{children}</span>;
};

// ... (Input)
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
const Input: React.FC<InputProps> = ({ className, placeholder, value, onChange, ...props }) => (
  <input
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

// ... (Tabs, TabsList, TabsTrigger) - Note: TabsTrigger active state indication is simplified
const Tabs = ({ className, children, defaultValue }: { className?: string, children: React.ReactNode, defaultValue?: string }) => <div className={className}>{children}</div>;
const TabsList = ({ className, children }: { className?: string, children: React.ReactNode }) => <div className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className}`}>{children}</div>;
const TabsTrigger = ({ className, children, value, onClick }: { className?: string, children: React.ReactNode, value: string, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm ${className}`}
    // Simplified active state indication - requires parent state for full functionality
    data-state={value === '' ? 'active' : ''} // This logic might need adjustment based on how activeTab is managed
  >
    {children}
  </button>
);

// --- Mock Icons (Replacing lucide-react) ---
// These icons remain the same as the previous version.
// ... (SearchIcon, ClockIcon, AwardIcon)
const SearchIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
const ClockIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);
const AwardIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="8" r="7"></circle>
    <polyline points="8.21 13.89 7 23 12 17 17 23 15.79 13.88"></polyline>
  </svg>
);

// --- Quiz Data Interfaces and Mock Data ---

// Interface for a single question
interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string; // Store the correct option text
}

// Extended Quiz interface to include questions
export interface Quiz {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  questionsCount: number; // Renamed from 'questions' to avoid confusion
  timeEstimate: number; // Updated time estimate
  completed: boolean;
  score?: number;
  moduleId: string;
  questionsData: QuizQuestion[]; // Added actual questions
}

// Mock data for quizzes with expanded questions
const mockQuizzesData: Quiz[] = [
  {
    id: "quiz-1",
    title: "Python Basics for ML",
    description: "Test your knowledge of Python fundamentals relevant to machine learning.",
    difficulty: "beginner",
    questionsCount: 12, // Updated count
    timeEstimate: 15,  // Updated time
    completed: false,
    score: undefined,
    moduleId: "module-1",
    questionsData: [
      { id: "q1-1", questionText: "What keyword is used to define a function in Python?", options: ["def", "fun", "define", "function"], correctAnswer: "def" },
      { id: "q1-2", questionText: "Which data type is mutable in Python?", options: ["int", "str", "tuple", "list"], correctAnswer: "list" },
      { id: "q1-3", questionText: "What does 'len()' function do?", options: ["Returns the length", "Converts to lowercase", "Sorts a list", "Prints output"], correctAnswer: "Returns the length" },
      { id: "q1-4", questionText: "How do you comment a single line in Python?", options: ["// comment", "# comment", "/* comment */", ""], correctAnswer: "# comment" },
      { id: "q1-5", questionText: "Which operator is used for exponentiation?", options: ["^", "**", "*", "%"], correctAnswer: "**" },
      { id: "q1-6", questionText: "What is the output of `print(type([]))`?", options: ["<class 'list'>", "<class 'tuple'>", "<class 'dict'>", "<class 'array'>"], correctAnswer: "<class 'list'>" },
      { id: "q1-7", questionText: "How do you access the first element of a list named `my_list`?", options: ["my_list(0)", "my_list[0]", "my_list.first()", "my_list{0}"], correctAnswer: "my_list[0]" },
      { id: "q1-8", questionText: "Which loop is used for iterating over a sequence (like list, tuple)?", options: ["while loop", "for loop", "do-while loop", "repeat loop"], correctAnswer: "for loop" },
      { id: "q1-9", questionText: "What method adds an element to the end of a list?", options: [".add()", ".insert()", ".append()", ".extend()"], correctAnswer: ".append()" },
      { id: "q1-10", questionText: "How do you create a dictionary in Python?", options: ["{key: value}", "[key: value]", "(key: value)", "<key: value>"], correctAnswer: "{key: value}" },
      { id: "q1-11", questionText: "Which boolean operator means 'logical AND'?", options: ["or", "not", "and", "&"], correctAnswer: "and" },
      { id: "q1-12", questionText: "What function converts a string to an integer?", options: ["str()", "float()", "int()", "list()"], correctAnswer: "int()" },
    ],
  },
  {
    id: "quiz-2",
    title: "Data Manipulation with Pandas",
    description: "Assess your skills in data cleaning, transformation, and analysis using Pandas.",
    difficulty: "intermediate",
    questionsCount: 11, // Updated count
    timeEstimate: 18,  // Updated time
    completed: false,
    score: undefined,
    moduleId: "module-2",
     questionsData: [
      { id: "q2-1", questionText: "Which Pandas object is best for 1D labeled data?", options: ["Series", "DataFrame", "Index", "Array"], correctAnswer: "Series" },
      { id: "q2-2", questionText: "How do you select rows based on a condition in a DataFrame 'df'?", options: ["df[df['col'] > 5]", "df.select(condition)", "df.filter(rows)", "df.where('col' > 5)"], correctAnswer: "df[df['col'] > 5]" },
      { id: "q2-3", questionText: "What function reads an Excel file into a DataFrame?", options: ["pd.read_csv()", "pd.read_excel()", "pd.open_excel()", "pd.excel_reader()"], correctAnswer: "pd.read_excel()" },
      { id: "q2-4", questionText: "How do you get the first 5 rows of a DataFrame 'df'?", options: ["df.first(5)", "df.top(5)", "df.head()", "df.rows[0:5]"], correctAnswer: "df.head()" },
      { id: "q2-5", questionText: "What method is used to handle missing values (NaN)?", options: [".fillna()", ".dropna()", ".isnull()", "All of the above"], correctAnswer: "All of the above" },
      { id: "q2-6", questionText: "How do you rename a column 'old_name' to 'new_name' in DataFrame 'df'?", options: ["df.rename(columns={'old_name':'new_name'})", "df.change_column('old_name', 'new_name')", "df.columns['old_name'] = 'new_name'", "df.set_col('old_name', 'new_name')"], correctAnswer: "df.rename(columns={'old_name':'new_name'})" },
      { id: "q2-7", questionText: "Which function calculates descriptive statistics for a DataFrame?", options: ["df.stats()", "df.summary()", "df.describe()", "df.info()"], correctAnswer: "df.describe()" },
      { id: "q2-8", questionText: "How do you apply a function element-wise to a Series?", options: [".apply()", ".map()", ".applymap()", "Both .apply() and .map()"], correctAnswer: "Both .apply() and .map()" }, // Note: applymap is for DataFrame
      { id: "q2-9", questionText: "What does `df.shape` return?", options: ["Number of rows", "Number of columns", "A tuple (rows, columns)", "Memory usage"], correctAnswer: "A tuple (rows, columns)" },
      { id: "q2-10", questionText: "How do you sort a DataFrame 'df' by column 'colA' in descending order?", options: ["df.sort_values(by='colA', ascending=False)", "df.sort(by='colA', order='desc')", "df.order_by('colA', descending=True)", "df.arrange('colA', desc=True)"], correctAnswer: "df.sort_values(by='colA', ascending=False)" },
      { id: "q2-11", questionText: "Which method removes duplicate rows from a DataFrame?", options: ["df.remove_duplicates()", "df.unique()", "df.drop_duplicates()", "df.distinct()"], correctAnswer: "df.drop_duplicates()" },
    ],
  },
   {
    id: "quiz-3",
    title: "Advanced Pandas Techniques",
    description: "Challenge yourself with complex data operations and performance optimization in Pandas.",
    difficulty: "advanced",
    questionsCount: 11, // Updated count
    timeEstimate: 20,  // Updated time
    completed: false,
    moduleId: "module-2",
    questionsData: [
        { id: "q3-1", questionText: "Which function is best for combining DataFrames based on common columns (like SQL join)?", options: ["concat()", "merge()", "join()", "append()"], correctAnswer: "merge()" },
        { id: "q3-2", questionText: "What does the `groupby()` method followed by `.agg()` allow you to do?", options: ["Filter groups", "Apply multiple aggregation functions per group", "Transform groups", "Iterate over groups"], correctAnswer: "Apply multiple aggregation functions per group" },
        { id: "q3-3", questionText: "How can you create a pivot table in Pandas?", options: ["df.pivot()", "df.pivot_table()", "df.crosstab()", "Both pivot_table() and crosstab()"], correctAnswer: "Both pivot_table() and crosstab()" }, // Note: crosstab is slightly different but related
        { id: "q3-4", questionText: "What is MultiIndexing useful for?", options: ["Indexing with multiple keys per axis", "Faster data access", "Hierarchical indexing", "All of the above"], correctAnswer: "All of the above" },
        { id: "q3-5", questionText: "Which method reshapes a DataFrame from 'wide' to 'long' format?", options: ["df.stack()", "df.unstack()", "df.melt()", "df.pivot()"], correctAnswer: "df.melt()" },
        { id: "q3-6", questionText: "How can you improve performance when iterating over DataFrame rows?", options: ["Using df.iterrows()", "Using df.itertuples()", "Using vectorized operations (NumPy/Pandas functions)", "Using standard Python loops"], correctAnswer: "Using vectorized operations (NumPy/Pandas functions)" },
        { id: "q3-7", questionText: "What does `pd.to_datetime()` do?", options: ["Converts argument to datetime object", "Formats datetime object to string", "Calculates time difference", "Extracts date part"], correctAnswer: "Converts argument to datetime object" },
        { id: "q3-8", questionText: "How do you handle time series data with specific frequencies (e.g., daily, monthly)?", options: ["Using DatetimeIndex", "Using PeriodIndex", "Using resample()", "All of the above"], correctAnswer: "All of the above" },
        { id: "q3-9", questionText: "What is the purpose of the `pipe()` method?", options: ["To chain together custom functions", "To read data from a pipe", "To perform bitwise PIPE operation", "To plot data"], correctAnswer: "To chain together custom functions" },
        { id: "q3-10", questionText: "How can you read data from a SQL database into a Pandas DataFrame?", options: ["pd.read_sql_table()", "pd.read_sql_query()", "pd.read_sql()", "All of the above"], correctAnswer: "All of the above" },
        { id: "q3-11", questionText: "Which file format is often more efficient for storing large DataFrames than CSV?", options: ["JSON", "Excel (.xlsx)", "Parquet", "XML"], correctAnswer: "Parquet" },
    ],
  },
  {
    id: "quiz-4",
    title: "Intro to ML Concepts",
    description: "Test your understanding of fundamental machine learning concepts.",
    difficulty: "beginner",
    questionsCount: 12, // Updated count
    timeEstimate: 15,  // Updated time
    completed: false,
    moduleId: "module-3",
    questionsData: [
        { id: "q4-1", questionText: "What is supervised learning?", options: ["Learning from labeled data", "Learning from unlabeled data", "Learning through rewards", "Learning patterns"], correctAnswer: "Learning from labeled data" },
        { id: "q4-2", questionText: "Which is NOT a common ML task?", options: ["Classification", "Regression", "Clustering", "Data Compilation"], correctAnswer: "Data Compilation" },
        { id: "q4-3", questionText: "What is the goal of regression?", options: ["Predicting a category", "Predicting a continuous value", "Grouping similar data points", "Finding outliers"], correctAnswer: "Predicting a continuous value" },
        { id: "q4-4", questionText: "What does 'unsupervised learning' typically involve?", options: ["Predicting outputs based on inputs", "Finding structure in unlabeled data", "Maximizing a reward signal", "Classifying data into predefined groups"], correctAnswer: "Finding structure in unlabeled data" },
        { id: "q4-5", questionText: "An example of classification is:", options: ["Predicting house prices", "Spam detection (spam/not spam)", "Customer segmentation", "Recommending movies"], correctAnswer: "Spam detection (spam/not spam)" },
        { id: "q4-6", questionText: "What is 'overfitting' in machine learning?", options: ["Model performs poorly on training data", "Model performs well on training data but poorly on new data", "Model is too simple", "Model uses too few features"], correctAnswer: "Model performs well on training data but poorly on new data" },
        { id: "q4-7", questionText: "How is model performance typically evaluated?", options: ["Using training data only", "Using validation/test data", "Based on model complexity", "By expert opinion"], correctAnswer: "Using validation/test data" },
        { id: "q4-8", questionText: "What is a 'feature' in machine learning?", options: ["The target variable to predict", "An input variable used for prediction", "The algorithm used", "A row in the dataset"], correctAnswer: "An input variable used for prediction" },
        { id: "q4-9", questionText: "Which technique helps prevent overfitting?", options: ["Using more data", "Feature selection", "Regularization", "All of the above"], correctAnswer: "All of the above" },
        { id: "q4-10", questionText: "What is 'clustering'?", options: ["Assigning data points to predefined categories", "Predicting a numerical value", "Grouping similar data points together", "Learning from labeled examples"], correctAnswer: "Grouping similar data points together" },
        { id: "q4-11", questionText: "What does 'training data' refer to?", options: ["Data used to build the model", "Data used to evaluate the final model", "New, unseen data", "Data with missing values"], correctAnswer: "Data used to build the model" },
        { id: "q4-12", questionText: "What is 'reinforcement learning'?", options: ["Learning from labeled data", "Learning hidden patterns", "Learning through trial and error with rewards/penalties", "Predicting categories"], correctAnswer: "Learning through trial and error with rewards/penalties" },
    ],
  },
    {
    id: "quiz-5",
    title: "Neural Networks Basics",
    description: "Assess your knowledge of neural network foundations and architectures.",
    difficulty: "intermediate",
    questionsCount: 11, // Updated count
    timeEstimate: 18,  // Updated time
    completed: false,
    moduleId: "module-4",
    questionsData: [
        { id: "q5-1", questionText: "What is the basic computational unit of a neural network?", options: ["Neuron (or Node)", "Layer", "Synapse", "Weight"], correctAnswer: "Neuron (or Node)" },
        { id: "q5-2", questionText: "Which activation function introduces non-linearity?", options: ["Linear", "ReLU", "Sigmoid", "All except Linear"], correctAnswer: "All except Linear" },
        { id: "q5-3", questionText: "What is the purpose of the 'weights' in a neural network?", options: ["To store input data", "To determine the strength of connections between neurons", "To activate neurons", "To define the network structure"], correctAnswer: "To determine the strength of connections between neurons" },
        { id: "q5-4", questionText: "What is 'backpropagation' used for?", options: ["Forward pass calculation", "Initializing weights", "Adjusting weights based on error", "Choosing the activation function"], correctAnswer: "Adjusting weights based on error" },
        { id: "q5-5", questionText: "A 'Dense' or 'Fully Connected' layer means:", options: ["Neurons are sparsely connected", "Every neuron in the layer is connected to every neuron in the previous layer", "It uses a dense activation function", "It's the output layer"], correctAnswer: "Every neuron in the layer is connected to every neuron in the previous layer" },
        { id: "q5-6", questionText: "What is a common loss function for regression problems?", options: ["Cross-Entropy", "Hinge Loss", "Mean Squared Error (MSE)", "Kullback-Leibler Divergence"], correctAnswer: "Mean Squared Error (MSE)" },
        { id: "q5-7", questionText: "Which activation function outputs probabilities for multi-class classification?", options: ["ReLU", "Sigmoid", "Tanh", "Softmax"], correctAnswer: "Softmax" },
        { id: "q5-8", questionText: "What does an 'epoch' represent during training?", options: ["One pass of a single data point", "One complete pass through the entire training dataset", "One update of the weights", "One layer of the network"], correctAnswer: "One complete pass through the entire training dataset" },
        { id: "q5-9", questionText: "What is the role of the 'bias' term in a neuron?", options: ["To scale the input", "To shift the activation function", "To prevent overfitting", "To normalize the weights"], correctAnswer: "To shift the activation function" },
        { id: "q5-10", questionText: "Which type of neural network is commonly used for image recognition?", options: ["Recurrent Neural Network (RNN)", "Convolutional Neural Network (CNN)", "Autoencoder", "Generative Adversarial Network (GAN)"], correctAnswer: "Convolutional Neural Network (CNN)" },
        { id: "q5-11", questionText: "What is 'gradient descent'?", options: ["A method to calculate the loss", "An optimization algorithm to minimize the loss function", "A type of activation function", "A way to initialize weights"], correctAnswer: "An optimization algorithm to minimize the loss function" },
    ],
  },
];

// --- Quiz Card Component ---
// Remains the same as the previous version.
interface QuizCardProps {
  quiz: Quiz;
  onStartQuiz: (quizId: string) => void;
  onReviewQuiz: (quizId: string) => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, onStartQuiz, onReviewQuiz }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-700";
      case "intermediate": return "bg-yellow-100 text-yellow-700";
      case "advanced": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const handleButtonClick = () => {
    if (quiz.completed) {
      onReviewQuiz(quiz.id);
    } else {
      onStartQuiz(quiz.id);
    }
  };

  return (
    <Card className="border flex flex-col h-full hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg font-semibold">{quiz.title}</CardTitle>
          <Badge
            className={getDifficultyColor(quiz.difficulty)}
            variant="secondary"
          >
            {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 mb-4">{quiz.description}</p>
        <div className="flex space-x-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-1" />
            <span>{quiz.timeEstimate} min</span>
          </div>
          <div>
            {quiz.questionsCount} questions
          </div>
        </div>
        {quiz.completed && quiz.score !== undefined && (
          <div className="mt-2 flex items-center text-sm font-medium">
            <AwardIcon className="h-4 w-4 mr-1 text-yellow-500" />
            <span>Your score: <span className="text-blue-600 font-bold">{quiz.score}%</span></span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={quiz.completed ? "outline" : "default"}
          onClick={handleButtonClick}
        >
          {quiz.completed ? "Review Quiz" : "Start Quiz"}
        </Button>
      </CardFooter>
    </Card>
  );
};

// --- Quizzes Page Component ---
// Remains the same as the previous version.
interface QuizzesPageProps {
  quizzes: Quiz[];
  onStartQuiz: (quizId: string) => void;
  onReviewQuiz: (quizId: string) => void;
}

const QuizzesPage: React.FC<QuizzesPageProps> = ({ quizzes, onStartQuiz, onReviewQuiz }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    switch (activeTab) {
        case "all":         return true;
        case "completed":   return quiz.completed;
        case "incomplete":  return !quiz.completed;
        case "beginner":
        case "intermediate":
        case "advanced":    return quiz.difficulty === activeTab;
        default:            return true;
    }
  });

  const getTabTriggerClass = (tabValue: string) => {
      const baseClass = "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
      const activeClass = "bg-white text-gray-900 shadow-sm";
      const inactiveClass = "text-gray-500 hover:text-gray-700";
      return `${baseClass} ${activeTab === tabValue ? activeClass : inactiveClass}`;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Quizzes & Assessments</h1>
      <p className="text-gray-600 mb-8">
        Test your knowledge and track your progress with these interactive quizzes.
      </p>
      <div className="relative mb-8 max-w-lg">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
        <Input
          placeholder="Search quizzes..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="bg-gray-100 p-1 rounded-lg flex flex-wrap gap-1">
           <button onClick={() => setActiveTab("all")} className={getTabTriggerClass("all")}>All Quizzes</button>
           <button onClick={() => setActiveTab("completed")} className={getTabTriggerClass("completed")}>Completed</button>
           <button onClick={() => setActiveTab("incomplete")} className={getTabTriggerClass("incomplete")}>To Do</button>
           <button onClick={() => setActiveTab("beginner")} className={getTabTriggerClass("beginner")}>Beginner</button>
           <button onClick={() => setActiveTab("intermediate")} className={getTabTriggerClass("intermediate")}>Intermediate</button>
           <button onClick={() => setActiveTab("advanced")} className={getTabTriggerClass("advanced")}>Advanced</button>
        </TabsList>
      </Tabs>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.length > 0 ? (
          filteredQuizzes.map((quiz) => (
            <QuizCard
                key={quiz.id}
                quiz={quiz}
                onStartQuiz={onStartQuiz}
                onReviewQuiz={onReviewQuiz}
            />
          ))
        ) : (
          <div className="col-span-full py-12 text-center">
            <p className="text-gray-500 text-lg">No quizzes found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Quiz Taking Component ---
// Remains the same as the previous version.
interface QuizTakingPageProps {
  quiz: Quiz;
  onQuizComplete: (quizId: string, score: number) => void;
  onBackToList: () => void;
}

const QuizTakingPage: React.FC<QuizTakingPageProps> = ({ quiz, onQuizComplete, onBackToList }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // Reset state when quiz changes (e.g., user clicks review/start on a different quiz)
  // This prevents showing old answers/results briefly
   useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizFinished(false);
    setFinalScore(0);
  }, [quiz.id]); // Dependency array ensures reset only when quiz ID changes

  const currentQuestion = quiz.questionsData[currentQuestionIndex];

  const handleSelectAnswer = (questionId: string, answer: string) => {
    // Only allow changing answer if quiz is not finished
    if (!quizFinished) {
        setSelectedAnswers(prev => ({ ...prev, [questionId]: answer }));
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questionsData.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      let correctCount = 0;
      quiz.questionsData.forEach(q => {
        if (selectedAnswers[q.id] === q.correctAnswer) {
          correctCount++;
        }
      });
      const score = Math.round((correctCount / quiz.questionsData.length) * 100);
      setFinalScore(score);
      setQuizFinished(true); // Mark quiz as finished *before* calling onQuizComplete
      onQuizComplete(quiz.id, score);
    }
  };

  // Render quiz results
  if (quizFinished) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Quiz Completed!</h2>
        <p className="text-xl text-gray-700 mb-6">Your score for "{quiz.title}" is:</p>
        <p className="text-5xl font-bold mb-8 text-blue-600">{finalScore}%</p>
         <div className="mb-8">
            <h4 className="text-lg font-semibold mb-3">Review Your Answers:</h4>
            <ul className="text-left space-y-3 bg-gray-50 p-4 rounded-lg border max-h-96 overflow-y-auto"> {/* Added max height and scroll */}
                {quiz.questionsData.map((q, index) => {
                    const userAnswer = selectedAnswers[q.id];
                    const isCorrect = userAnswer === q.correctAnswer;
                    return (
                        <li key={q.id} className={`p-3 rounded ${isCorrect ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'}`}> {/* Added padding and border */}
                            <p className="font-medium text-gray-800">Q{index + 1}: {q.questionText}</p>
                            <p className="text-sm mt-1">Your answer: <span className={`font-semibold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>{userAnswer || <span className="italic text-gray-500">Not answered</span>}</span></p> {/* Handle not answered */}
                            {!isCorrect && <p className="text-sm text-green-800 mt-1">Correct answer: <span className="font-semibold">{q.correctAnswer}</span></p>} {/* Improved correct answer display */}
                        </li>
                    );
                })}
            </ul>
        </div>
        <Button onClick={onBackToList} variant="default">
          Back to Quizzes
        </Button>
      </div>
    );
  }

  // Render current question
  // Added check for currentQuestion existence
  if (!currentQuestion) {
      return (
          <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
              <p className="text-red-500">Error: Could not load question.</p>
              <Button onClick={onBackToList} variant="outline" className="mt-4">
                Back to Quizzes
              </Button>
          </div>
      );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
        <button onClick={onBackToList} className="text-blue-600 hover:underline mb-6 text-sm">&larr; Back to Quizzes</button>
      <h2 className="text-2xl font-bold mb-2 text-gray-800">{quiz.title}</h2>
      <p className="text-gray-600 mb-6">Question {currentQuestionIndex + 1} of {quiz.questionsData.length}</p>

      <Card className="mb-8 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl text-gray-700">{currentQuestion.questionText}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <label key={index} className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all duration-150 ease-in-out ${selectedAnswers[currentQuestion.id] === option ? 'bg-blue-100 border-blue-400 ring-2 ring-blue-300' : 'border-gray-200 hover:bg-gray-100 hover:border-gray-300'}`}>
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={option}
                  checked={selectedAnswers[currentQuestion.id] === option}
                  onChange={() => handleSelectAnswer(currentQuestion.id, option)}
                  className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500" // Adjusted size and focus style
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleNextQuestion}
          disabled={!selectedAnswers[currentQuestion.id]} // Disable if no answer selected
          className="disabled:bg-gray-400 disabled:cursor-not-allowed" // Style disabled button
        >
          {currentQuestionIndex < quiz.questionsData.length - 1 ? "Next Question" : "Finish Quiz"}
        </Button>
      </div>
    </div>
  );
};

// --- Main App Component ---
// Remains the same as the previous version.
function App() {
  const [quizzes, setQuizzes] = useState<Quiz[]>(mockQuizzesData);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

  const handleStartQuiz = (quizId: string) => {
    const quizToStart = quizzes.find(q => q.id === quizId);
    if (quizToStart) {
      // Set the active quiz, QuizTakingPage's useEffect will handle resets
      setActiveQuiz(quizToStart);
    }
  };

  const handleQuizComplete = (quizId: string, score: number) => {
    setQuizzes(prevQuizzes =>
      prevQuizzes.map(q =>
        q.id === quizId ? { ...q, completed: true, score: score } : q
      )
    );
    // Update the active quiz state as well so the results page shows the score correctly
     setActiveQuiz(prevActiveQuiz => {
        if (prevActiveQuiz && prevActiveQuiz.id === quizId) {
            return { ...prevActiveQuiz, completed: true, score: score };
        }
        return prevActiveQuiz;
    });
  };

  const handleBackToList = () => {
    setActiveQuiz(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {activeQuiz ? (
        <QuizTakingPage
          quiz={activeQuiz}
          onQuizComplete={handleQuizComplete}
          onBackToList={handleBackToList}
        />
      ) : (
        <QuizzesPage
          quizzes={quizzes}
          onStartQuiz={handleStartQuiz}
          onReviewQuiz={handleStartQuiz} // Review still just starts the quiz
        />
      )}
    </div>
  );
}

export default App;
