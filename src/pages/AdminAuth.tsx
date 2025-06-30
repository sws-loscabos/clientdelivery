import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';
import { Shield, Lock, AlertCircle } from 'lucide-react';

const AdminAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated as admin
  useEffect(() => {
    if (!authLoading && user && profile) {
      if (profile.role === 'admin') {
        navigate('/admin');
      } else {
        // If user is logged in but not admin, show error and sign out
        toast({
          title: 'Access Denied',
          description: 'You do not have admin privileges. Please contact your administrator.',
          variant: 'destructive',
        });
        supabase.auth.signOut();
      }
    }
  }, [user, profile, authLoading, navigate, toast]);

  const validateForm = () => {
    if (!email || !password) {
      toast({
        title: 'Validation Error',
        description: 'Email and password are required.',
        variant: 'destructive',
      });
      return false;
    }

    if (password.length < 6) {
      toast({
        title: 'Validation Error',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      console.log('Attempting admin login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error('Admin login error:', error);
        toast({
          title: 'Login Failed',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      if (data.user) {
        console.log('Login successful, checking admin role...');
        
        // Check if user has admin role
        const { data: userProfile, error: profileError } = await supabase
          .from('profiles')
          .select('role, full_name')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          toast({
            title: 'Access Denied',
            description: 'Unable to verify admin privileges. Please try again.',
            variant: 'destructive',
          });
          await supabase.auth.signOut();
          return;
        }

        console.log('User profile:', userProfile);

        if (userProfile?.role !== 'admin') {
          console.log('User is not admin, role:', userProfile?.role);
          toast({
            title: 'Access Denied',
            description: 'You do not have admin privileges. This area is restricted to administrators only.',
            variant: 'destructive',
          });
          await supabase.auth.signOut();
          return;
        }

        console.log('Admin login successful');
        toast({
          title: 'Admin Login Successful',
          description: `Welcome back, ${userProfile.full_name || 'Admin'}!`,
        });
        
        // AuthProvider will handle navigation to /admin
      }
    } catch (error) {
      console.error('Unexpected admin login error:', error);
      toast({
        title: 'Login Failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900">
        <Card className="w-full max-w-md mx-4 border-slate-200 shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Initializing authentication...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900">
      <Card className="w-full max-w-md mx-4 border-slate-200 shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">Admin Login</CardTitle>
          <CardDescription className="text-slate-600">
            Enter your admin credentials to access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium">Admin Access Only</p>
                <p>Only users with admin privileges can access this area. Contact your administrator if you need access.</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email" className="text-slate-700 font-medium">
                <Lock className="w-4 h-4 inline mr-2" />
                Admin Email
              </Label>
              <Input 
                id="admin-email" 
                type="email" 
                placeholder="admin@company.com" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password" className="text-slate-700 font-medium">
                Password
              </Label>
              <Input 
                id="admin-password" 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                minLength={6}
                className="border-slate-300 focus:border-blue-500"
                placeholder="Enter your password"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Verifying credentials...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Sign In as Admin
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-6 pt-4 border-t border-slate-200">
            <p className="text-center text-sm text-slate-600">
              Not an admin?{' '}
              <button
                onClick={() => navigate('/auth')}
                className="text-blue-600 hover:text-blue-700 font-medium"
                disabled={loading}
              >
                Client Login
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuth;