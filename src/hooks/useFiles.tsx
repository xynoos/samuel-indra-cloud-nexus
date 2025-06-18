
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Tables } from '@/integrations/supabase/types';

type FileData = Tables<'files'>;

export const useFiles = (isPublic = false) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['files', user?.id, isPublic],
    queryFn: async () => {
      if (!user && !isPublic) return [];

      let query = supabase
        .from('files')
        .select('*')
        .order('created_at', { ascending: false });

      if (isPublic) {
        query = query.eq('is_public', true);
      } else {
        query = query.eq('user_id', user!.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
    enabled: !!user || isPublic,
  });
};

export const useUploadFile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (fileData: Omit<FileData, 'id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('files')
        .insert({
          ...fileData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
};
