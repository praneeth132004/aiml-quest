import type { Tables, Json } from '@/integrations/supabase/types';

// Base structure from Supabase table
type RoadmapModuleBase = Tables<'modules'>;

// Define the allowed status types
export type ModuleStatus = "completed" | "in-progress" | "locked";

// Define the final Module type used in the application
export interface Module extends Omit<RoadmapModuleBase, 'resources'> {
  progress: number;
  status: ModuleStatus;
  // Define a more specific type for resources if possible, based on usage
  // For now, using the Json type or a refined version based on roadmapModules.ts
  resources: {
    videos: Array<{ title: string; url: string; provider?: string }>;
    projects: Array<{ title: string; url: string; provider?: string }>;
    readings: Array<{ title: string; url: string; provider?: string }>;
    exercises: Array<{ title: string; url: string; provider?: string }>;
  };
  // Add other fields if the hook modifies/adds more than progress and status
  featured?: boolean; // Example: Assuming 'featured' might be added later or is part of base
}

// Re-exporting ResourceLink if needed elsewhere, or keep it local if only used here
export interface ResourceLink {
  title: string;
  url: string;
  provider?: string;
}
