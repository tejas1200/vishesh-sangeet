import { supabase } from '../lib/supabase';
import { Track } from '../types';

export async function getTracks(): Promise<Track[]> {
  const { data, error } = await supabase
    .from('tracks')
    .select('*')
    .eq('is_active', true)
    .order('track_number', {
      ascending: true,
    });

  if (error) {
    console.error(
      'Supabase tracks error:',
      error
    );

    throw error;
  }

  console.log(
    'Tracks loaded from Supabase:',
    data
  );

  return (data ?? []).map((track) => ({
    id: track.id,

    // IMPORTANT:
    // Keep the real Supabase song number
    track_number: track.track_number,

    title: track.title,

    titleDevanagari: '',

    subtitle: 'Jin Sangeet',

    metadata: 'Jain Spiritual Music',

    duration: track.duration || 0,

    audioUrl: track.audio_url,

    coverUrl: '',

    description: '',
  }));
}