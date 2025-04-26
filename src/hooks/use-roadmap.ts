import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import type { Module } from '@/components/roadmap/RoadmapCard';

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

      // Fetch user's roadmap
      const { data: roadmap, error: roadmapError } = await supabase
        .from('user_roadmaps')
        .select('modules')
        .eq('user_id', userId)
        .maybeSingle(); // Use maybeSingle instead of single to handle case when no roadmap exists

      if (roadmapError && roadmapError.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
        throw roadmapError;
      }

      // If no roadmap exists, redirect to onboarding
      if (!roadmap) {
        setHasRoadmap(false);
        setLoading(false);
        return;
      }

      // If roadmap exists but has no modules yet, still show the roadmap page
      // but with a loading state until modules are populated
      if (!roadmap.modules || roadmap.modules.length === 0) {
        setHasRoadmap(true);
        setLoading(true);

        // Poll for modules every 2 seconds for up to 30 seconds
        let attempts = 0;
        const maxAttempts = 15;
        const pollInterval = setInterval(async () => {
          attempts++;

          const { data: updatedRoadmap, error: pollError } = await supabase
            .from('user_roadmaps')
            .select('modules')
            .eq('user_id', userId)
            .maybeSingle();

          if (pollError) {
            clearInterval(pollInterval);
            setLoading(false);
            return;
          }

          if (updatedRoadmap && updatedRoadmap.modules && updatedRoadmap.modules.length > 0) {
            clearInterval(pollInterval);
            fetchRoadmap(); // Reload the roadmap with modules
            return;
          }

          if (attempts >= maxAttempts) {
            clearInterval(pollInterval);
            setLoading(false);
          }
        }, 2000);

        return;
      }

      setHasRoadmap(true);

      // Fetch all modules first (removed .order() as we sort client-side)
      const { data: allModules, error: modulesError } = await supabase
        .from('modules')
        .select('*');

      if (modulesError) throw modulesError;

      // Fetch progress separately
      const { data: progressData, error: progressError } = await supabase
        .from('user_module_progress')
        .select('*')
        .eq('user_id', userId);

      if (progressError) throw progressError;

      // Create a map of module progress by module ID
      const progressMap = new Map();
      progressData?.forEach(progress => {
        progressMap.set(progress.module_id, {
          progress: progress.progress || 0,
          status: progress.status || 'locked'
        });
      });

      // Combine modules with their progress
      const formattedModules = allModules.map(module => {
        const progress = progressMap.get(module.id) || { progress: 0, status: 'locked' };
        return {
          ...module,
          progress: progress.progress,
          status: progress.status
        };
      });

      // Log the raw difficulty levels before sorting
      console.log("Raw Modules (before sort):", formattedModules.map(m => ({ title: m.title, difficulty: m.difficulty_level })));

      // Define the desired order of difficulty levels
      const difficultyOrder: { [key: string]: number } = {
        'Beginner': 1,
        'Intermediate': 2,
        'Advanced': 3,
      };

      // Sort modules based on difficulty level (using a copy of the array)
      const sortedModules = [...formattedModules].sort((a, b) => {
        const levelA = difficultyOrder[a.difficulty_level] || 99; // Assign a high number for unknown levels
        const levelB = difficultyOrder[b.difficulty_level] || 99;
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
