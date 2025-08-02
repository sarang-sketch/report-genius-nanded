import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { reportId } = await req.json();
    console.log('Generating report for ID:', reportId);

    // Get report details
    const { data: report, error: reportError } = await supabaseClient
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .single();

    if (reportError || !report) {
      throw new Error('Report not found');
    }

    console.log('Report details:', report);

    // Generate content using OpenAI
    const prompt = `Generate a comprehensive ${report.pages}-page report on "${report.topic}" with the title "${report.title}".

Format requirements:
- Professional academic/business format
- Proper spacing and paragraph structure
- Include introduction, main sections, and conclusion
- Target exactly ${report.pages} pages when printed
- Each page should contain approximately 250-300 words
- Use clear headings and subheadings
- Include relevant examples and explanations

Additional instructions: ${report.additional_instructions || 'None'}

Please structure the content with proper HTML formatting for PDF generation.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a professional report writer. Generate well-structured, informative content with proper formatting.'
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 4000,
        temperature: 0.7,
      }),
    });

    const aiData = await response.json();
    const generatedContent = aiData.choices[0].message.content;

    console.log('Content generated, length:', generatedContent.length);

    // Create HTML template for PDF
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${report.title}</title>
    <style>
        @page {
            size: ${report.format};
            margin: 1in;
        }
        body {
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .cover-page {
            text-align: center;
            padding-top: 3in;
            page-break-after: always;
        }
        .title {
            font-size: 24pt;
            font-weight: bold;
            margin-bottom: 1in;
        }
        .subtitle {
            font-size: 16pt;
            margin-bottom: 0.5in;
        }
        .content {
            text-align: justify;
        }
        h1 {
            font-size: 18pt;
            font-weight: bold;
            margin-top: 0.5in;
            margin-bottom: 0.25in;
            page-break-after: avoid;
        }
        h2 {
            font-size: 14pt;
            font-weight: bold;
            margin-top: 0.3in;
            margin-bottom: 0.15in;
        }
        p {
            margin-bottom: 0.15in;
            text-indent: 0.5in;
        }
        .page-number {
            position: fixed;
            bottom: 0.5in;
            right: 0.5in;
            font-size: 10pt;
        }
    </style>
</head>
<body>
    ${report.cover ? `
    <div class="cover-page">
        <div class="title">${report.title}</div>
        <div class="subtitle">Report on ${report.topic}</div>
        <div style="margin-top: 2in;">
            <div>Generated Report</div>
            <div>${new Date().toLocaleDateString()}</div>
        </div>
    </div>
    ` : ''}
    
    <div class="content">
        ${generatedContent}
    </div>
</body>
</html>`;

    // Generate PDF using Puppeteer-like service (simulation for now)
    console.log('HTML content prepared for PDF generation');

    // For now, we'll store the HTML content and mark as completed
    // In production, you'd use a PDF generation service
    const fileName = `${report.user_id}/${reportId}.html`;
    
    // Upload the generated content to storage
    const { error: uploadError } = await supabaseClient.storage
      .from('reports')
      .upload(fileName, new Blob([htmlContent], { type: 'text/html' }), {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    // Get the file URL
    const { data: urlData } = supabaseClient.storage
      .from('reports')
      .getPublicUrl(fileName);

    // Update report with generated content and file URL
    const { error: updateError } = await supabaseClient
      .from('reports')
      .update({
        status: 'completed',
        generated_content: generatedContent,
        file_url: urlData.publicUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', reportId);

    if (updateError) {
      console.error('Update error:', updateError);
      throw updateError;
    }

    console.log('Report generation completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        fileUrl: urlData.publicUrl,
        content: generatedContent 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in generate-report function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});