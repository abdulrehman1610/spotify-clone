#!/usr/bin/env python3
"""
Spotify Clone - Cover Art Extractor (gen_Art.py)
------------------------------------------------
Automatically scans the 'Songs/' directory, organizes any loose MP3s,
extracts embedded album covers (ID3 APIC tags) from music files,
and saves them as 'img.jpg' in each song's folder.

Works 100% out-of-the-box with standard Python (no pip packages required).
Also supports 'mutagen' if installed.
"""

import os
import sys
import re
import shutil
import subprocess

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SONGS_DIR = os.path.join(SCRIPT_DIR, "Songs")


def organize_loose_files():
    """
    Checks for any loose audio files sitting in the Songs/ root directory,
    creates a folder using the Song Name only, and moves the audio file inside.
    """
    if not os.path.exists(SONGS_DIR):
        print(f"[!] Error: Songs folder not found at {SONGS_DIR}")
        return

    loose_files = [
        f for f in os.listdir(SONGS_DIR)
        if os.path.isfile(os.path.join(SONGS_DIR, f)) and f.lower().endswith(('.mp3', '.wav', '.ogg', '.m4a', '.flac'))
    ]

    if not loose_files:
        return

    print(f"\n[*] Found {len(loose_files)} loose audio file(s) in Songs/ directory. Organizing into folders...")
    for filename in loose_files:
        src = os.path.join(SONGS_DIR, filename)
        base = os.path.splitext(filename)[0]

        # Extract Song Name from 'Artist - Song Name'
        if " - " in base:
            parts = base.split(" - ", 1)
            raw_title = parts[1].strip()
        else:
            raw_title = base.strip()

        # Clean noise qualifiers
        folder_name = raw_title
        if folder_name.startswith("All The Stars"):
            folder_name = "All The Stars"
        elif folder_name.startswith("BIBA SADA"):
            folder_name = "BIBA SADA"
        elif folder_name.startswith("After Dark x Sweater Weather"):
            folder_name = "After Dark x Sweater Weather"

        dest_dir = os.path.join(SONGS_DIR, folder_name)
        os.makedirs(dest_dir, exist_ok=True)
        dest_file = os.path.join(dest_dir, filename)

        try:
            shutil.move(src, dest_file)
            print(f"  [+] Created '{folder_name}/' and moved '{filename}'")
        except Exception as e:
            print(f"  [!] Failed to move '{filename}': {e}")


def extract_cover_native(audio_path, out_img_path):
    """
    Pure Python ID3v2 APIC frame reader.
    Extracts embedded JPEG or PNG cover art without any external dependencies.
    """
    try:
        with open(audio_path, "rb") as f:
            header = f.read(10)
            if len(header) < 10 or header[:3] != b"ID3":
                return False

            version = header[3]
            # Syncsafe integer for ID3v2 tag size
            tag_size = ((header[6] & 0x7F) << 21) | ((header[7] & 0x7F) << 14) | ((header[8] & 0x7F) << 7) | (header[9] & 0x7F)
            tag_data = f.read(tag_size)

        # 1. Look for APIC frame
        apic_idx = tag_data.find(b"APIC")
        if apic_idx != -1:
            if version == 4:
                frame_size = ((tag_data[apic_idx + 4] & 0x7F) << 21) | ((tag_data[apic_idx + 5] & 0x7F) << 14) | ((tag_data[apic_idx + 6] & 0x7F) << 7) | (tag_data[apic_idx + 7] & 0x7F)
            else:
                frame_size = int.from_bytes(tag_data[apic_idx + 4 : apic_idx + 8], byteorder="big")

            frame_start = apic_idx + 10
            frame_end = min(frame_start + frame_size, len(tag_data))
            frame_bytes = tag_data[frame_start:frame_end]

            # Check JPEG
            jpg_idx = frame_bytes.find(b"\xff\xd8\xff")
            if jpg_idx != -1:
                with open(out_img_path, "wb") as out_f:
                    out_f.write(frame_bytes[jpg_idx:])
                return True

            # Check PNG
            png_idx = frame_bytes.find(b"\x89PNG\r\n\x1a\n")
            if png_idx != -1:
                with open(out_img_path, "wb") as out_f:
                    out_f.write(frame_bytes[png_idx:])
                return True

        # 2. Fallback: Search anywhere within tag_data for JPEG
        jpg_idx = tag_data.find(b"\xff\xd8\xff")
        if jpg_idx != -1:
            end_idx = tag_data.rfind(b"\xff\xd9", jpg_idx)
            if end_idx != -1:
                with open(out_img_path, "wb") as out_f:
                    out_f.write(tag_data[jpg_idx : end_idx + 2])
                return True

        # Check PNG anywhere
        png_idx = tag_data.find(b"\x89PNG\r\n\x1a\n")
        if png_idx != -1:
            iend_idx = tag_data.find(b"IEND", png_idx)
            if iend_idx != -1:
                with open(out_img_path, "wb") as out_f:
                    out_f.write(tag_data[png_idx : iend_idx + 8])
                return True

    except Exception as e:
        print(f"    [!] Native extraction error: {e}")

    return False


