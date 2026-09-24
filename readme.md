# Spotify Web Player 🎵✨

A modern, high-fidelity Spotify Web Player clone featuring automated music folder indexing, real-time Web Audio API soundwave visualization, interactive synchronized lyrics, and custom playlist management.

---

## 🚀 Key Features

### 🎧 Authentic Spotify Web Player UI/UX
- **Full-Width Persistent Player Bar**: Seamless bottom playback controls with scrubbable progress bar, time tooltips, and reactive green volume slider.
- **Floating Hover Physics**: Signature Spotify green play button gliding smoothly into view on card hover.
- **Dynamic Ambient Glow**: The top banner dynamically changes color tint to match the dominant artwork color of the currently playing song.
- **Interactive Library**: Create custom playlists, heart tracks to "Liked Songs" (persisted in `localStorage`), and filter by genre chips.
- **Synchronized Lyrics Drawer & Automatic Internet Fetcher**: Real-time karaoke-style highlighted lyrics that sync with song timestamps; automatically fetches synchronized LRC lyrics from the internet (via LRCLIB API) for any played or imported track with local caching and 1-click refetching. Click any lyric line to jump to that moment in the track.
- **Fullscreen Immersive View**: Album art backdrop with real-time audio visualizer waves.

---

### 📁 Automatic Music Folder Indexing
Never manually hardcode songs again!

1. **Option A: 1-Click Windows Indexer (`update_songs.bat`)**:
   - Simply drop any new folder containing your `.mp3` and `img.jpg` into the `Songs/` directory.
   - Double-click `update_songs.bat` (or run `powershell -File .\update_songs.ps1`).
   - It will automatically crawl the subdirectories, extract metadata, and update `songs.json`. Refresh the browser and your new song is immediately available!
2. **Option B: In-Browser Directory Import ("Import Folder")**:
   - Click the **"Import Folder"** button in the top navigation bar.
   - Select your local `Songs/` folder (or any folder on your machine).
   - The player automatically discovers all audio tracks & album covers and loads them directly into your current session!


---

### 🎹 Keyboard Shortcuts
| Shortcut | Action |
|---|---|
| `Space` | Play / Pause |
| `→` (Right Arrow) | Seek forward 5 seconds |
| `←` (Left Arrow) | Seek backward 5 seconds |
| `↑` (Up Arrow) | Volume +5% |
| `↓` (Down Arrow) | Volume -5% |
| `M` | Mute / Unmute |
| `L` | Like / Unlike current song |

---

## 🛠️ Tech Stack
- **HTML5**: Semantic markup, `<audio>` element, File System & Directory API (`webkitdirectory`).
- **Vanilla CSS3**: Design system tokens, Spotify dark mode theme, backdrop filters, flexbox/grid layout, custom range tracks, spring animations.
- **Vanilla JavaScript (ES6+)**: Audio state machine, Web Audio API `AudioContext` & `AnalyserNode`, canvas rendering, and LocalStorage persistence.
