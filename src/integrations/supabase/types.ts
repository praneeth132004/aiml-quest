export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      modules: {
        Row: {
          category: string;
          created_at: string | null;
          description: string;
          difficulty_level: string;
          estimated_hours: number;
          id: string;
          learning_style: string[];
          prerequisites: string[] | null;
          resources: Json;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          category: string;
          created_at?: string | null;
          description: string;
          difficulty_level: string;
          estimated_hours: number;
          id?: string;
          learning_style: string[];
          prerequisites?: string[] | null;
          resources: Json;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          category?: string;
          created_at?: string | null;
          description?: string;
          difficulty_level?: string;
          estimated_hours?: number;
          id?: string;
          learning_style?: string[];
          prerequisites?: string[] | null;
          resources?: Json;
          title?: string;
          updated_at?: string | null;
        };
      };
      user_module_progress: {
        Row: {
          completed_at: string | null;
          created_at: string | null;
          module_id: string;
          progress: number | null;
          status: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          completed_at?: string | null;
          created_at?: string | null;
          module_id: string;
          progress?: number | null;
          status?: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          completed_at?: string | null;
          created_at?: string | null;
          module_id?: string;
          progress?: number | null;
          status?: string;
          updated_at?: string | null;
          user_id?: string;
        };
      };
      user_roadmaps: {
        Row: {
          created_at: string | null;
          id: string;
          modules: string[];
          preferences: Json;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          modules: string[];
          preferences: Json;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          modules?: string[];
          preferences?: Json;
          updated_at?: string | null;
          user_id?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          username: string;
          // Add additional fields as needed
        };
        Insert: {
          id?: string;
          username: string;
        };
        Update: {
          username?: string;
        };
      };
    };
    Functions: {
      create_user_roadmap: {
        Args: { p_user_id: string; p_preferences: Json };
        Returns: string;
      };
      update_module_progress: {
        Args: { p_user_id: string; p_module_id: string; p_progress: number };
        Returns: undefined;
      };
    };
  };
};

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
