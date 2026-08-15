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


// ======================================================
// CLEAN TITLE
// ======================================================

function createTitle(filename: string): string {
  return filename
    .replace(/\.[^/.]+$/, '')
    .replace(/^\s*\d+\s*[-_.]?\s*/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map(
      word =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(' ');
}


// ======================================================
// REMOVE NUMBER FROM FILENAME
// ======================================================

function cleanSongName(filename: string): string {
  return filename
    .replace(/\.[^/.]+$/, '')
    .replace(/^\s*\d+\s*[-_.]?\s*/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}


// ======================================================
// SAFE STORAGE FILENAME
// ======================================================

function createSafeFilename(filename: string): string {
  return filename
    .replace(/^\s*\d+\s*[-_.]?\s*/, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9._-]/g, '')
    .toLowerCase();
}


// ======================================================
// CONTENT TYPE
// ======================================================

function getContentType(extension: string): string {
  const types: Record<string, string> = {
    '.mp3': 'audio/mpeg',
    '.m4a': 'audio/mp4',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg',
    '.aac': 'audio/aac',
  };

  return types[extension] || 'audio/mpeg';
}


// ======================================================
// MAIN
// ======================================================

async function uploadSongs() {

  console.log('\n🎵 Jin Sangeet Smart Bulk Uploader');
  console.log('====================================\n');


  // ----------------------------------------------------
  // CHECK FOLDER
  // ----------------------------------------------------

  if (!fs.existsSync(SONGS_FOLDER)) {
    console.error(
      `❌ Songs folder not found: ${SONGS_FOLDER}`
    );

    process.exit(1);
  }


  // ----------------------------------------------------
  // GET SONG FILES
  // ----------------------------------------------------

  const files = fs
    .readdirSync(SONGS_FOLDER)
    .filter(file =>
      /\.(mp3|m4a|wav|ogg|aac)$/i.test(file)
    )
    .sort((a, b) =>
      a.localeCompare(b)
    );


  if (files.length === 0) {
    console.error(
      '❌ No audio files found.'
    );

    process.exit(1);
  }


  console.log(
    `📀 Found ${files.length} audio files.\n`
  );


  // ----------------------------------------------------
  // GET EXISTING DATABASE TRACKS
  // ----------------------------------------------------

  console.log(
    '🔍 Reading existing tracks...\n'
  );

  const {
    data: existingTracks,
    error: tracksError,
  } = await supabase
    .from('tracks')
    .select(
      'id, track_number, title, audio_url'
    )
    .order('track_number', {
      ascending: true,
    });


  if (tracksError) {
    console.error(
      '❌ Could not read tracks:',
      tracksError.message
    );

    process.exit(1);
  }


  // ----------------------------------------------------
  // EXISTING TRACK NUMBERS
  // ----------------------------------------------------

  const usedNumbers = new Set<number>();

  // Existing song names
  const existingSongNames = new Set<string>();


  for (const track of existingTracks || []) {

    usedNumbers.add(
      track.track_number
    );

    existingSongNames.add(
      track.title
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase()
    );
  }


  console.log(
    `📊 Existing tracks: ${usedNumbers.size}`
  );


  // ----------------------------------------------------
  // FIND NEXT NUMBER
  // ----------------------------------------------------

  let nextNumber = 1;

  while (
    usedNumbers.has(nextNumber)
  ) {
    nextNumber++;
  }


  console.log(
    `🔢 New songs will start from: ${nextNumber}\n`
  );


  // ----------------------------------------------------
  // COUNTERS
  // ----------------------------------------------------

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;


  // ====================================================
  // PROCESS EACH SONG
  // ====================================================

  for (
    let i = 0;
    i < files.length;
    i++
  ) {

    const filename = files[i];

    console.log(
      `[${i + 1}/${files.length}] ${filename}`
    );


    try {

      // ------------------------------------------------
      // CREATE TITLE
      // ------------------------------------------------

      const title =
        createTitle(filename);


      const cleanName =
        cleanSongName(filename);


      // ------------------------------------------------
      // DUPLICATE CHECK BY SONG NAME
      // ------------------------------------------------

      if (
        existingSongNames.has(cleanName)
      ) {

        console.log(
          `   ⏭️ Already exists: ${title}`
        );

        skipped++;

        continue;
      }


      // ------------------------------------------------
      // FIND NEXT AVAILABLE NUMBER
      // ------------------------------------------------

      while (
        usedNumbers.has(nextNumber)
      ) {
        nextNumber++;
      }


      const trackNumber =
        nextNumber;


      // ------------------------------------------------
      // LOCAL FILE
      // ------------------------------------------------

      const localFilePath =
        path.join(
          SONGS_FOLDER,
          filename
        );


      if (
        !fs.existsSync(
          localFilePath
        )
      ) {

        throw new Error(
          'Local file not found'
        );
      }


      // ------------------------------------------------
      // READ FILE
      // ------------------------------------------------

      const fileBuffer =
        fs.readFileSync(
          localFilePath
        );


      // ------------------------------------------------
      // STORAGE FILENAME
      // ------------------------------------------------

      const safeFilename =
        createSafeFilename(
          filename
        );


      const extension =
        path
          .extname(filename)
          .toLowerCase();


      const storagePath =
        `${String(trackNumber).padStart(
          3,
          '0'
        )}-${safeFilename}`;


      const contentType =
        getContentType(
          extension
        );


      // ------------------------------------------------
      // UPLOAD TO SUPABASE STORAGE
      // ------------------------------------------------

      console.log(
        `   ⬆️ Uploading as #${trackNumber}...`
      );


      const {
        error: uploadError,
      } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(
          storagePath,
          fileBuffer,
          {
            contentType,
            upsert: false,
          }
        );


      if (uploadError) {
        throw uploadError;
      }


      // ------------------------------------------------
      // GET PUBLIC URL
      // ------------------------------------------------

      const {
        data: publicUrlData,
      } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(
          storagePath
        );


      const audioUrl =
        publicUrlData.publicUrl;


      // ------------------------------------------------
      // CREATE DATABASE RECORD
      // ------------------------------------------------

      console.log(
        '   💾 Creating database record...'
      );


      const {
        error: insertError,
      } = await supabase
        .from('tracks')
        .insert({
          track_number:
            trackNumber,

          title:
            title,

          audio_url:
            audioUrl,

          duration:
            0,

          is_active:
            true,

          play_count:
            0,
        });


      // ------------------------------------------------
      // IF DB INSERT FAILS
      // ------------------------------------------------

      if (insertError) {

        // Remove uploaded MP3
        await supabase.storage
          .from(BUCKET_NAME)
          .remove([
            storagePath
          ]);

        throw insertError;
      }


      // ------------------------------------------------
      // SUCCESS
      // ------------------------------------------------

      usedNumbers.add(
        trackNumber
      );

      existingSongNames.add(
        cleanName
      );

      uploaded++;

      nextNumber++;


      console.log(
        `   ✅ #${trackNumber} ${title}`
      );

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


  // ====================================================
  // FINAL REPORT
  // ====================================================

  console.log(
    '\n===================================='
  );

  console.log(
    '🎵 Upload Complete'
  );

  console.log(
    '====================================\n'
  );

  console.log(
    `Total files : ${files.length}`
  );

  console.log(
    `Uploaded    : ${uploaded}`
  );

  console.log(
    `Skipped     : ${skipped}`
  );

  console.log(
    `Failed      : ${failed}`
  );

  console.log(
    '\n✨ Jin Sangeet import finished.\n'
  );
}


// ======================================================
// START
// ======================================================

uploadSongs();