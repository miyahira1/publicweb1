# Kunkunshi (工工四) Format Guide

This file explains the kunkunshi notation system used in this repository and provides a step-by-step workflow for **AI agents and humans** to research songs, convert them to kunkunshi, and push them to the repo.

---

## What is Kunkunshi?

Kunkunshi (工工四) is the traditional tablature system for the **sanshin** (三線), the three-stringed lute of Okinawa. Instead of staff notation, it uses Chinese characters to indicate which string and fret to press. Each character encodes a physical position on the instrument, which produces a specific pitch.

Kunkunshi is traditionally written in vertical columns, read right-to-left. Modern printings often use horizontal rows (left-to-right). This repository supports both display modes.

---

## Character Table — Honchoshi Tuning (本調子)

Honchoshi is the standard tuning: strings tuned roughly to **F – B♭ – F** (a fourth apart). Exact pitch depends on the performer's preferred key.

| Char | Romaji  | String | Fret | Approx. Pitch | MIDI (F root) |
|------|---------|--------|------|----------------|---------------|
| 合   | Gō      | 1      | 0    | F              | 53            |
| 乙   | Otsu    | 1      | 2    | G              | 55            |
| 老   | Rō      | 1      | 4    | A♭             | 56            |
| 四   | Shi     | 2      | 0    | B♭             | 58            |
| 上   | Jō      | 2      | 2    | C              | 60            |
| 中   | Chū     | 2      | 4    | D              | 62            |
| 尺   | Shaku   | 3      | 0    | E♭             | 63            |
| 工   | Kō      | 3      | 2    | F′             | 65            |
| 五   | Go      | 3      | 4    | G′             | 67            |
| 六   | Roku    | 3      | 6    | A♭′            | 68            |
| 七   | Shichi  | 3      | 7    | B♭′            | 70            |
| 八   | Hachi   | 3      | 9    | C′′            | 72            |

**Notes:**
- The sanshin has only 12 pitches across about 1.5 octaves (F to C′′).
- Some characters have an upper-octave variant written with a small circle (°), e.g. 合° = F′′. These are rare and not currently in the JSON schema.
- The scale is **pentatonic** for most traditional songs (avoids 老 and 尺 in many pieces).

### Niagari (二揚げ) tuning

In niagari, the middle string is raised a whole step (B♭→C). Song files should set `"tuning": "niagari"` and note that 四 = C, 上 = D, 中 = E in that tuning.

---

## Song JSON Schema

Each song is one `.json` file in `tools/kunkunshi/songs/`. The filename must match the `id` field.

```jsonc
{
  "id": "song-id",               // URL-safe slug, matches filename (no .json)
  "title": "Song Title",         // Romanized or English display title
  "original_title": "原題",      // Native script title (optional)
  "artist": "Artist Name",
  "origin": "okinawan",          // "okinawan" | "japanese" | "western" | "other"
  "category": "folk",            // "folk" | "pop" | "classical" | "rock" | "other"
  "tags": ["tag1", "tag2"],      // Free-form lowercase tags
  "tuning": "honchoshi",         // "honchoshi" | "niagari" | "sansage"
  "difficulty": "beginner",      // "beginner" | "intermediate" | "advanced"
  "description": "One-sentence description of the song and arrangement.",
  "source": "Where the melody comes from (public domain, artist, etc.)",
  "added_by": "ai-agent",        // or your name
  "date_added": "YYYY-MM-DD",

  // Western songs only — documents how Western notes were mapped
  "conversion_notes": {
    "key": "Original key and transposition applied",
    "method": "Brief description of the mapping method",
    "mapping": { "C": "上", "D": "中", "E": "尺", "F": "工", "G": "五", "A": "六", "B": "七" }
  },

  "score": [
    {
      "section": "Verse",        // Section label shown above the phrase group
      "phrases": [
        {
          "cells": [
            {
              "char": "合",      // REQUIRED — kunkunshi character from the table above
              "lyric": "ティン", // OPTIONAL — syllable of lyrics to display below the char
              "duration": 1,     // REQUIRED — beat value: 0.5=eighth, 1=quarter, 2=half, 4=whole
              "rest": false      // OPTIONAL — true = rest (char is ignored in display)
            }
          ]
        }
      ]
    }
  ]
}
```

### Duration values

| Value | Name       | Description                  |
|-------|------------|------------------------------|
| 0.25  | Sixteenth  | Very fast passing note       |
| 0.5   | Eighth     | Short note                   |
| 1     | Quarter    | Standard beat                |
| 2     | Half       | Held note                    |
| 4     | Whole      | Long held note (end of line) |

---

## `_index.json` — Song Catalog

`songs/_index.json` is a flat array of lightweight metadata (no score data). It is loaded by the app to render the library. **Every song in the repo must have an entry here.**

```json
[
  {
    "id": "song-id",
    "title": "Song Title",
    "original_title": "原題",
    "artist": "Artist Name",
    "origin": "okinawan",
    "category": "folk",
    "difficulty": "beginner",
    "tags": ["traditional"]
  }
]
```

---

## Converting Western Songs to Kunkunshi

The sanshin can approximate Western melodies by mapping Western pitches to the nearest available kunkunshi character.

