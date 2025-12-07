import { supabase } from "@/integrations/supabase/client";

export interface ArtPrediction {
  label: string;
  confidence: number;
  description?: string;
  all_predictions?: { label: string; confidence: number }[];
  version?: string;
  model?: string;
  timestamp?: string;
}

export async function analyzeArtwork(imageBase64: string): Promise<ArtPrediction> {
  const { data, error } = await supabase.functions.invoke('analyze-art', {
    body: { imageBase64 }
  });

  if (error) {
    console.error('Art analysis error:', error);
    throw new Error(error.message || 'Failed to analyze artwork');
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data as ArtPrediction;
}
