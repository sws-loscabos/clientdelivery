import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from './auth/AuthProvider';

const Navigation = () => {
  const { user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/auth');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to={profile?.role === 'admin' ? '/admin' : '/client'} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CP</span>
            </div>
            <span className="font-semibold text-slate-800">Client Portal</span>
          </Link>

          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm text-slate-600">Loading...</span>
              </div>
            ) : !user ? (
              <Button 
                onClick={handleLogin}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Login / Sign Up
              </Button>
            ) : (
              <div className="flex items-center space-x-3">
                {profile && (
                  <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'}>
                    {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                  </Badge>
                )}
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-slate-600" />
                  <span className="text-sm text-slate-600">
                    {profile?.full_name || user.email}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-slate-600 hover:text-slate-800"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;