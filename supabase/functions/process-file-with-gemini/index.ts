import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      throw new Error('No file provided');
    }

    console.log(`Processing file: ${file.name}, type: ${file.type}, size: ${file.size}`);

    // Check file size (max 5MB for Gemini API)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size too large. Maximum supported size is 5MB.');
    }

    // Read file content safely
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    
    // Convert to base64 using built-in encoder to avoid stack overflow
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64Content = btoa(binary);
    
    // Determine mime type for Gemini
    let mimeType = file.type;
    if (!mimeType) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      switch (extension) {
        case 'pdf': mimeType = 'application/pdf'; break;
        case 'docx': mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'; break;
        case 'txt': mimeType = 'text/plain'; break;
        default: mimeType = 'application/octet-stream';
      }
    }

    // Upload file to Supabase Storage
    const fileName = `${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, bytes, {
        contentType: mimeType,
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(`File upload failed: ${uploadError.message}`);
    }

    console.log('File uploaded to storage:', uploadData);

    // Process with Gemini API
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: "Please analyze this document and provide:\n1. A comprehensive summary of the content\n2. Identify the author/owner or entity this document belongs to (if detectable)\n3. Extract key information like dates, names, organizations\n\nFormat your response as JSON with fields: summary, author, entity, keyInfo"
            },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Content
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 1,
          maxOutputTokens: 4096,
        }
      })
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${geminiResponse.status} - ${errorText}`);
    }

    const geminiData = await geminiResponse.json();
    console.log('Gemini response:', geminiData);

    let analysisResult;
    try {
      const responseText = geminiData.candidates[0].content.parts[0].text;
      // Try to parse JSON, fallback to structured text if not JSON
      if (responseText.includes('{') && responseText.includes('}')) {
        const jsonMatch = responseText.match(/\{.*\}/s);
        if (jsonMatch) {
          analysisResult = JSON.parse(jsonMatch[0]);
        }
      }
      
      if (!analysisResult) {
        analysisResult = {
          summary: responseText,
          author: "Not detected",
          entity: "Not detected",
          keyInfo: "See summary"
        };
      }
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      analysisResult = {
        summary: geminiData.candidates[0].content.parts[0].text,
        author: "Not detected",
        entity: "Not detected", 
        keyInfo: "See summary"
      };
    }

    // Save to database
    const { data: documentData, error: dbError } = await supabase
      .from('documents')
      .insert({
        filename: file.name,
        file_path: uploadData.path,
        mime_type: mimeType,
        file_size: file.size,
        summary: analysisResult.summary,
        extracted_text: `Author: ${analysisResult.author}\nEntity: ${analysisResult.entity}\nKey Info: ${analysisResult.keyInfo}`,
        status: 'processed',
        processed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error(`Database error: ${dbError.message}`);
    }

    console.log('Document saved to database:', documentData);

    return new Response(JSON.stringify({
      success: true,
      document: documentData,
      analysis: analysisResult
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in process-file-with-gemini function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});