def extract_cover_mutagen(audio_path, out_img_path):
    """Fallback using mutagen if installed."""
    try:
        from mutagen.mp3 import MP3
        from mutagen.id3 import ID3, APIC

        audio = MP3(audio_path, ID3=ID3)
        for tag in audio.tags.values():
            if isinstance(tag, APIC):
                with open(out_img_path, "wb") as f:
                    f.write(tag.data)
                return True
    except Exception:
        pass
    return False


def main():
    force_all = "--force" in sys.argv

    print("=" * 60)
    print("   Spotify Clone - Album Cover Extractor (gen_Art.py)    ")
    print("=" * 60)

    if not os.path.exists(SONGS_DIR):
        print(f"[!] Error: Songs folder not found at '{SONGS_DIR}'")
        return

    # 1. Organize any loose MP3s into song folders first
    organize_loose_files()

    # 2. Iterate through song folders
    subdirs = sorted([d for d in os.listdir(SONGS_DIR) if os.path.isdir(os.path.join(SONGS_DIR, d))])
    print(f"\n[*] Scanning {len(subdirs)} song folder(s) in Songs/...\n")

    extracted_count = 0
    skipped_count = 0
    missing_count = 0

    for folder_name in subdirs:
        folder_path = os.path.join(SONGS_DIR, folder_name)
        img_path = os.path.join(folder_path, "img.jpg")

        if os.path.exists(img_path) and not force_all:
            size_kb = round(os.path.getsize(img_path) / 1024)
            print(f"  [=] '{folder_name}': Cover already exists ({size_kb} KB)")
            skipped_count += 1
            continue

        # Find audio file
        audio_files = [
            f for f in os.listdir(folder_path)
            if f.lower().endswith(('.mp3', '.wav', '.ogg', '.m4a', '.flac'))
        ]

        if not audio_files:
            print(f"  [-] '{folder_name}': No audio file found in folder.")
            missing_count += 1
            continue

        audio_path = os.path.join(folder_path, audio_files[0])

        # Try native extraction first, then mutagen
        success = extract_cover_native(audio_path, img_path)
        if not success:
            success = extract_cover_mutagen(audio_path, img_path)

        if success and os.path.exists(img_path):
            size_kb = round(os.path.getsize(img_path) / 1024)
            print(f"  [+] '{folder_name}': Extracted cover -> img.jpg ({size_kb} KB)")
            extracted_count += 1
        else:
            print(f"  [!] '{folder_name}': No embedded album art found in audio tag.")
            missing_count += 1

    print("\n" + "=" * 60)
    print(f" Extraction Summary:")
    print(f"   -> Covers Extracted: {extracted_count}")
    print(f"   -> Already Present:  {skipped_count}")
    print(f"   -> No Art Found:     {missing_count}")
    print("=" * 60)

    # 3. Automatically trigger update_songs.bat / update_songs.ps1 if present
    ps1_script = os.path.join(SCRIPT_DIR, "update_songs.ps1")
    if os.path.exists(ps1_script) and (extracted_count > 0 or force_all):
        print("\n[*] Updating songs.json manifest with new covers...")
        try:
            subprocess.run(
                ["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", ps1_script],
                check=False
            )
        except Exception as e:
            print(f"[!] Could not run update_songs.ps1: {e}")

    print("\n[✓] Done! Refresh your browser to view your updated tracks and artwork.\n")


if __name__ == "__main__":
    main()
