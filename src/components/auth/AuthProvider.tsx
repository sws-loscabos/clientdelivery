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

  const fetchProfile = async (userId: string, retryCount = 0) => {
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
        if (error.code === 'PGRST116' && retryCount < 3) {
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

  useEffect(() => {
    const getSessionAndProfile = async () => {
      try {
        console.log('Getting initial session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setLoading(false);
          return;
        }

        if (session?.user) {
          console.log('Session found, user:', session.user.email);
          setSession(session);
          setUser(session.user);
          
          // Fetch user profile
          const userProfile = await fetchProfile(session.user.id);
          setProfile(userProfile);
          
          // Navigate based on role
          if (userProfile) {
            const currentPath = window.location.pathname;
            if (currentPath === '/auth' || currentPath === '/') {
              if (userProfile.role === 'admin') {
                navigate('/admin');
              } else {
                navigate('/client');
              }
            }
          }
        } else {
          console.log('No session found');
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getSessionAndProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Wait a bit for the trigger to create the profile for new signups
        if (event === 'SIGNED_UP') {
          console.log('New signup detected, waiting for profile creation...');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        const userProfile = await fetchProfile(session.user.id);
        setProfile(userProfile);
        
        // Navigate based on role after successful auth
        if (userProfile && (event === 'SIGNED_IN' || event === 'SIGNED_UP')) {
          if (userProfile.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/client');
          }
        }
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signOut = async () => {
    try {
      console.log('Signing out...');
      await supabase.auth.signOut();
      setProfile(null);
      setUser(null);
      setSession(null);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
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