import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export type Profile = {
  id: string;
  full_name: string | null;
  role: 'admin' | 'client';
  client_id: string | null;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = async (userId: string, retryCount = 0): Promise<Profile | null> => {
    try {
      console.log(`Fetching profile for user ${userId}, attempt ${retryCount + 1}`);
      
      const { data: userProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        
        // If profile doesn't exist and this is a new signup, wait and retry
        if (error.code === 'PGRST116' && retryCount < 2) {
          console.log('Profile not found, retrying in 1 second...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          return fetchProfile(userId, retryCount + 1);
        }
        
        return null;
      }

      console.log('Profile fetched successfully:', userProfile);
      return userProfile as Profile;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const userProfile = await fetchProfile(user.id);
      setProfile(userProfile);
    }
  };

  const handleAuthStateChange = async (event: string, session: Session | null) => {
    console.log('Auth state changed:', event, session?.user?.email);
    
    setSession(session);
    setUser(session?.user ?? null);
    
    if (session?.user) {
      // For new signups, wait a bit for the trigger to create the profile
      if (event === 'SIGNED_UP') {
        console.log('New signup detected, waiting for profile creation...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      const userProfile = await fetchProfile(session.user.id);
      setProfile(userProfile);
      
      // Only navigate on successful login/signup, not on initial load
      if (userProfile && (event === 'SIGNED_IN' || event === 'SIGNED_UP')) {
        const currentPath = window.location.pathname;
        
        // Don't redirect if already on the correct dashboard
        if (userProfile.role === 'admin' && !currentPath.startsWith('/admin')) {
          navigate('/admin');
        } else if (userProfile.role === 'client' && !currentPath.startsWith('/client')) {
          navigate('/client');
        }
      }
    } else {
      setProfile(null);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true;

    const getInitialSession = async () => {
      try {
        console.log('Getting initial session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          if (mounted) setLoading(false);
          return;
        }

        if (session?.user && mounted) {
          console.log('Initial session found, user:', session.user.email);
          setSession(session);
          setUser(session.user);
          
          // Fetch user profile
          const userProfile = await fetchProfile(session.user.id);
          if (mounted) {
            setProfile(userProfile);
            
            // Handle initial navigation based on current path and role
            const currentPath = window.location.pathname;
            if (userProfile) {
              // If on auth pages and user is authenticated, redirect to dashboard
              if (currentPath === '/auth' || currentPath === '/admin/auth' || currentPath === '/') {
                if (userProfile.role === 'admin') {
                  navigate('/admin');
                } else {
                  navigate('/client');
                }
              }
            }
          }
        } else {
          console.log('No initial session found');
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signOut = async () => {
    try {
      console.log('Signing out...');
      setLoading(true);
      await supabase.auth.signOut();
      setProfile(null);
      setUser(null);
      setSession(null);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    session,
    user,
    profile,
    loading,
    signOut,
    refreshProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};