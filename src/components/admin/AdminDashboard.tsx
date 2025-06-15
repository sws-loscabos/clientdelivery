
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, Users, FileText, Plus } from 'lucide-react';
import ProjectUpload from './ProjectUpload';
import ClientManagement from './ClientManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = React.useState('overview');

  const stats = [
    { label: 'Active Projects', value: '12', color: 'bg-blue-500' },
    { label: 'Total Clients', value: '8', color: 'bg-green-500' },
    { label: 'Pending Reviews', value: '5', color: 'bg-yellow-500' },
    { label: 'Completed Projects', value: '24', color: 'bg-purple-500' },
  ];

  const recentProjects = [
    { id: 1, name: 'Website Redesign', client: 'Acme Corp', status: 'In Progress', lastUpdate: '2 days ago' },
    { id: 2, name: 'Brand Identity', client: 'StartupXYZ', status: 'Review', lastUpdate: '1 day ago' },
    { id: 3, name: 'E-commerce Site', client: 'Fashion Co', status: 'Completed', lastUpdate: '3 days ago' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-600 mt-1">Manage your clients and projects</p>
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
