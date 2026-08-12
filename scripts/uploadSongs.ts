import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY!;

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SECRET_KEY');
  process.exit(1);
}

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SECRET_KEY
);

const SONGS_FOLDER = path.join(process.cwd(), 'songs');
const BUCKET_NAME = 'songs';

function createTitle(filename: string): string {
  let title = filename
    .replace(/\.[^/.]+$/, '')
    .replace(/^\s*\d+\s*[-_.]?\s*/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return title
    .split(' ')
    .map(word => {
      if (!word) return word;

      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

function getTrackNumber(filename: string): number {
  const match = filename.match(/^\s*(\d+)/);

  return match ? parseInt(match[1], 10) : 999999;
}

async function uploadSongs() {
  console.log('\n🎵 Jin Sangeet Bulk Song Uploader');
  console.log('=================================\n');

  if (!fs.existsSync(SONGS_FOLDER)) {
    console.error(`❌ Songs folder not found: ${SONGS_FOLDER}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(SONGS_FOLDER)
    .filter(file => /\.(mp3|m4a|wav|ogg|aac)$/i.test(file))
    .sort((a, b) => {
      return getTrackNumber(a) - getTrackNumber(b);
    });

  if (files.length === 0) {
    console.error('❌ No audio files found in songs folder.');
    process.exit(1);
  }

  console.log(`📀 Found ${files.length} audio files.\n`);

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < files.length; i++) {
    const filename = files[i];

    const trackNumber = getTrackNumber(filename);
    const title = createTitle(filename);

    console.log(
      `[${i + 1}/${files.length}] ${filename}`
    );

    try {
      // Check if this track already exists
      const { data: existingTrack, error: checkError } =
        await supabase
          .from('tracks')
          .select('id, title, audio_url')
          .eq('track_number', trackNumber)
          .maybeSingle();

      if (checkError) {
        throw checkError;
      }

      if (existingTrack) {
        console.log(
          `   ⏭️  Already exists: ${existingTrack.title}`
        );

        skipped++;
        continue;
      }

      const localFilePath = path.join(
        SONGS_FOLDER,
        filename
      );

      const fileBuffer = fs.readFileSync(localFilePath);

      const safeFilename = filename
        .replace(/^\s*\d+\s*[-_.]?\s*/, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9._-]/g, '')
        .toLowerCase();

      const storagePath = `${String(trackNumber).padStart(
        3,
        '0'
      )}-${safeFilename}`;

      const extension = path
        .extname(filename)
        .toLowerCase();

      const contentTypes: Record<string, string> = {
        '.mp3': 'audio/mpeg',
        '.m4a': 'audio/mp4',
        '.wav': 'audio/wav',
        '.ogg': 'audio/ogg',
        '.aac': 'audio/aac',
      };

      const contentType =
        contentTypes[extension] || 'audio/mpeg';

      console.log('   ⬆️  Uploading audio...');

      const { error: uploadError } =
        await supabase.storage
          .from(BUCKET_NAME)
          .upload(storagePath, fileBuffer, {
            contentType,
            upsert: true,
          });

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: publicUrlData,
      } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(storagePath);

      const audioUrl = publicUrlData.publicUrl;

      console.log('   💾 Creating database record...');

      const { error: insertError } = await supabase
        .from('tracks')
        .insert({
          track_number: trackNumber,
          title,
          audio_url: audioUrl,
          duration: 0,
          is_active: true,
          play_count: 0,
        });

      if (insertError) {
        throw insertError;
      }

      uploaded++;

      console.log(`   ✅ ${title}`);
      console.log('');
    } catch (error: any) {
      failed++;

      console.error(
        `   ❌ Failed: ${filename}`
      );

      console.error(
        `   ${error?.message || error}`
      );

      console.log('');
    }
  }

  console.log('\n=================================');
  console.log('🎵 Upload Complete');
  console.log('=================================\n');

  console.log(`Total files : ${files.length}`);
  console.log(`Uploaded    : ${uploaded}`);
  console.log(`Skipped     : ${skipped}`);
  console.log(`Failed      : ${failed}`);

  console.log('\n✨ Jin Sangeet import finished.\n');
}

uploadSongs();