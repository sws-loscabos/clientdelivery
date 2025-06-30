/*
  # Complete database schema setup for client portal

  1. New Tables
    - `clients` - Store client company information
    - `projects` - Store project information linked to clients
    - Add `client_id` column to existing `profiles` table

  2. Security
    - Enable RLS on all tables
    - Add policies for admin and client access
    - Ensure data isolation between clients

  3. Functions
    - Create `get_user_role` function for RLS policies
*/

-- First, create the get_user_role function if it doesn't exist
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS public.app_role
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT COALESCE(
    (SELECT role FROM public.profiles WHERE id = auth.uid()),
    'client'::public.app_role
  );
$$;

-- Create the clients table first (no dependencies)
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_name TEXT,
  contact_email TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add client_id column to profiles if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='profiles' AND column_name='client_id') THEN
        ALTER TABLE public.profiles ADD COLUMN client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Create projects table (depends on clients table)
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'In Progress',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Admins can manage clients" ON public.clients;
DROP POLICY IF EXISTS "Admins can manage projects" ON public.projects;
DROP POLICY IF EXISTS "Clients can view their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage profiles" ON public.profiles;

-- Create RLS policies for clients table
CREATE POLICY "Admins can manage clients"
  ON public.clients FOR ALL
  USING (public.get_user_role() = 'admin')
  WITH CHECK (public.get_user_role() = 'admin');

-- Create RLS policies for projects table
CREATE POLICY "Admins can manage projects"
  ON public.projects FOR ALL
  USING (public.get_user_role() = 'admin')
  WITH CHECK (public.get_user_role() = 'admin');

CREATE POLICY "Clients can view their own projects"
  ON public.projects FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.client_id = projects.client_id
    )
  );

-- Create RLS policies for profiles table
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can manage profiles"
  ON public.profiles FOR ALL
  USING (public.get_user_role() = 'admin')
  WITH CHECK (public.get_user_role() = 'admin');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.clients TO authenticated;
GRANT ALL ON public.projects TO authenticated;
GRANT ALL ON public.profiles TO authenticated;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.get_user_role() TO authenticated, anon;