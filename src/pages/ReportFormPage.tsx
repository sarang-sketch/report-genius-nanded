import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, Upload, User, Mail } from 'lucide-react';

const categories = [
  'Academic Research',
  'Business Report',
  'Technical Documentation',
  'Project Analysis',
  'Market Research',
  'Case Study',
  'White Paper',
  'Other'
];

const ReportFormPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    doc_link: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Get user data from our custom users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', user?.email)
        .single();

      if (userError || !userData) {
        throw new Error('User not found');
      }

      const { data, error } = await supabase
        .from('report_forms')
        .insert({
          user_id: userData.id,
          title: formData.title,
          category: formData.category,
          description: formData.description,
          doc_link: formData.doc_link || null
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Report Submitted!",
        description: "Your report has been submitted successfully.",
      });

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Submit report error:', error);
      setError(error.message || 'Failed to submit report');
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || 'Failed to submit report',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold mb-2">Submit New Report</h1>
          <p className="text-muted-foreground">
            Create and submit your report for processing and delivery
          </p>
        </div>

        {/* User Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user?.email}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Report Details
            </CardTitle>
            <CardDescription>
              Fill in the details for your report submission
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Report Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter report title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleChange('category', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your report requirements in detail..."
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="min-h-[120px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="doc_link" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Document Link (Optional)
                </Label>
                <Input
                  id="doc_link"
                  placeholder="Google Docs link, file URL, or reference material"
                  value={formData.doc_link}
                  onChange={(e) => handleChange('doc_link', e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Provide a link to any reference documents, Google Docs, or additional materials
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Submitting...' : 'Submit Report'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportFormPage;