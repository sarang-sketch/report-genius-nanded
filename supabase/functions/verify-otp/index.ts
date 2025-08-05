import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerifyOTPRequest {
  email: string;
  otp: string;
  fullName?: string;
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

    const { email, otp, fullName }: VerifyOTPRequest = await req.json();

    if (!email || !otp) {
      return new Response(
        JSON.stringify({ error: 'Email and OTP are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Verify OTP
    const { data: otpData, error: otpError } = await supabaseClient
      .from('email_otps')
      .select('*')
      .eq('email', email)
      .eq('otp', otp)
      .eq('verified', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (otpError || !otpData) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired OTP' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Mark OTP as verified
    await supabaseClient
      .from('email_otps')
      .update({ verified: true })
      .eq('id', otpData.id);

    // Check if user exists in our custom users table
    let { data: userData, error: userError } = await supabaseClient
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    // If user doesn't exist, create them
    if (!userData) {
      const { data: newUser, error: createError } = await supabaseClient
        .from('users')
        .insert({
          email,
          full_name: fullName || email.split('@')[0]
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating user:', createError);
        return new Response(
          JSON.stringify({ error: 'Failed to create user' }),
          { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
      userData = newUser;
    }

    // Create or sign in user with Supabase auth using admin API
    const { data: authData, error: authError } = await supabaseClient.auth.admin.createUser({
      email,
      password: `temp_${Date.now()}`, // Temporary password since we're using OTP
      email_confirm: true,
      user_metadata: {
        full_name: userData.full_name,
        custom_user_id: userData.id
      }
    });

    if (authError && authError.message !== 'User already registered') {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Authentication failed' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Generate session token
    const { data: sessionData, error: sessionError } = await supabaseClient.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
      options: {
        redirectTo: `${req.headers.get('origin') || 'http://localhost:3000'}/dashboard`
      }
    });

    if (sessionError) {
      console.error('Session error:', sessionError);
      return new Response(
        JSON.stringify({ error: 'Failed to create session' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    console.log('OTP verified successfully for:', email);

    return new Response(
      JSON.stringify({ 
        message: 'OTP verified successfully',
        user: userData,
        session_url: sessionData.properties?.action_link
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (error: any) {
    console.error('Error in verify-otp function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
};

serve(handler);