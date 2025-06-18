
-- First, ensure all posts have corresponding profiles
-- This prevents the foreign key constraint from failing
INSERT INTO public.profiles (id, username, full_name)
SELECT DISTINCT p.user_id, 'user_' || substr(p.user_id::text, 1, 8), 'Unknown User'
FROM public.posts p
WHERE p.user_id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

-- Now add the foreign key constraint from posts.user_id to profiles.id
ALTER TABLE public.posts 
DROP CONSTRAINT IF EXISTS posts_user_id_fkey;

ALTER TABLE public.posts 
ADD CONSTRAINT posts_user_id_profiles_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
