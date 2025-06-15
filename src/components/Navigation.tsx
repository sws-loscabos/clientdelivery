
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Settings, LogOut } from 'lucide-react';

const Navigation = () => {
  const [userType, setUserType] = useState<'admin' | 'client' | null>('admin'); // Mock user type
  const navigate = useNavigate();

  const handleLogin = (type: 'admin' | 'client') => {
    setUserType(type);
    navigate(type === 'admin' ? '/admin' : '/client');
  };

  const handleLogout = () => {
    setUserType(null);
    navigate('/');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CP</span>
            </div>
            <span className="font-semibold text-slate-800">Client Portal</span>
          </Link>

          <div className="flex items-center space-x-4">
            {!userType ? (
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleLogin('client')}
                  className="hover:bg-blue-50"
                >
                  Client Login
                </Button>
                <Button 
                  onClick={() => handleLogin('admin')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Admin Login
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Badge variant={userType === 'admin' ? 'default' : 'secondary'}>
                  {userType === 'admin' ? 'Admin' : 'Client'}
                </Badge>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-slate-600" />
                  <span className="text-sm text-slate-600">
                    {userType === 'admin' ? 'John Admin' : 'Jane Client'}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-slate-600 hover:text-slate-800"
                >
                  <LogOut className="w-4 h-4" />
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
