
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Link, Calendar, Download, User } from 'lucide-react';
import ProjectLinks from './ProjectLinks';
import FAQ from './FAQ';
import ContactForm from './ContactForm';
import DocumentViewer from './DocumentViewer';

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = React.useState('overview');

  const projectStats = [
    { label: 'Current Projects', value: '2', color: 'text-blue-600' },
    { label: 'Completed Projects', value: '1', color: 'text-green-600' },
    { label: 'Pending Reviews', value: '1', color: 'text-yellow-600' },
    { label: 'Total Files', value: '12', color: 'text-purple-600' },
  ];

  const recentUpdates = [
    { 
      title: 'Website Design v2.0 Ready', 
      description: 'New homepage design with improved UX flow',
      date: '2 days ago',
      type: 'design'
    },
    { 
      title: 'Development Progress Update', 
      description: 'Frontend development is 80% complete',
      date: '1 week ago',
      type: 'update'
    },
    { 
      title: 'Contract Amendment', 
      description: 'Updated project scope and timeline',
      date: '2 weeks ago',
      type: 'document'
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Welcome back, Jane!</h1>
          <p className="text-slate-600 mt-1">Here's your project overview and latest updates</p>
        </div>
        <div className="flex items-center space-x-2">
          <User className="w-5 h-5 text-slate-600" />
          <span className="text-sm text-slate-600">Acme Corporation</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-fit">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'projects', label: 'Project Links' },
          { id: 'documents', label: 'Documents' },
          { id: 'faq', label: 'FAQ' },
          { id: 'contact', label: 'Contact' },
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
          {/* Project Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projectStats.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Current Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Your Current Projects</CardTitle>
              <CardDescription>Track the progress of your ongoing projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <div>
                    <h3 className="font-semibold text-slate-800">Website Redesign</h3>
                    <p className="text-sm text-slate-600">Homepage design and development</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                      <span className="text-sm text-slate-600">75%</span>
                    </div>
                  </div>
                  <Badge>In Progress</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                  <div>
                    <h3 className="font-semibold text-slate-800">Brand Guidelines</h3>
                    <p className="text-sm text-slate-600">Logo and brand identity design</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                      <span className="text-sm text-slate-600">90%</span>
                    </div>
                  </div>
                  <Badge variant="secondary">Review</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Updates */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Updates</CardTitle>
              <CardDescription>Latest project updates and communications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUpdates.map((update, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg">
                    <div className="flex-shrink-0">
                      {update.type === 'design' && <FileText className="w-5 h-5 text-blue-600" />}
                      {update.type === 'update' && <Calendar className="w-5 h-5 text-green-600" />}
                      {update.type === 'document' && <FileText className="w-5 h-5 text-purple-600" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800">{update.title}</h4>
                      <p className="text-sm text-slate-600 mt-1">{update.description}</p>
                      <p className="text-xs text-slate-500 mt-2">{update.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'projects' && <ProjectLinks />}
      {activeTab === 'documents' && <DocumentViewer />}
      {activeTab === 'faq' && <FAQ />}
      {activeTab === 'contact' && <ContactForm />}
    </div>
  );
};

export default ClientDashboard;
