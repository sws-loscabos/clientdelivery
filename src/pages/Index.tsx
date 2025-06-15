
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Users, FileText, Link as LinkIcon, Mail, Shield } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">CP</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-slate-800 mb-4">
            Client Delivery Portal
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Streamline your design agency workflow with our professional client portal. 
            Manage projects, share files, and communicate seamlessly with your clients.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link to="/admin">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8">
                <Shield className="w-5 h-5 mr-2" />
                Admin Dashboard
              </Button>
            </Link>
            <Link to="/client">
              <Button size="lg" variant="outline" className="px-8 hover:bg-blue-50">
                <User className="w-5 h-5 mr-2" />
                Client Portal
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Client Management</CardTitle>
              <CardDescription>
                Organize and manage all your clients in one centralized dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>• Client profiles and contact information</li>
                <li>• Project assignment and tracking</li>
                <li>• Communication history</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>File Sharing</CardTitle>
              <CardDescription>
                Securely upload and share project files with your clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>• Drag & drop file uploads</li>
                <li>• Document viewer and exporter</li>
                <li>• Version control and history</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <LinkIcon className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Project Links</CardTitle>
              <CardDescription>
                Share project previews, staging sites, and resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>• Design previews and prototypes</li>
                <li>• Staging environment access</li>
                <li>• Asset libraries and downloads</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-yellow-600" />
              </div>
              <CardTitle>Communication</CardTitle>
              <CardDescription>
                Built-in messaging and support system for seamless communication
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>• Contact forms and messaging</li>
                <li>• Priority-based ticket system</li>
                <li>• Response time tracking</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle>FAQ System</CardTitle>
              <CardDescription>
                Comprehensive FAQ section to reduce support requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>• Searchable question database</li>
                <li>• Category-based organization</li>
                <li>• Self-service support</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-indigo-600" />
              </div>
              <CardTitle>Secure Access</CardTitle>
              <CardDescription>
                Role-based access control for admins and clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>• Admin and client dashboards</li>
                <li>• Secure file sharing</li>
                <li>• Activity tracking</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-2xl p-12 shadow-lg">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Ready to streamline your client workflow?
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Experience the power of organized project delivery and enhanced client communication.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/admin">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8">
                Try Admin Dashboard
              </Button>
            </Link>
            <Link to="/client">
              <Button size="lg" variant="outline" className="px-8 hover:bg-blue-50">
                View Client Experience
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
