import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SendOTPRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

    const { email }: SendOTPRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in database
    const { error: dbError } = await supabaseClient
      .from('email_otps')
      .insert({
        email,
        otp,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes
      });

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Failed to generate OTP' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Send OTP via email
    const emailResponse = await resend.emails.send({
      from: 'Repo to Edit <onboarding@resend.dev>',
      to: [email],
      subject: 'Your Login OTP - Repo to Edit',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">Repo to Edit</h1>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #495057; margin-bottom: 15px;">Your Login Code</h2>
            <p style="font-size: 16px; color: #6c757d; margin-bottom: 20px;">
              Use this 6-digit code to sign in to your account:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 5px; background: white; padding: 15px 25px; border-radius: 5px; border: 2px solid #e9ecef;">
                ${otp}
              </span>
            </div>
            <p style="font-size: 14px; color: #6c757d;">
              This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
            </p>
          </div>
          <p style="font-size: 12px; color: #adb5bd; text-align: center;">
            Repo to Edit - Document Management System
          </p>
        </div>
      `,
    });

    if (emailResponse.error) {
      console.error('Email error:', emailResponse.error);
      return new Response(
        JSON.stringify({ error: 'Failed to send OTP email' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    console.log('OTP sent successfully to:', email);

    return new Response(
      JSON.stringify({ message: 'OTP sent successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (error: any) {
    console.error('Error in send-otp function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
};

serve(handler);