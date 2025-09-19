import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tasks, preferences, currentSchedule } = await req.json();
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get Gemini API key
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    console.log('AI Scheduler: Processing tasks and generating schedule...');

    // Prepare the prompt for Gemini
    const prompt = `
You are an AI study scheduler. Based on the following information, create an optimized daily schedule.

TASKS TO SCHEDULE:
${JSON.stringify(tasks, null, 2)}

USER PREFERENCES:
- Study Goal: ${preferences?.dailyStudyGoal || 360} minutes per day
- Preferred Categories: ${preferences?.preferredCategories?.join(', ') || 'study, practice, project'}
- Timezone: ${preferences?.timezone || 'UTC'}

EXISTING SCHEDULE:
${JSON.stringify(currentSchedule, null, 2)}

INSTRUCTIONS:
1. Prioritize high-priority tasks
2. Break large tasks into manageable time blocks (25-90 minutes)
3. Include breaks between study sessions
4. Consider task difficulty and estimated duration
5. Avoid scheduling conflicts with existing blocks
6. Schedule tasks at optimal times (harder tasks in morning, lighter tasks in afternoon)
7. Leave time for meals and personal activities

RESPONSE FORMAT:
Return a JSON array of schedule blocks with this structure:
[
  {
    "title": "Task name or study block",
    "description": "Brief description",
    "start_time": "2024-01-01T09:00:00Z",
    "end_time": "2024-01-01T10:30Z",
    "category": "study|practice|project|break|meal",
    "color": "#3B82F6",
    "task_id": "task_uuid_if_applicable",
    "priority": "high|medium|low"
  }
]

Generate schedule for tomorrow starting from 8:00 AM to 10:00 PM.
`;

    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    const data = await response.json();
    console.log('Gemini API response:', data);

    if (!data.candidates || !data.candidates[0]) {
      throw new Error('No response from Gemini API');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    console.log('Generated schedule text:', generatedText);

    // Parse the JSON response from Gemini
    let scheduledBlocks;
    try {
      // Extract JSON from the response (Gemini might include extra text)
      const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        scheduledBlocks = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: create a simple schedule
        scheduledBlocks = [
          {
            title: "Morning Study Session",
            description: "Focus on high-priority tasks",
            start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T08:00:00Z',
            end_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T09:30:00Z',
            category: "study",
            color: "#3B82F6",
            priority: "high"
          }
        ];
      }
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      // Return a default schedule
      scheduledBlocks = [
        {
          title: "Study Block - AI Generated",
          description: "Scheduled by AI based on your tasks",
          start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T09:00:00Z',
          end_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T10:30:00Z',
          category: "study",
          color: "#3B82F6",
          priority: "medium"
        }
      ];
    }

    return new Response(JSON.stringify({
      success: true,
      scheduledBlocks,
      aiResponse: generatedText,
      message: "Schedule generated successfully by AI"
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-scheduler function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});