
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Mail, Calendar, Plus } from 'lucide-react';

const ClientManagement = () => {
  const clients = [
    {
      id: 1,
      name: 'Acme Corporation',
      contact: 'John Smith',
      email: 'john@acme.com',
      projects: 3,
      status: 'Active',
      lastContact: '2 days ago',
      avatar: '/placeholder.svg'
    },
    {
      id: 2,
      name: 'StartupXYZ',
      contact: 'Sarah Johnson',
      email: 'sarah@startupxyz.com',
      projects: 1,
      status: 'Active',
      lastContact: '1 week ago',
      avatar: '/placeholder.svg'
    },
    {
      id: 3,
      name: 'Fashion Co',
      contact: 'Mike Wilson',
      email: 'mike@fashionco.com',
      projects: 2,
      status: 'Completed',
      lastContact: '3 days ago',
      avatar: '/placeholder.svg'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Client Management</h2>
          <p className="text-slate-600 mt-1">Manage your clients and their project access</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <Card key={client.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={client.avatar} />
                  <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{client.name}</CardTitle>
                  <CardDescription>{client.contact}</CardDescription>
                </div>
                <Badge variant={client.status === 'Active' ? 'default' : 'secondary'}>
                  {client.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Mail className="w-4 h-4" />
                <span>{client.email}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Users className="w-4 h-4" />
                <span>{client.projects} active projects</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Calendar className="w-4 h-4" />
                <span>Last contact: {client.lastContact}</span>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Projects
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">8</div>
            <div className="text-sm text-slate-600">Total Clients</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">6</div>
            <div className="text-sm text-slate-600">Active Clients</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">15</div>
            <div className="text-sm text-slate-600">Total Projects</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientManagement;
