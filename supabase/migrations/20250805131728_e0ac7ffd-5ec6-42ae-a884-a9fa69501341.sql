-- Create email_otps table for OTP verification
CREATE TABLE public.email_otps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  otp TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '10 minutes'),
  verified BOOLEAN NOT NULL DEFAULT false
);

-- Enable RLS on email_otps
ALTER TABLE public.email_otps ENABLE ROW LEVEL SECURITY;

-- Create policy for email_otps (allow users to manage their own OTPs)
CREATE POLICY "Users can manage their own OTPs" 
ON public.email_otps 
FOR ALL 
USING (true);

-- Create users table for custom user management
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for users
CREATE POLICY "Users can view their own data" 
ON public.users 
FOR SELECT 
USING (id = auth.uid()::uuid OR email = auth.email());

CREATE POLICY "Users can update their own data" 
ON public.users 
FOR UPDATE 
USING (id = auth.uid()::uuid OR email = auth.email());

-- Create report_forms table
CREATE TABLE public.report_forms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  doc_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on report_forms
ALTER TABLE public.report_forms ENABLE ROW LEVEL SECURITY;

-- Create policies for report_forms
CREATE POLICY "Users can view their own reports" 
ON public.report_forms 
FOR SELECT 
USING (user_id = auth.uid()::uuid);

CREATE POLICY "Users can create their own reports" 
ON public.report_forms 
FOR INSERT 
WITH CHECK (user_id = auth.uid()::uuid);

CREATE POLICY "Users can update their own reports" 
ON public.report_forms 
FOR UPDATE 
USING (user_id = auth.uid()::uuid);

CREATE POLICY "Users can delete their own reports" 
ON public.report_forms 
FOR DELETE 
USING (user_id = auth.uid()::uuid);

-- Create trigger for updating timestamps
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_report_forms_updated_at
BEFORE UPDATE ON public.report_forms
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for email lookups
CREATE INDEX idx_email_otps_email ON public.email_otps(email);
CREATE INDEX idx_email_otps_expires_at ON public.email_otps(expires_at);
CREATE INDEX idx_users_email ON public.users(email);