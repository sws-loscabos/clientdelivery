
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { FileText, Download, Search, Calendar, User, File } from 'lucide-react';

const DocumentViewer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const documents = [
    {
      id: 1,
      name: 'Project Contract - Website Redesign',
      type: 'contract',
      size: '2.4 MB',
      uploadDate: '2024-03-01',
      uploadedBy: 'Legal Team',
      description: 'Main project contract with scope and timeline',
      status: 'Final'
    },
    {
      id: 2,
      name: 'Brand Guidelines v2.0',
      type: 'design',
      size: '5.8 MB',
      uploadDate: '2024-03-10',
      uploadedBy: 'Design Team',
      description: 'Complete brand identity guidelines and usage rules',
      status: 'Final'
    },
    {
      id: 3,
      name: 'Technical Specifications',
      type: 'technical',
      size: '1.2 MB',
      uploadDate: '2024-03-12',
      uploadedBy: 'Dev Team',
      description: 'Technical requirements and architecture overview',
      status: 'Draft'
    },
    {
      id: 4,
      name: 'Asset Package - Logos',
      type: 'assets',
      size: '12.5 MB',
      uploadDate: '2024-03-15',
      uploadedBy: 'Design Team',
      description: 'Logo files in various formats (PNG, SVG, EPS)',
      status: 'Final'
    },
    {
      id: 5,
      name: 'Project Timeline Update',
      type: 'document',
      size: '890 KB',
      uploadDate: '2024-03-18',
      uploadedBy: 'Project Manager',
      description: 'Updated project milestones and delivery dates',
      status: 'Final'
    },
  ];

  const typeColors = {
    'contract': 'bg-red-100 text-red-800',
    'design': 'bg-blue-100 text-blue-800',
    'technical': 'bg-green-100 text-green-800',
    'assets': 'bg-purple-100 text-purple-800',
    'document': 'bg-yellow-100 text-yellow-800',
  };

  const typeIcons = {
    'contract': FileText,
    'design': FileText,
    'technical': FileText,
    'assets': File,
    'document': FileText,
  };

  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'all' || doc.type === selectedCategory)
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Document Library</h2>
        <p className="text-slate-600 mt-1">View and download your project documents and assets</p>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              {['all', 'contract', 'design', 'technical', 'assets', 'document'].map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDocuments.map((doc) => {
          const IconComponent = typeIcons[doc.type];
          return (
            <Card key={doc.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <IconComponent className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{doc.name}</CardTitle>
                      <CardDescription className="mt-1">{doc.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge variant={doc.status === 'Final' ? 'default' : 'secondary'}>
                      {doc.status}
                    </Badge>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[doc.type]}`}>
                      {doc.type}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-slate-600 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                    </div>
                    <span className="text-slate-500">{doc.size}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Uploaded by: {doc.uploadedBy}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredDocuments.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">No documents found</h3>
            <p className="text-slate-500">Try adjusting your search terms or filters</p>
          </CardContent>
        </Card>
      )}

      {/* Document Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{documents.length}</div>
            <div className="text-sm text-slate-600">Total Documents</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {documents.filter(d => d.status === 'Final').length}
            </div>
            <div className="text-sm text-slate-600">Final Documents</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {(documents.reduce((total, doc) => {
                const size = parseFloat(doc.size.split(' ')[0]);
                return total + size;
              }, 0)).toFixed(1)} MB
            </div>
            <div className="text-sm text-slate-600">Total Size</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DocumentViewer;
