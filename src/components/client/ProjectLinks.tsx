
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, Calendar, User } from 'lucide-react';

const ProjectLinks = () => {
  const projectLinks = [
    {
      id: 1,
      title: 'Design Preview - Homepage',
      description: 'Interactive preview of your new homepage design',
      url: 'https://preview.example.com/homepage',
      category: 'Design',
      status: 'Active',
      addedDate: '2024-03-15',
      addedBy: 'Design Team'
    },
    {
      id: 2,
      title: 'Development Staging',
      description: 'Live staging environment for testing',
      url: 'https://staging.example.com',
      category: 'Development',
      status: 'Active',
      addedDate: '2024-03-10',
      addedBy: 'Dev Team'
    },
    {
      id: 3,
      title: 'Brand Assets Library',
      description: 'Download your logo files and brand assets',
      url: 'https://assets.example.com',
      category: 'Assets',
      status: 'Active',
      addedDate: '2024-03-05',
      addedBy: 'Design Team'
    },
    {
      id: 4,
      title: 'Project Documentation',
      description: 'Technical specifications and project requirements',
      url: 'https://docs.example.com',
      category: 'Documentation',
      status: 'Archive',
      addedDate: '2024-02-28',
      addedBy: 'Project Manager'
    },
  ];

  const categoryColors = {
    'Design': 'bg-blue-100 text-blue-800',
    'Development': 'bg-green-100 text-green-800',
    'Assets': 'bg-purple-100 text-purple-800',
    'Documentation': 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Project Links</h2>
        <p className="text-slate-600 mt-1">Access your project previews, staging sites, and resources</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projectLinks.map((link) => (
          <Card key={link.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Link className="w-5 h-5 text-blue-600" />
                    <span>{link.title}</span>
                  </CardTitle>
                  <CardDescription className="mt-2">{link.description}</CardDescription>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <Badge 
                    variant={link.status === 'Active' ? 'default' : 'secondary'}
                  >
                    {link.status}
                  </Badge>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[link.category]}`}>
                    {link.category}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-slate-600 space-y-1">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Added: {new Date(link.addedDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>By: {link.addedBy}</span>
                </div>
              </div>
              
              <div className="bg-slate-100 p-3 rounded-lg">
                <p className="text-sm text-slate-600 break-all">{link.url}</p>
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => window.open(link.url, '_blank')}
              >
                <Link className="w-4 h-4 mr-2" />
                Open Link
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <CardDescription>Can't find what you're looking for? We're here to help!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="flex-1">
              Request New Link
            </Button>
            <Button variant="outline" className="flex-1">
              Report Issue
            </Button>
            <Button variant="outline" className="flex-1">
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectLinks;
