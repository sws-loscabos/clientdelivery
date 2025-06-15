
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, Link, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProjectUpload = () => {
  const [uploadType, setUploadType] = useState('file');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
      toast({
        title: "Upload successful!",
        description: "Your project update has been uploaded and the client has been notified.",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Upload Project Updates</h2>
        <p className="text-slate-600 mt-1">Share files, links, and updates with your clients</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="w-5 h-5" />
              <span>Upload Files</span>
            </CardTitle>
            <CardDescription>Upload project files, designs, or documents</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <Label htmlFor="client-select">Select Client</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="acme">Acme Corp</SelectItem>
                    <SelectItem value="startup">StartupXYZ</SelectItem>
                    <SelectItem value="fashion">Fashion Co</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="project-select">Project</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website Redesign</SelectItem>
                    <SelectItem value="brand">Brand Identity</SelectItem>
                    <SelectItem value="ecommerce">E-commerce Site</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="file-upload">Upload Files</Label>
                <div className="mt-2 border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-500 mt-1">PNG, JPG, PDF up to 10MB</p>
                  <Input type="file" multiple className="hidden" />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  placeholder="Describe the updates or files being shared..."
                  className="mt-1"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload Files'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Link className="w-5 h-5" />
              <span>Share Links</span>
            </CardTitle>
            <CardDescription>Share project links, previews, or resources</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <Label htmlFor="client-select">Select Client</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="acme">Acme Corp</SelectItem>
                    <SelectItem value="startup">StartupXYZ</SelectItem>
                    <SelectItem value="fashion">Fashion Co</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="link-title">Link Title</Label>
                <Input placeholder="e.g., Design Preview, Live Website" />
              </div>

              <div>
                <Label htmlFor="link-url">URL</Label>
                <Input placeholder="https://..." />
              </div>

              <div>
                <Label htmlFor="link-description">Description</Label>
                <Textarea 
                  placeholder="Describe what this link contains..."
                  className="mt-1"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                disabled={isUploading}
              >
                {isUploading ? 'Sharing...' : 'Share Link'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Recent Uploads */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Uploads</CardTitle>
          <CardDescription>Recently shared files and links</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { type: 'file', name: 'Homepage_Design_v2.pdf', client: 'Acme Corp', time: '2 hours ago' },
              { type: 'link', name: 'Design Preview', client: 'StartupXYZ', time: '1 day ago' },
              { type: 'file', name: 'Brand_Guidelines.pdf', client: 'Fashion Co', time: '2 days ago' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {item.type === 'file' ? 
                    <FileText className="w-5 h-5 text-blue-600" /> : 
                    <Link className="w-5 h-5 text-green-600" />
                  }
                  <div>
                    <p className="font-medium text-slate-800">{item.name}</p>
                    <p className="text-sm text-slate-600">{item.client} • {item.time}</p>
                  </div>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectUpload;
