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
      console.log(`👤 Fetching profile for user ${userId}...`);
      
      // Add a timeout to the profile fetch
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Profile fetch timeout')), 5000);
      });

      const profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const { data: userProfile, error } = await Promise.race([
        profilePromise,
        timeoutPromise
      ]);

      if (error) {
        console.error('❌ Error fetching profile:', error);
        
        // If profile doesn't exist, create a default one
        if (error.code === 'PGRST116') {
          console.log('📝 Profile not found, creating default profile...');
          
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([{
              id: userId,
              full_name: user?.email || 'User',
              role: 'client'
            }])
            .select()
            .single();

          if (createError) {
            console.error('❌ Error creating profile:', createError);
            return null;
          }

          console.log('✅ Default profile created:', newProfile);
          return newProfile as Profile;
        }
        
        return null;
      }

      console.log('✅ Profile fetched successfully:', userProfile);
      return userProfile as Profile;
    } catch (error) {
      console.error('❌ Error in fetchProfile:', error);
      
      // If it's a timeout, try to create a default profile
      if (error.message === 'Profile fetch timeout') {
        console.log('⏰ Profile fetch timed out, creating default profile...');
        
        try {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([{
              id: userId,
              full_name: user?.email || 'User',
              role: 'client'
            }])
            .select()
            .single();

          if (!createError && newProfile) {
            console.log('✅ Default profile created after timeout:', newProfile);
            return newProfile as Profile;
          }
        } catch (createErr) {
          console.error('❌ Failed to create default profile:', createErr);
        }
      }
      
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
      console.log('🚪 Signing out...');
      setLoading(true);
      await supabase.auth.signOut();
      setProfile(null);
      setUser(null);
      setSession(null);
      navigate('/');
    } catch (error) {
      console.error('❌ Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const initializeAuth = async () => {
      try {
        console.log('🔄 Starting auth initialization...');
        console.log('🔗 Supabase URL:', import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Missing');
        console.log('🔑 Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing');
        
        // Test Supabase connection first
        console.log('🧪 Testing Supabase connection...');
        const { data: testData, error: testError } = await supabase
          .from('profiles')
          .select('count')
          .limit(1);
        
        if (testError) {
          console.error('❌ Supabase connection test failed:', testError);
          throw new Error('Database connection failed');
        }
        
        console.log('✅ Supabase connection successful');
        
        // Get initial session
        console.log('🔍 Getting initial session...');
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Session error:', error);
          throw error;
        }

        if (initialSession?.user && isMounted) {
          console.log('✅ Initial session found:', initialSession.user.email);
          setSession(initialSession);
          setUser(initialSession.user);
          
          // Fetch profile with timeout
          console.log('👤 Fetching user profile...');
          const userProfile = await fetchProfile(initialSession.user.id);
          if (isMounted) {
            setProfile(userProfile);
            console.log('✅ Profile loaded:', userProfile?.role);
          }
        } else {
          console.log('ℹ️ No initial session found');
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        // Still set loading to false even on error
      } finally {
        if (isMounted) {
          console.log('✅ Auth initialization complete');
          setLoading(false);
        }
      }
    };

    // Set a timeout to force loading to false after 10 seconds
    timeoutId = setTimeout(() => {
      if (isMounted && loading) {
        console.warn('⚠️ Auth initialization timeout - forcing loading to false');
        setLoading(false);
      }
    }, 10000);

    // Initialize auth
    initializeAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      console.log('🔄 Auth state changed:', event, session?.user?.email);
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Fetch profile for authenticated user with timeout
        console.log('👤 Fetching profile after auth state change...');
        const userProfile = await fetchProfile(session.user.id);
        if (isMounted) {
          setProfile(userProfile);
          
          // Navigate based on role only for login events
          if (userProfile && (event === 'SIGNED_IN' || event === 'SIGNED_UP')) {
            const currentPath = window.location.pathname;
            
            if (userProfile.role === 'admin' && !currentPath.startsWith('/admin')) {
              console.log('🔀 Redirecting admin to /admin');
              navigate('/admin');
            } else if (userProfile.role === 'client' && !currentPath.startsWith('/client')) {
              console.log('🔀 Redirecting client to /client');
              navigate('/client');
            }
          }
        }
      } else {
        if (isMounted) {
          setProfile(null);
        }
      }
      
      // Set loading to false after handling auth state change
      if (isMounted) {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
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