### Step-by-step conversion

1. **Identify the melody.** Obtain the note sequence of the melody (not chords). You can use sheet music, a lead sheet, or a MIDI file. You need: pitch name + duration for each note.

2. **Determine the key and range.** Write out the pitch names (C, D, E♭, F, G, A♭, B♭, C′…). The sanshin range in honchoshi is roughly **F to C′′** (about 1.5 octaves).

3. **Transpose to fit.** If the melody sits too high or too low, transpose it by an octave (or by a different interval) so that most notes land within F–C′′. The goal is to use the most notes from the character table.

4. **Map each pitch to a kunkunshi character** using the table below. When a pitch falls between two available characters, choose the nearest one and note the approximation in `description` or `conversion_notes`.

   | Western Pitch | Honchoshi Char | Note                        |
   |---------------|----------------|-----------------------------|
   | F             | 合 or 工       | 合 = lower octave, 工 = upper |
   | G             | 乙 or 五       | 乙 = lower, 五 = upper       |
   | A♭ / G♯       | 老 or 六       | 老 = lower, 六 = upper       |
   | B♭ / A♯       | 四 or 七       | 四 = lower, 七 = upper       |
   | C             | 上 or 八       | 上 = mid, 八 = upper         |
   | D             | 中             |                             |
   | E♭ / D♯       | 尺             |                             |
   | E natural     | 尺 (≈ E♭)      | Approximation — note it     |
   | A natural     | 六 (≈ A♭)      | Approximation — note it     |
   | B natural     | 七 (≈ B♭)      | Approximation — note it     |

5. **Handle unavailable pitches.** Notes like E♮, A♮, B♮, F♯, C♯ have no exact match. Options:
   - Use the nearest available character and document the approximation.
   - Skip passing tones entirely if they are brief and non-structural.
   - Raise or lower by a half-step to the nearest character.

6. **Simplify rhythm.** Sanshin music uses quarters, halves, eighths, and wholes. Compress complex syncopation to the nearest supported duration value. Ties can be approximated by extending the note's duration.

7. **Assign lyrics.** For each note, write the syllable of text that aligns with that note. Split multi-syllable words with a hyphen if needed (e.g. `"Moth-"`, `"er"`).

8. **Divide into sections and phrases.** A phrase is one line of the traditional score display — usually 4–8 beats. Sections follow the song structure (Verse, Chorus, Bridge, etc.).

---

## AI Agent Workflow — Adding a New Song

Follow these steps to research a song and push a new kunkunshi file:

```
1. RESEARCH the song's melody
   - Find the note sequence (sheet music, lead sheet, MIDI, or reliable transcription)
   - Record each note as: pitch name + duration in beats

2. TRANSPOSE the melody to fit honchoshi range (F to C'')
   - Count how many notes fall outside the range
   - Try different transpositions; pick the one with fewest out-of-range notes

3. MAP each pitch to a kunkunshi character
   - Use the pitch→char table above
   - For approximated notes, record what you approximated in conversion_notes

4. STRUCTURE the score
   - Group cells into phrases (lines of ~4-8 beats)
   - Group phrases into sections matching the song structure

5. CREATE the song file
   Path: tools/kunkunshi/songs/{song-id}.json
   - song-id must be URL-safe (lowercase, hyphens, no spaces)
   - Fill in all required fields per the schema above
   - Add conversion_notes if this is a Western song

6. UPDATE the catalog
   File: tools/kunkunshi/songs/_index.json
   - Append the song's lightweight metadata object to the array
   - Do NOT include the score data in _index.json

7. COMMIT and PUSH
   git add tools/kunkunshi/songs/{song-id}.json tools/kunkunshi/songs/_index.json
   git commit -m "Add kunkunshi: {Song Title}"
   git push
```

### Example mapping — "Let It Be" (C major → honchoshi)

The original melody is in C major. Transposed to honchoshi (root = F, so C major maps as C=上, D=中, E=尺≈Eb, F=工, G=五, A=六≈Ab, B=七≈Bb, C'=八):

| Lyric    | Note | Char | Duration |
|----------|------|------|----------|
| When     | G    | 五   | 1        |
| I        | G    | 五   | 0.5      |
| find     | A    | 六   | 0.5      |
| my       | G    | 五   | 1        |
| self     | E    | 尺   | 1        |
| in       | D    | 中   | 0.5      |
| times    | C    | 上   | 0.5      |

Approximations noted: E→尺 (Eb), A→六 (Ab), B→七 (Bb).

---

## Known Limitations

- **No sharps:** The sanshin has no F♯, C♯, G♯, D♯. These are approximated to the nearest available pitch.
- **Narrow range:** Only about 1.5 octaves (F to C′′). Wide-range melodies must be compressed.
- **No harmony:** Kunkunshi is melody-only. Chord accompaniment is implied by traditional patterns, not notated here.
- **Rhythm simplification:** Complex rhythms (triplets, dotted sixteenths, syncopation) are simplified to the supported duration values (0.25, 0.5, 1, 2, 4).
- **Pitch accuracy:** Western adaptations are approximations. The sanshin's Ryukyuan aesthetic gives the melody a different character than the original.
