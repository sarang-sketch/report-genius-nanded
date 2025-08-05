import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const OTPAuth = () => {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { email }
      });

      if (error) throw error;

      toast({
        title: "OTP Sent!",
        description: "Please check your email for the 6-digit code.",
      });
      setStep('otp');
    } catch (error: any) {
      console.error('Send OTP error:', error);
      setError(error.message || 'Failed to send OTP');
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || 'Failed to send OTP',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { email, otp, fullName }
      });

      if (error) throw error;

      if (data?.session_url) {
        // Navigate to the magic link URL to complete authentication
        window.location.href = data.session_url;
      } else {
        toast({
          title: "Success!",
          description: "OTP verified successfully. Redirecting...",
        });
        
        // Redirect to intended destination or dashboard
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      setError(error.message || 'Invalid or expired OTP');
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || 'Invalid or expired OTP',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      await supabase.functions.invoke('send-otp', {
        body: { email }
      });
      toast({
        title: "OTP Resent!",
        description: "Please check your email for the new code.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to resend OTP",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-serif">Repo to Edit</CardTitle>
          <CardDescription>
            {step === 'email' 
              ? 'Enter your email to receive a login code' 
              : 'Enter the 6-digit code sent to your email'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === 'email' ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name (Optional)</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send Login Code'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Enter 6-Digit Code</Label>
                <div className="flex justify-center">
                  <InputOTP
                    value={otp}
                    onChange={setOtp}
                    maxLength={6}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Code sent to {email}
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify Code'}
              </Button>
              <div className="text-center space-y-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-sm"
                >
                  Resend Code
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep('email')}
                  className="text-sm"
                >
                  Change Email
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OTPAuth;