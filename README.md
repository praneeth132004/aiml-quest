# AI/ML Odyssey

An interactive learning platform for AI and Machine Learning concepts.

## Overview

AI/ML Odyssey is a comprehensive learning platform designed to guide users through their AI/ML journey with structured roadmaps, curated video courses, interactive quizzes, and a supportive community. The platform aims to make AI/ML education accessible, engaging, and personalized.

## Features

- **Personalized Learning Roadmaps**: Custom learning paths based on user preferences and goals
- **Curated Video Courses**: Organized collection of high-quality educational videos from various sources
- **Interactive Quizzes**: Test your knowledge and reinforce learning
- **Community Forum**: Connect with other learners, ask questions, and share insights
- **AI Chatbot Assistant**: Get help and explanations for complex concepts
- **Progress Tracking**: Monitor your learning journey with detailed progress metrics

## Tech Stack

- **Frontend**: React with TypeScript
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router
- **State Management**: React Context API
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Deployment**: Vite build system

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/praneeth132004/aiml-quest.git
   cd aiml-odyssey
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   Create a `.env` file in the root directory with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:8080`

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── courses/      # Course-related components
│   └── ui/           # shadcn/ui components
├── data/             # Static data files
├── hooks/            # Custom React hooks
├── integrations/     # Third-party service integrations
│   └── supabase/     # Supabase client and types
├── lib/              # Utility functions
├── pages/            # Page components
│   └── legal/        # Legal pages (Terms, Privacy, etc.)
└── types/            # TypeScript type definitions
```

## Development

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint

### Adding New Courses

Courses are defined in `src/data/coursesData.ts`. To add new courses:

1. Add a new entry to the appropriate category or create a new category
2. Provide the required information (title, URL, optional thumbnail)
3. The system will automatically extract YouTube video IDs for playback

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- All the amazing content creators whose educational resources are featured
- The open-source community for the tools and libraries used