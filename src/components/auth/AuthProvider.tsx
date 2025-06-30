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

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      console.log(`Fetching profile for user ${userId}`);
      
      const { data: userProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
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

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          if (isMounted) {
            setLoading(false);
          }
          return;
        }

        if (initialSession?.user && isMounted) {
          console.log('Initial session found:', initialSession.user.email);
          setSession(initialSession);
          setUser(initialSession.user);
          
          // Fetch profile
          const userProfile = await fetchProfile(initialSession.user.id);
          if (isMounted) {
            setProfile(userProfile);
          }
        } else {
          console.log('No initial session found');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Initialize auth
    initializeAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      console.log('Auth state changed:', event, session?.user?.email);
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Fetch profile for authenticated user
        const userProfile = await fetchProfile(session.user.id);
        if (isMounted) {
          setProfile(userProfile);
          
          // Navigate based on role only for login events
          if (userProfile && (event === 'SIGNED_IN' || event === 'SIGNED_UP')) {
            const currentPath = window.location.pathname;
            
            if (userProfile.role === 'admin' && !currentPath.startsWith('/admin')) {
              navigate('/admin');
            } else if (userProfile.role === 'client' && !currentPath.startsWith('/client')) {
              navigate('/client');
            }
          }
        }
      } else {
        if (isMounted) {
          setProfile(null);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

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