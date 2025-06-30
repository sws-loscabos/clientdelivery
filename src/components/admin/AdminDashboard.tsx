import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, Users, FileText, Plus, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import ProjectUpload from './ProjectUpload';
import ClientManagement from './ClientManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = React.useState('overview');
  const { user, profile, loading: authLoading } = useAuth();

  // Debug: Log current auth state
  React.useEffect(() => {
    console.log('AdminDashboard - Auth state:', { user: !!user, profile, authLoading });
  }, [user, profile, authLoading]);

  // Fetch dashboard stats with better error handling
  const { data: dashboardStats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      console.log('Fetching dashboard stats...');
      
      try {
        const [clientsResult, projectsResult] = await Promise.all([
          supabase.from('clients').select('id', { count: 'exact' }),
          supabase.from('projects').select('id, status', { count: 'exact' })
        ]);

        console.log('Clients result:', clientsResult);
        console.log('Projects result:', projectsResult);

        if (clientsResult.error) {
          console.error('Clients query error:', clientsResult.error);
          throw clientsResult.error;
        }
        if (projectsResult.error) {
          console.error('Projects query error:', projectsResult.error);
          throw projectsResult.error;
        }

        const totalClients = clientsResult.count || 0;
        const totalProjects = projectsResult.count || 0;
        const activeProjects = projectsResult.data?.filter(p => p.status !== 'Completed').length || 0;
        const completedProjects = projectsResult.data?.filter(p => p.status === 'Completed').length || 0;

        const stats = {
          totalClients,
          totalProjects,
          activeProjects,
          completedProjects,
          pendingReviews: projectsResult.data?.filter(p => p.status === 'Review').length || 0
        };

        console.log('Dashboard stats:', stats);
        return stats;
      } catch (error) {
        console.error('Error in dashboard stats query:', error);
        throw error;
      }
    },
    enabled: !!user && !!profile && profile.role === 'admin',
    retry: 3,
    retryDelay: 1000,
  });

  // Fetch recent projects with better error handling
  const { data: recentProjects = [], isLoading: projectsLoading, error: projectsError } = useQuery({
    queryKey: ['recent-projects'],
    queryFn: async () => {
      console.log('Fetching recent projects...');
      
      try {
        const { data, error } = await supabase
          .from('projects')
          .select(`
            id,
            name,
            status,
            created_at,
            clients(name)
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        console.log('Recent projects result:', { data, error });

        if (error) {
          console.error('Recent projects query error:', error);
          throw error;
        }

        const formattedProjects = (data || []).map(project => ({
          id: project.id,
          name: project.name,
          client: project.clients?.name || 'Unknown Client',
          status: project.status || 'In Progress',
          lastUpdate: formatDate(project.created_at)
        }));

        console.log('Formatted projects:', formattedProjects);
        return formattedProjects;
      } catch (error) {
        console.error('Error in recent projects query:', error);
        throw error;
      }
    },
    enabled: !!user && !!profile && profile.role === 'admin',
    retry: 3,
    retryDelay: 1000,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error if user is not admin
  if (!user || !profile || profile.role !== 'admin') {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Access Denied</h3>
              <p className="text-slate-600">You need admin privileges to access this dashboard.</p>
              <p className="text-sm text-slate-500 mt-2">Current role: {profile?.role || 'Unknown'}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show database errors if they occur
  if (statsError || projectsError) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Database Error</h3>
              <p className="text-slate-600 mb-4">There was an error loading the dashboard data.</p>
              <details className="text-left text-sm text-slate-500">
                <summary className="cursor-pointer mb-2">Error Details</summary>
                <pre className="whitespace-pre-wrap">
                  {statsError?.message || projectsError?.message || 'Unknown error'}
                </pre>
              </details>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-4"
              >
                Reload Page
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const stats = [
    { 
      label: 'Active Projects', 
      value: statsLoading ? '...' : (dashboardStats?.activeProjects?.toString() || '0'), 
      color: 'bg-blue-500' 
    },
    { 
      label: 'Total Clients', 
      value: statsLoading ? '...' : (dashboardStats?.totalClients?.toString() || '0'), 
      color: 'bg-green-500' 
    },
    { 
      label: 'Pending Reviews', 
      value: statsLoading ? '...' : (dashboardStats?.pendingReviews?.toString() || '0'), 
      color: 'bg-yellow-500' 
    },
    { 
      label: 'Completed Projects', 
      value: statsLoading ? '...' : (dashboardStats?.completedProjects?.toString() || '0'), 
      color: 'bg-purple-500' 
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-600 mt-1">Manage your clients and projects</p>
          {profile && (
            <p className="text-sm text-slate-500 mt-1">
              Logged in as: {profile.full_name || user.email} (Admin)
            </p>
          )}
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-fit">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'upload', label: 'Upload Files' },
          { id: 'clients', label: 'Clients' },
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab(tab.id)}
            className={activeTab === tab.id ? 'bg-white shadow-sm' : ''}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                      <p className="text-3xl font-bold text-slate-800 mt-1">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 ${stat.color} rounded-lg opacity-10`}></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>Latest project updates and status</CardDescription>
            </CardHeader>
            <CardContent>
              {projectsLoading ? (
                <div className="text-center py-4 text-slate-600">Loading projects...</div>
              ) : recentProjects.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-600 mb-2">No projects yet</h3>
                  <p className="text-slate-500">Create your first project to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentProjects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-slate-800">{project.name}</h3>
                        <p className="text-sm text-slate-600">{project.client} • {project.lastUpdate}</p>
                      </div>
                      <Badge 
                        variant={project.status === 'Completed' ? 'default' : 
                                 project.status === 'Review' ? 'secondary' : 'outline'}
                      >
                        {project.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'upload' && <ProjectUpload />}
      {activeTab === 'clients' && <ClientManagement />}
    </div>
  );
};

export default AdminDashboard;