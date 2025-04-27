import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, Json } from '@/integrations/supabase/types'; // Added Json
import type { Module } from '@/components/roadmap/RoadmapCard';
import { allRoadmapModules } from '@/data/roadmapModules'; // Import static data

// Define the expected structure of the preferences JSON object
// Adjust this based on the actual structure confirmed previously
interface UserPreferences {
  difficulty: string;
  interests: string[];
  learningStyles: string[];
  weeklyCommitment: number;
}

export const useRoadmap = (userId: string) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasRoadmap, setHasRoadmap] = useState(true);
  const navigate = useNavigate();

  const fetchRoadmap = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      setHasRoadmap(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch user's roadmap preferences
      const { data: roadmap, error: roadmapError } = await supabase
        .from('user_roadmaps')
        .select('preferences') // Fetch preferences instead of modules
        .eq('user_id', userId)
        .maybeSingle();

      if (roadmapError && roadmapError.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
        throw roadmapError;
      }

      // If no roadmap or preferences exist, treat as no roadmap (user needs onboarding)
      if (!roadmap || !roadmap.preferences) {
        setHasRoadmap(false);
        setLoading(false);
        return;
      }

      // We have preferences, proceed to filter static modules
      setHasRoadmap(true);
      const userPreferences = roadmap.preferences as UserPreferences; // Type assertion

      // Filter static modules based on preferences
      // Note: This assumes preferences.interests maps to module.category
      // and preferences.learningStyles maps to module.learning_style
      // Adjust filtering logic if the mapping is different
      const filteredModulesData = allRoadmapModules.filter(module => {
        // Safely check difficulty preference
        const difficultyMatch = userPreferences.difficulty
          ? module.difficulty_level.toLowerCase() === userPreferences.difficulty.toLowerCase()
          : true; // Default to true if preference is missing

        // Safely check interests preference
        const interestMatch = userPreferences.interests && Array.isArray(userPreferences.interests)
          ? userPreferences.interests.includes(module.category)
          : true; // Default to true if preference is missing or invalid

        // Optional: Add learning style matching if needed (with safety checks)
        const styleMatch = userPreferences.learningStyles && Array.isArray(userPreferences.learningStyles)
          ? module.learning_style.some(style => userPreferences.learningStyles.includes(style))
          : true; // Default to true if preference is missing or invalid

        return difficultyMatch && interestMatch && styleMatch;
      });

      // Note: If preferences are completely missing, this will now show ALL modules.
      // Consider if a different behavior is desired (e.g., showing none, redirecting).

      if (filteredModulesData.length === 0) {
        // Handle case where no modules match preferences
        setModules([]);
        setLoading(false);
        return;
      }

      const filteredModuleIds = filteredModulesData.map(m => m.id);

      // Fetch progress only for the filtered modules
      const { data: progressData, error: progressError } = await supabase
        .from('user_module_progress')
        .select('*')
        .eq('user_id', userId)
        .in('module_id', filteredModuleIds); // Filter by relevant module IDs

      if (progressError) throw progressError;

      // Define the allowed status types
      type ModuleStatus = "completed" | "in-progress" | "locked";
      const validStatuses: Set<ModuleStatus> = new Set(["completed", "in-progress", "locked"]);

      // Create a map of module progress by module ID with validated status
      const progressMap = new Map<string, { progress: number; status: ModuleStatus }>();
      progressData?.forEach(progress => {
        // Validate status, default to 'locked' if invalid or null
        const validatedStatus = validStatuses.has(progress.status as ModuleStatus)
          ? progress.status as ModuleStatus
          : 'locked';

        progressMap.set(progress.module_id, {
          progress: progress.progress || 0,
          status: validatedStatus
        });
      });

      // Combine filtered static modules with their progress
      const formattedModules = filteredModulesData.map(moduleData => {
        // Ensure default status is also correctly typed
        const defaultProgress = { progress: 0, status: 'locked' as ModuleStatus };
        const progress = progressMap.get(moduleData.id) || defaultProgress;
        return {
          ...moduleData,
          progress: progress.progress,
          status: progress.status
        };
      });

      // Log the raw difficulty levels before sorting
      console.log("Raw Modules (before sort):", formattedModules.map(m => ({ title: m.title, difficulty: m.difficulty_level })));

      // Define the desired order of difficulty levels (using lowercase keys now)
      const difficultyOrder: { [key: string]: number } = {
        'beginner': 1,
        'intermediate': 2,
        'advanced': 3,
      };

      // Sort modules based on difficulty level (using a copy of the array)
      const sortedModules = [...formattedModules].sort((a, b) => {
        const levelA = difficultyOrder[a.difficulty_level.toLowerCase()] || 99; // Use lowercase and handle unknown levels
        const levelB = difficultyOrder[b.difficulty_level.toLowerCase()] || 99;
        return levelA - levelB;
      });

      console.log("Sorted Modules (after sort):", sortedModules.map(m => ({ title: m.title, difficulty: m.difficulty_level })));
      setModules(sortedModules);
    } catch (err) {
      console.error('Error fetching roadmap:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch roadmap'));
    } finally {
      setLoading(false);
    }
  }, [userId, navigate]);

  const updateProgress = useCallback(async (moduleId: string, progress: number) => {
    try {
      const { error } = await supabase.rpc('update_module_progress', {
        p_user_id: userId,
        p_module_id: moduleId,
        p_progress: progress
      });

      if (error) throw error;

      // Refresh the roadmap
      await fetchRoadmap();
    } catch (err) {
      console.error('Error updating progress:', err);
      setError(err instanceof Error ? err : new Error('Failed to update progress'));
    }
  }, [userId, fetchRoadmap]);

  useEffect(() => {
    fetchRoadmap();
  }, [fetchRoadmap]);

  return {
    modules,
    loading,
    error,
    hasRoadmap,
    updateProgress,
    refreshRoadmap: fetchRoadmap
  };
};
