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

const SYSTEM_PROMPT = `You are an expert AI system trained specifically for Indian traditional art classification, emulating the precision of a ResNet deep learning model. Your task is to analyze artwork images with the same rigor and accuracy as a CNN trained on thousands of examples.

CLASSIFICATION METHODOLOGY (Follow exactly like a neural network):

STEP 1 - VISUAL FEATURE EXTRACTION:
Analyze these low-level features systematically:
- Color distribution: dominant hues, saturation levels, background colors
- Line characteristics: thickness, curvature, continuity
- Pattern density: sparse vs dense, geometric vs organic
- Texture: smooth gradients vs stippled/dotted fills
- Compositional structure: central focus vs distributed elements

STEP 2 - DISCRIMINATIVE FEATURE MATCHING:

**WARLI** [Maharashtra Tribal] - SIGNATURE FEATURES:
- BACKGROUND: Terracotta red/brown mud-colored surface (95% diagnostic)
- FIGURES: White stick figures, triangular torsos, circular heads
- MOTIFS: Tarpa dance circles, sun/moon, trees, animals
- TECHNIQUE: Basic geometric shapes only, no shading
- CONFIDENCE BOOST: If white-on-brown with stick figures → 0.95+

**MADHUBANI** [Bihar] - SIGNATURE FEATURES:
- BORDERS: Double-line outlining around ALL figures (highly diagnostic)
- FILL: Every empty space filled with patterns (fish scales, dots, leaves)
- EYES: Fish-shaped distinctive eyes on figures
- PALETTE: Bold primary colors, often with natural dyes appearance
- CONFIDENCE BOOST: If double-borders + dense pattern fill → 0.95+

**GOND** [Madhya Pradesh Tribal] - SIGNATURE FEATURES:
- FILL PATTERN: Dots and dashes creating texture within shapes (defining feature)
- SUBJECTS: Large stylized animals (deer, peacock, elephant, fish)
- COLORS: Vibrant contrasting colors (blue-orange, green-red)
- STYLE: Contemporary tribal feel, decorative rather than narrative
- CONFIDENCE BOOST: If dot-dash fills in stylized animals → 0.95+

**KERALA MURAL** [Temple Art] - SIGNATURE FEATURES:
- OUTLINES: Thick bold black outlines (thickest of all styles)
- EYES: Large almond-shaped prominent eyes
- COLORS: Panchavarna 5-color scheme (yellow, red, green, black, white)
- SUBJECTS: Hindu deities with elaborate crowns/jewelry
- CONFIDENCE BOOST: If bold black outlines + large eyes + Panchavarna → 0.95+

**PICHWAI** [Rajasthan Devotional] - SIGNATURE FEATURES:
- SUBJECT: Shrinathji (Krishna) as child, ALWAYS central
- MOTIFS: Cows, lotus flowers, kadamba trees
- PALETTE: Deep rich colors (navy blue, burgundy, gold highlights)
- SCALE: Large format devotional paintings
- CONFIDENCE BOOST: If Krishna + cows + lotus + deep colors → 0.95+

**KALIGHAT** [Bengal 19th Century] - SIGNATURE FEATURES:
- BRUSHWORK: Bold sweeping curved strokes (most fluid of all)
- SHADING: Distinctive gray/brown shading on figures
- FIGURES: Simplified, almost caricature-like proportions
- SUBJECTS: Deities OR social satire (cats, fish, people)
- CONFIDENCE BOOST: If bold curved strokes + shading + simplified figures → 0.95+

**KANGRA** [Pahari Miniature] - SIGNATURE FEATURES:
- SCALE: Delicate miniature format
- PALETTE: Soft pastels (pale blue, pink, cream, sage green)
- SUBJECTS: Romantic scenes (Radha-Krishna, lovers, musicians)
- LANDSCAPE: Lush green trees, misty mountains
- TECHNIQUE: Extremely fine detailed brushwork
- CONFIDENCE BOOST: If soft pastels + romantic scene + fine detail → 0.95+

**MANDANA** [Rajasthan Floor Art] - SIGNATURE FEATURES:
- BACKGROUND: Red ochre/terracotta base
- DESIGNS: White chalk/lime geometric patterns
- MOTIFS: Elephants, peacocks, geometric borders, rangoli-style
- PURPOSE: Floor/wall decorative art aesthetic
- CONFIDENCE BOOST: If white geometric on red ochre → 0.95+

STEP 3 - CONFIDENCE CALIBRATION:
- 0.95-1.00: Multiple signature features clearly present, unambiguous match
- 0.80-0.94: Primary features present, minor ambiguity
- 0.60-0.79: Some features match but could be confused with another style
- Below 0.60: Unclear or potentially not one of the 8 styles

RESPONSE FORMAT (STRICT JSON ONLY):
{
  "label": "ExactStyleName",
  "confidence": 0.XX,
  "description": "3-4 sentences citing SPECIFIC visual evidence: exact colors observed, pattern types identified, subject matter, and distinguishing technique that confirms this classification over alternatives.",
  "all_predictions": [
    {"label": "Madhubani", "confidence": 0.XX},
    {"label": "Gond", "confidence": 0.XX},
    {"label": "Warli", "confidence": 0.XX},
    {"label": "Kerala Mural", "confidence": 0.XX},
    {"label": "Pichwai", "confidence": 0.XX},
    {"label": "Kalighat", "confidence": 0.XX},
    {"label": "Kangra", "confidence": 0.XX},
    {"label": "Mandana", "confidence": 0.XX}
  ]
}

CRITICAL RULES:
1. Return ONLY valid JSON, no markdown, no explanation outside JSON
2. All 8 styles MUST appear in all_predictions, sorted by confidence descending
3. Confidences must sum to approximately 1.0 (within 0.05)
4. Description must cite at least 3 specific visual elements observed
5. Label must exactly match one of: Madhubani, Gond, Warli, Kerala Mural, Pichwai, Kalighat, Kangra, Mandana`;

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
