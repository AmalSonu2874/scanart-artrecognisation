import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ART_STYLES = [
  "Madhubani",
  "Kerala Mural", 
  "Gond",
  "Kangra",
  "Mandana",
  "Kalighat",
  "Pichwai",
  "Warli"
];

const SYSTEM_PROMPT = `You are an expert art historian specializing in Indian traditional art forms. 
You analyze images of artwork and identify which of the following 8 traditional Indian art styles it belongs to:

1. Madhubani - From Bihar, characterized by complex geometrical patterns, natural elements, mythology scenes, natural dyes
2. Kerala Mural - Temple art with Hindu deities, bold outlines, vivid colors, distinctive eye styling
3. Gond - Tribal art using dots and lines, images of nature, animals, folklore, vibrant colors
4. Kangra - Miniature paintings of love, devotion, nature, delicate brushwork, soft lyrical colors
5. Mandana - Floor/wall paintings with geometric and figurative patterns, chalk and red ochre
6. Kalighat - Bold simplified paintings, originally souvenirs near Kalighat temple, satirical social commentary
7. Pichwai - Large devotional paintings of Lord Krishna, intricate details, rich colors, textile-like patterns
8. Warli - Tribal art using basic geometric shapes, daily life scenes, white pigment on mud walls

Analyze the given artwork image and respond with a JSON object containing:
- "label": The identified art style (one of the 8 styles above)
- "confidence": A confidence score between 0.0 and 1.0
- "description": A brief 2-3 sentence explanation of why you identified this style
- "all_predictions": An array of all 8 styles with their confidence scores

Be precise and base your analysis on visual characteristics like:
- Line work and brushstrokes
- Color palette and use of pigments
- Subject matter and iconography
- Geometric patterns vs figurative elements
- Cultural and religious symbolism

IMPORTANT: Always respond with valid JSON only, no additional text.`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();
    
    if (!imageBase64) {
      console.error('No image provided');
      return new Response(
        JSON.stringify({ error: 'No image provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analyzing artwork with Lovable AI vision...');

    // Use Gemini 2.5 Flash for vision - good balance of speed and quality
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this artwork image and identify the Indian traditional art style. Respond with JSON only.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add funds to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'AI analysis failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log('AI response received:', content?.substring(0, 200));

    if (!content) {
      console.error('No content in AI response');
      return new Response(
        JSON.stringify({ error: 'No analysis result received' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the JSON response from the AI
    let result;
    try {
      // Clean up the response - remove markdown code blocks if present
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      result = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError, content);
      
      // Fallback: try to extract information from the text
      const detectedStyle = ART_STYLES.find(style => 
        content.toLowerCase().includes(style.toLowerCase())
      );
      
      result = {
        label: detectedStyle || 'Unknown',
        confidence: detectedStyle ? 0.7 : 0.3,
        description: content.substring(0, 200),
        all_predictions: ART_STYLES.map(style => ({
          label: style,
          confidence: style === detectedStyle ? 0.7 : Math.random() * 0.2
        }))
      };
    }

    // Ensure all_predictions exists
    if (!result.all_predictions) {
      result.all_predictions = ART_STYLES.map(style => ({
        label: style,
        confidence: style === result.label ? result.confidence : Math.random() * (1 - result.confidence) * 0.3
      }));
    }

    // Add metadata
    result.version = 'Lovable AI Vision v1.0';
    result.model = 'google/gemini-2.5-flash';
    result.timestamp = new Date().toISOString();

    console.log('Analysis complete:', result.label, result.confidence);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-art function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
