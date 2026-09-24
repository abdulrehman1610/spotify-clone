/**
 * Spotify Clone - Master Audio Engine & UI Controller
 * Featuring: Dynamic Auto-Loading, Web Audio Visualizer, & Local Folder Import
 */

// ==========================================================================
// 1. DEFAULT FALLBACK LIBRARY (Guarantees 100% offline & file:// support)
// ==========================================================================
const DEFAULT_SONGS = [
  {
    id: "pal-pal",
    title: "Pal Pal",
    artist: "Afusic, AliSoomroMusic",
    album: "Pal Pal Single",
    src: "Songs/Pal Pal/Afusic - Pal Pal (Official Music Video) Prod. AliSoomroMusic - AFUSIC.mp3",
    cover: "Songs/Pal Pal/img.jpg",
    duration: "3:25",
    vibe: "Romantic Chill Melodic",
    tags: ["chill", "romantic", "urdu", "acoustic", "lofi"],
    color: "#7c2d12",
    lyrics: [
      { time: 0, text: "♪ Intro Music ♪" },
      { time: 12, text: "Pal pal dil ke paas tum rehti ho" },
      { time: 24, text: "Jeevan meethi pyaas yeh kehti ho" },
      { time: 36, text: "Har shaam aankhon par tera aanchal lehraye" },
      { time: 48, text: "Har raat yaadon ki baraat le aaye" },
      { time: 65, text: "Main saans leta hoon teri khushboo aati hai" },
      { time: 80, text: "Ek mehka mehka sa paighaam laati hai" },
      { time: 95, text: "Pal pal dil ke paas tum rehti ho" }
    ]
  },
  {
    id: "on-my-own",
    title: "On My Own",
    artist: "Darci",
    album: "On My Own Single",
    src: "Songs/On My Own/utomp3.com -  Darci  On My Own Lyrics.mp3",
    cover: "Songs/On My Own/img.jpg",
    duration: "2:40",
    vibe: "Late Night Dark Atmospheric Trap",
    tags: ["late-night", "trap", "dark", "focus", "moody", "chill"],
    color: "#1e1b4b",
    lyrics: [
      { time: 0, text: "♪ Heavy Synth Intro ♪" },
      { time: 10, text: "Yeah, running out of time again" },
      { time: 20, text: "Moving fast through the neon lights" },
      { time: 32, text: "Doing all of this on my own" },
      { time: 44, text: "Never needed nobody to hold me down" },
      { time: 60, text: "Cruising through the city when the clock strikes two" },
      { time: 75, text: "All I ever needed was the quiet and the groove" },
      { time: 90, text: "Yeah, on my own, on my own..." }
    ]
  },
  {
    id: "criminal",
    title: "Criminal",
    artist: "Britney Spears",
    album: "Femme Fatale",
    src: "Songs/Criminal/Britney Spears - Criminal (Lyrics).mp3",
    cover: "Songs/Criminal/img.jpg",
    duration: "3:45",
    vibe: "Pop Nostalgic Acoustic Melodic",
    tags: ["pop", "nostalgia", "throwback", "energetic", "guitar"],
    color: "#831843",
    lyrics: [
      { time: 0, text: "♪ Acoustic Flute & Guitar ♪" },
      { time: 16, text: "He is a bad boy with a tainted heart" },
      { time: 22, text: "And even I know this ain't smart" },
      { time: 28, text: "But mama I'm in love with a criminal" },
      { time: 34, text: "And this type of love isn't rational, it's physical" },
      { time: 46, text: "Mama please don't cry, I will be alright" },
      { time: 56, text: "All reason aside I just can't deny, love that guy" }
    ]
  },
  {
    id: "wishes",
    title: "Wishes",
    artist: "Hasan Raheem, Talwiinder (Prod. Umair)",
    album: "Wishes",
    src: "Songs/Wishes/Hasan Raheem - Wishes ft Talwiinder  Prod by Umair (Official Lyric Video) - Hasan Raheem.mp3",
    cover: "Songs/Wishes/img.jpg",
    duration: "3:30",
    vibe: "Indie Synth Pop Melancholic Vibe",
    tags: ["indie", "synthpop", "chill", "vibes", "desi-indie", "punjabi"],
    color: "#14532d",
    lyrics: [
      { time: 0, text: "♪ Dreamy Synth Prelude ♪" },
      { time: 14, text: "Wishes in the wind tonight" },
      { time: 26, text: "Kyun tu door hai mere khwabon se?" },
      { time: 38, text: "Baatein adhuri si reh gayi hain" },
      { time: 52, text: "Raaste badal gaye par yaad teri aati hai" },
      { time: 68, text: "Teri har ek ada, dil ko chu ke jaati hai" },
      { time: 85, text: "Soch mein gum, subah se shaam tak" }
    ]
  },
  {
    id: "way-down-we-go",
    title: "Way Down We Go",
    artist: "KALEO",
    album: "A/B",
    src: "Songs/Way Down We Go/KALEO - Way Down We Go (Official Music Video).mp3",
    cover: "Songs/Way Down We Go/img.jpg",
    duration: "3:39",
    vibe: "Blues Rock Dark Cinematic Intense",
    tags: ["rock", "blues", "cinematic", "epic", "focus"],
    color: "#1c1917",
    lyrics: [
      { time: 0, text: "♪ Deep Bass and Drum Rhythms ♪" },
      { time: 18, text: "Oh, father tell me, do we get what we deserve?" },
      { time: 30, "text": "Oh, we get what we deserve" },
      { time: 42, text: "And way down we go-o-o-o-o" },
      { time: 54, text: "Way down we go-o-o-o-o" },
      { time: 66, text: "Say way down we go" },
      { time: 78, text: "'Cause they will run you down by the fallen shoulders" }
    ]
  },
  {
    id: "gallan-4",
    title: "Gallan 4",
    artist: "Talwiinder",
    album: "Gallan 4 Single",
    src: "Songs/Gallan 4/Talwiinder - GALLAN 4 (Lyrical Video).mp3",
    cover: "Songs/Gallan 4/img.jpg",
    duration: "2:34",
    vibe: "Punjabi Chill Hip-Hop Melodic",
    tags: ["punjabi", "chill", "hiphop", "nightdrive", "flow"],
    color: "#3b0764",
    lyrics: [
      { time: 0, text: "♪ Lo-Fi Punjabi Beats ♪" },
      { time: 10, text: "Gallan chaar teriyan mere naal" },
      { time: 22, text: "Soniye ni dass tera ki ae haal" },
      { time: 34, text: "Raatan nu taare gin gin katan din" },
      { time: 46, text: "Dil nu chain na aave tere bin" },
      { time: 60, text: "Gallan chaar teriyan mere naal..." }
    ]
  }
];

// ==========================================================================
// 2. APPLICATION STATE
// ==========================================================================
class SpotifyApp {
  constructor() {
    this.songs = [...DEFAULT_SONGS];
    this.currentIndex = 0;
    this.isPlaying = false;
    this.isShuffle = false;
    this.repeatMode = 0; // 0: off, 1: all, 2: one
    this.currentCategory = 'all';
    this.currentView = 'home'; // 'home', 'search', 'playlist'
    this.activePlaylistId = null;
    
    // Playlists & Liked Songs from localStorage
    this.likedSongIds = JSON.parse(localStorage.getItem('spotify_liked_songs') || '[]');
    this.customPlaylists = JSON.parse(localStorage.getItem('spotify_custom_playlists') || '[]');

    // Audio Elements
    this.audio = document.getElementById('audio-player');
    this.audio.preload = 'auto'; // Eagerly buffer audio data for fast playback
    this.progressBar = document.getElementById('progress-bar');
    this.progressFill = document.getElementById('progress-fill');
    this.currentTimeEl = document.getElementById('current-time');
    this.durationTimeEl = document.getElementById('duration-time');
    this.volumeSlider = document.getElementById('volume-slider');
    this.volumeFill = document.getElementById('volume-fill');
    this.volumeHighIcon = document.getElementById('volume-high-icon');
    this.volumeMutedIcon = document.getElementById('volume-muted-icon');
    this.previousVolume = 0.8;

    // Player Elements
    this.playerCover = document.getElementById('player-cover-img');
    this.playerTitle = document.getElementById('player-title');
    this.playerArtist = document.getElementById('player-artist');
    this.playerHeartBtn = document.getElementById('player-heart-btn');
    this.playBtn = document.getElementById('play-btn');
    this.playIcon = document.getElementById('play-icon');
    this.pauseIcon = document.getElementById('pause-icon');
    this.prevBtn = document.getElementById('prev-btn');
    this.nextBtn = document.getElementById('next-btn');
    this.shuffleBtn = document.getElementById('shuffle-btn');
    this.repeatBtn = document.getElementById('repeat-btn');

    // Drawers
    this.rightDrawer = document.getElementById('right-drawer');
    this.drawerTitle = document.getElementById('drawer-title');
    this.panelLyrics = document.getElementById('panel-lyrics');
    this.panelQueue = document.getElementById('panel-queue');
    this.activeDrawerPanel = null;

    // Web Audio Visualizer
    this.audioCtx = null;
    this.analyser = null;
    this.visualizerCanvas = document.getElementById('drawer-visualizer');
    this.fullscreenVisualizerCanvas = document.getElementById('fullscreen-visualizer');
    this.isVisualizerInit = false;

    // Next-track preloader for instant transitions
    this.nextTrackPreloader = null;

    this.init();
  }

  async init() {
    this.updateGreeting();
    this.setupEventListeners();
    await this.fetchSongsManifest();
    this.renderAll();
    this.loadSong(0, false);
    this.setupKeyboardShortcuts();
  }

  // Automatically fetch songs.json if available
  async fetchSongsManifest() {
    try {
      const res = await fetch('songs.json');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          this.songs = data;
          console.log(`[Spotify] Loaded ${data.length} tracks automatically from songs.json`);
        }
      }
    } catch (e) {
      console.log('[Spotify] Using built-in songs catalog (local/file protocol)');
    }
  }

  // ==========================================================================
  // 3. UI RENDERING
  // ==========================================================================
  renderAll() {
    this.renderQuickPicks();
    this.renderShelves();
    this.renderTracksTable();
    this.renderCustomPlaylists();
    this.updateLikedBadge();
    const countEl = document.getElementById('total-songs-count');
    if (countEl) countEl.textContent = `${this.songs.length} songs`;
  }

  updateGreeting() {
    const greetingEl = document.getElementById('greeting-text');
    if (!greetingEl) return;
    const hour = new Date().getHours();
    if (hour < 12) greetingEl.textContent = 'Good morning';
    else if (hour < 18) greetingEl.textContent = 'Good afternoon';
    else greetingEl.textContent = 'Good evening';
  }

  renderQuickPicks() {
    const grid = document.getElementById('quick-picks-grid');
    if (!grid) return;
    grid.innerHTML = '';

    // Show up to 6 quick picks
    const displaySongs = this.songs.slice(0, 6);
    displaySongs.forEach((song, idx) => {
      const card = document.createElement('div');
      card.className = 'quick-pick-card';
      card.innerHTML = `
        <img src="${encodeURI(song.cover)}" alt="${song.title}" />
        <span class="quick-pick-title">${song.title}</span>
        <button class="quick-pick-play-btn" title="Play">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="#000000">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>
      `;
      card.addEventListener('click', () => {
        const songIdx = this.songs.findIndex(s => s.id === song.id);
        this.loadSong(songIdx >= 0 ? songIdx : idx, true);
      });
      grid.appendChild(card);
    });
  }

  renderShelves() {
    const trendingContainer = document.getElementById('trending-cards-carousel');
    const recommendedContainer = document.getElementById('recommended-cards-carousel');

    if (trendingContainer) {
      trendingContainer.innerHTML = '';
      this.songs.forEach((song, idx) => {
        trendingContainer.appendChild(this.createSongCard(song, idx));
      });
    }

    if (recommendedContainer) {
      recommendedContainer.innerHTML = '';
      // Reverse order for variety
      const rec = [...this.songs].reverse();
      rec.forEach((song) => {
        const realIdx = this.songs.findIndex(s => s.id === song.id);
        recommendedContainer.appendChild(this.createSongCard(song, realIdx));
      });
    }
  }

  createSongCard(song, songIdx) {
    const card = document.createElement('div');
    card.className = `song-card ${songIdx === this.currentIndex ? 'playing' : ''}`;
    card.dataset.songIndex = songIdx;
    card.innerHTML = `
      <div class="card-cover-wrap">
        <img src="${encodeURI(song.cover)}" alt="${song.title}" loading="lazy" />
        <button class="floating-play-btn" title="Play">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="#000000">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>
      </div>
      <div class="song-card-title">${song.title}</div>
      <div class="song-card-artist">${song.artist}</div>
    `;

    card.addEventListener('click', () => {
      this.loadSong(songIdx, true);
    });
    return card;
  }

  renderTracksTable() {
    const tbody = document.getElementById('tracks-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    const filtered = this.getFilteredSongs();

    filtered.forEach((song, i) => {
      const realIndex = this.songs.findIndex(s => s.id === song.id);
      const isLiked = this.likedSongIds.includes(song.id);
      const isCurrent = realIndex === this.currentIndex;

      const row = document.createElement('div');
      row.className = `table-row ${isCurrent ? 'playing' : ''}`;
      row.innerHTML = `
        <span class="col-num">
          <span class="row-index-num">${i + 1}</span>
          <span class="row-play-icon">▶</span>
        </span>
        <div class="col-title">
          <img src="${encodeURI(song.cover)}" alt="${song.title}" />
          <div class="col-title-meta">
            <span class="col-title-name">${song.title}</span>
            <span class="col-title-artist">${song.artist}</span>
          </div>
        </div>
        <span class="col-album desktop-only">${song.album || song.title}</span>
        <span class="col-vibe desktop-only">
          <span class="vibe-tag-badge">${(song.tags && song.tags[0]) || song.vibe || 'music'}</span>
        </span>
        <span class="col-like">
          <button class="track-heart-btn ${isLiked ? 'liked' : ''}" data-song-id="${song.id}">
            ♥
          </button>
        </span>
        <span class="col-dur">${song.duration || '3:30'}</span>
      `;

      // Row click to play
      row.addEventListener('click', (e) => {
        if (e.target.closest('.track-heart-btn')) return;
        this.loadSong(realIndex, true);
      });

      // Heart like click
      const heartBtn = row.querySelector('.track-heart-btn');
      if (heartBtn) {
        heartBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleLike(song.id);
        });
      }

      tbody.appendChild(row);
    });
  }

  getFilteredSongs() {
    if (this.currentCategory === 'all') return this.songs;
    return this.songs.filter(s => {
      const matchCat = (s.tags || []).concat([s.vibe, s.title, s.artist]).join(' ').toLowerCase();
      if (this.currentCategory === 'chill') return matchCat.includes('chill') || matchCat.includes('lofi');
      if (this.currentCategory === 'pop') return matchCat.includes('pop') || matchCat.includes('hits');
      if (this.currentCategory === 'rock') return matchCat.includes('rock') || matchCat.includes('blues');
      if (this.currentCategory === 'punjabi') return matchCat.includes('punjabi') || matchCat.includes('desi') || matchCat.includes('urdu');
      return true;
    });
  }

  renderCustomPlaylists() {
    const container = document.getElementById('custom-playlists-container');
    if (!container) return;
    container.innerHTML = '';

    this.customPlaylists.forEach(pl => {
      const item = document.createElement('div');
      item.className = `library-item ${this.activePlaylistId === pl.id ? 'active' : ''}`;
      item.innerHTML = `
        <div class="playlist-cover-mini">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/>
          </svg>
        </div>
        <div class="item-meta">
          <span class="item-title">${pl.name}</span>
          <span class="item-sub">Playlist • ${pl.songIds ? pl.songIds.length : 0} songs</span>
        </div>
      `;
      item.addEventListener('click', () => {
        this.openPlaylistView(pl.id);
      });
      container.appendChild(item);
    });
  }

  updateLikedBadge() {
    const badge = document.getElementById('liked-count-badge');
    if (badge) {
      badge.textContent = `Playlist • ${this.likedSongIds.length} songs`;
    }
  }

  // ==========================================================================
  // 4. AUDIO CONTROLLER & PLAYBACK ENGINE
  // ==========================================================================
  loadSong(index, autoPlay = false) {
    if (index < 0 || index >= this.songs.length) return;
    this.currentIndex = index;
    const song = this.songs[index];

    // Encode the URI to handle spaces, parentheses, commas, quotes in paths
    const encodedSrc = encodeURI(song.src);
    const encodedCover = encodeURI(song.cover);

    // Setting .src automatically begins fetching — do NOT call .load() after
    this.audio.src = encodedSrc;
    this.playerCover.src = encodedCover;
    this.playerTitle.textContent = song.title;
    this.playerArtist.textContent = song.artist;

    // Show buffering state on play button
    if (autoPlay) {
      this.playBtn.classList.add('buffering');
      const onCanPlay = () => {
        this.playBtn.classList.remove('buffering');
        this.audio.removeEventListener('canplay', onCanPlay);
      };
      this.audio.addEventListener('canplay', onCanPlay);
    }

    // Fullscreen elements
    const fsCover = document.getElementById('fullscreen-cover-img');
    const fsTitle = document.getElementById('fullscreen-title');
    const fsArtist = document.getElementById('fullscreen-artist');
    if (fsCover) fsCover.src = encodedCover;
    if (fsTitle) fsTitle.textContent = song.title;
    if (fsArtist) fsArtist.textContent = song.artist;

    // Adapt hero color
    const heroBackdrop = document.getElementById('hero-backdrop');
    if (heroBackdrop) {
      heroBackdrop.style.setProperty('--hero-color', song.color || '#7c2d12');
      heroBackdrop.style.background = `linear-gradient(180deg, ${song.color || '#7c2d12'} 0%, rgba(18, 18, 18, 0.8) 70%, var(--bg-base) 100%)`;
    }

    // Update heart state
    const isLiked = this.likedSongIds.includes(song.id);
    if (isLiked) {
      this.playerHeartBtn.classList.add('liked');
      document.getElementById('fs-top-heart-btn')?.classList.add('liked');
    } else {
      this.playerHeartBtn.classList.remove('liked');
      document.getElementById('fs-top-heart-btn')?.classList.remove('liked');
    }

    // Update active highlight classes on cards & table
    document.querySelectorAll('.song-card').forEach(c => {
      c.classList.toggle('playing', parseInt(c.dataset.songIndex) === index);
    });
    document.querySelectorAll('.table-row').forEach(r => {
      r.classList.remove('playing');
    });

    // Update lyrics drawer
    this.updateLyricsView(song);
    this.updateQueueView();

    // Preload next track in background for instant transitions
    this.preloadNextTrack(index);

    if (autoPlay) {
      this.playSong();
    }
  }

  // Silently preload the next track so switching is instant
  preloadNextTrack(currentIndex) {
    try {
      const nextIndex = (currentIndex + 1) % this.songs.length;
      const nextSong = this.songs[nextIndex];
      if (!nextSong) return;

      // Reuse or create a hidden Audio element for preloading
      if (!this.nextTrackPreloader) {
        this.nextTrackPreloader = new Audio();
        this.nextTrackPreloader.preload = 'auto';
        this.nextTrackPreloader.volume = 0;
      }
      this.nextTrackPreloader.src = encodeURI(nextSong.src);
    } catch (e) {
      // Preloading is best-effort, ignore errors
    }
  }

  playSong() {
    this.initAudioContext();
    this.audio.play().then(() => {
      this.isPlaying = true;
      this.playIcon.style.display = 'none';
      this.pauseIcon.style.display = 'block';
      // Sync mobile icons
      const mPlayIcon = document.querySelector('.mobile-play-icon');
      const mPauseIcon = document.querySelector('.mobile-pause-icon');
      if (mPlayIcon) mPlayIcon.style.display = 'none';
      if (mPauseIcon) mPauseIcon.style.display = 'block';
      // Sync fullscreen icons
      const fsPlayIcon = document.getElementById('fs-play-icon');
      const fsPauseIcon = document.getElementById('fs-pause-icon');
      if (fsPlayIcon) fsPlayIcon.style.display = 'none';
      if (fsPauseIcon) fsPauseIcon.style.display = 'block';
    }).catch(err => {
      console.warn('Playback error (auto-play policy):', err);
    });
  }

  pauseSong() {
    this.audio.pause();
    this.isPlaying = false;
    this.playIcon.style.display = 'block';
    this.pauseIcon.style.display = 'none';
    // Sync mobile icons
    const mPlayIcon = document.querySelector('.mobile-play-icon');
    const mPauseIcon = document.querySelector('.mobile-pause-icon');
    if (mPlayIcon) mPlayIcon.style.display = 'block';
    if (mPauseIcon) mPauseIcon.style.display = 'none';
    // Sync fullscreen icons
    const fsPlayIcon = document.getElementById('fs-play-icon');
    const fsPauseIcon = document.getElementById('fs-pause-icon');
    if (fsPlayIcon) fsPlayIcon.style.display = 'block';
    if (fsPauseIcon) fsPauseIcon.style.display = 'none';
  }

  togglePlay() {
    if (this.audio.paused) {
      this.playSong();
    } else {
      this.pauseSong();
    }
  }

  prevSong() {
    if (this.audio.currentTime > 3) {
      this.audio.currentTime = 0;
      return;
    }
    let newIndex = this.currentIndex - 1;
    if (newIndex < 0) newIndex = this.songs.length - 1;
    this.loadSong(newIndex, true);
  }

  nextSong() {
    let newIndex;
    if (this.isShuffle) {
      newIndex = Math.floor(Math.random() * this.songs.length);
      if (newIndex === this.currentIndex && this.songs.length > 1) {
        newIndex = (newIndex + 1) % this.songs.length;
      }
    } else {
      newIndex = (this.currentIndex + 1) % this.songs.length;
    }
    this.loadSong(newIndex, true);
  }

  toggleShuffle() {
    this.isShuffle = !this.isShuffle;
    this.shuffleBtn.classList.toggle('active', this.isShuffle);
    document.getElementById('fs-shuffle-btn')?.classList.toggle('active', this.isShuffle);
  }

  toggleRepeat() {
    this.repeatMode = (this.repeatMode + 1) % 3;
    const fsRepeat = document.getElementById('fs-repeat-btn');
    if (this.repeatMode === 0) {
      this.repeatBtn.classList.remove('active', 'repeat-one');
      if (fsRepeat) fsRepeat.classList.remove('active');
    } else if (this.repeatMode === 1) {
      this.repeatBtn.classList.add('active');
      this.repeatBtn.classList.remove('repeat-one');
      if (fsRepeat) fsRepeat.classList.add('active');
    } else if (this.repeatMode === 2) {
      this.repeatBtn.classList.add('active', 'repeat-one');
      if (fsRepeat) fsRepeat.classList.add('active');
    }
  }

  toggleLike(songId) {
    const idx = this.likedSongIds.indexOf(songId);
    if (idx >= 0) {
      this.likedSongIds.splice(idx, 1);
    } else {
      this.likedSongIds.push(songId);
    }
    localStorage.setItem('spotify_liked_songs', JSON.stringify(this.likedSongIds));
    this.updateLikedBadge();

    // If current song
    if (this.songs[this.currentIndex].id === songId) {
      const isLiked = idx < 0;
      this.playerHeartBtn.classList.toggle('liked', isLiked);
      document.getElementById('fs-top-heart-btn')?.classList.toggle('liked', isLiked);
    }

    this.renderTracksTable();
    if (this.currentView === 'playlist' && this.activePlaylistId === 'liked') {
      this.renderPlaylistTracks();
    }
  }

  // ==========================================================================
  // 5. WEB AUDIO API SOUNDWAVE VISUALIZER
  // ==========================================================================
  initAudioContext() {
    if (this.isVisualizerInit) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.audioCtx = new AudioContext();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;

      const source = this.audioCtx.createMediaElementSource(this.audio);
      source.connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);

      this.isVisualizerInit = true;
      this.drawVisualizer();
    } catch (e) {
      console.warn('AudioContext init note:', e);
    }
  }

  drawVisualizer() {
    requestAnimationFrame(() => this.drawVisualizer());
    if (!this.analyser) return;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);

    [this.visualizerCanvas, this.fullscreenVisualizerCanvas].forEach(canvas => {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);
      const barWidth = (width / bufferLength) * 1.8;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * height;
        const gradient = ctx.createLinearGradient(0, height, 0, 0);
        gradient.addColorStop(0, '#1ed760');
        gradient.addColorStop(0.6, '#06b6d4');
        gradient.addColorStop(1, '#8b5cf6');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, height - barHeight, barWidth - 2, barHeight);
        x += barWidth;
      }
    });
  }

  // ==========================================================================
  // 6. DRAWERS: LYRICS & QUEUE
  // ==========================================================================
  toggleDrawer(panelName) {
    if (this.activeDrawerPanel === panelName) {
      this.closeDrawer();
      return;
    }

    this.rightDrawer.classList.remove('collapsed');
    this.panelLyrics.style.display = 'none';
    this.panelQueue.style.display = 'none';

    document.getElementById('lyrics-toggle-btn')?.classList.remove('active');
    document.getElementById('queue-toggle-btn')?.classList.remove('active');

    if (panelName === 'lyrics') {
      this.panelLyrics.style.display = 'flex';
      this.drawerTitle.textContent = 'Lyrics';
      document.getElementById('lyrics-toggle-btn')?.classList.add('active');
    } else if (panelName === 'queue') {
      this.panelQueue.style.display = 'flex';
      this.drawerTitle.textContent = 'Queue';
      this.updateQueueView();
      document.getElementById('queue-toggle-btn')?.classList.add('active');
    }
    this.activeDrawerPanel = panelName;
  }

  closeDrawer() {
    this.rightDrawer.classList.add('collapsed');
    this.activeDrawerPanel = null;
    document.getElementById('lyrics-toggle-btn')?.classList.remove('active');
    document.getElementById('queue-toggle-btn')?.classList.remove('active');
  }

  updateLyricsView(song) {
    const titleEl = document.getElementById('lyrics-song-title');
    const artistEl = document.getElementById('lyrics-song-artist');

    if (titleEl) titleEl.textContent = song.title;
    if (artistEl) artistEl.textContent = song.artist;

    // Immediately render current lyrics (fallback or previously cached)
    this.renderLyricsLines(song.lyrics);

    // Initial badge state
    if (song.lyricsSource === 'online' || song.lyricsSource === 'cached') {
      this.updateLyricsBadge('Online Synced', 'online');
    } else if (song.lyrics && song.lyrics.length > 2) {
      this.updateLyricsBadge('Local Synced', 'online');
    } else {
      this.updateLyricsBadge('Searching...', 'fetching');
    }

    // Auto-fetch synchronized lyrics from internet if not yet done
    if (!song.lyricsFetched) {
      this.fetchOnlineLyrics(song);
    }
  }

  updateLyricsBadge(text, stateClass) {
    const badge = document.getElementById('lyrics-badge');
    if (!badge) return;
    badge.textContent = text;
    badge.className = 'lyrics-badge ' + (stateClass || '');
  }

  renderLyricsLines(lyrics) {
    const container = document.getElementById('lyrics-container');
    if (!container) return;
    container.innerHTML = '';

    const lines = (lyrics && lyrics.length > 0) ? lyrics : [
      { time: 0, text: "♪ Enjoying the music ♪" },
      { time: 10, text: "Lyrics unavailable for this track." }
    ];

    lines.forEach(item => {
      const line = document.createElement('div');
      line.className = 'lyric-line';
      line.dataset.time = item.time;
      line.textContent = item.text;
      line.addEventListener('click', () => {
        this.audio.currentTime = item.time;
      });
      container.appendChild(line);
    });
  }

  cleanTrackMetadata(title, artist) {
    const clean = (s) => (s || '')
      .replace(/\(lyrics\)/gi, '')
      .replace(/\[lyrics\]/gi, '')
      .replace(/\(official\s*(audio|video|music\s*video|lyric\s*video)?\)/gi, '')
      .replace(/\[official\s*(audio|video|music\s*video|lyric\s*video)?\]/gi, '')
      .replace(/utomp3\.com\s*-\s*/gi, '')
      .replace(/\.mp3$/i, '')
      .replace(/\s+/g, ' ')
      .trim();

    let cTitle = clean(title);
    let cArtist = clean(artist);

    // If artist is generic but title has 'Artist - Title'
    if ((!cArtist || cArtist.toLowerCase() === 'local artist' || cArtist.toLowerCase() === 'unknown artist') && cTitle.includes(' - ')) {
      const parts = cTitle.split(' - ');
      cArtist = clean(parts[0]);
      cTitle = clean(parts[1]);
    }

    return { title: cTitle, artist: cArtist };
  }

  parseLrc(lrcText) {
    if (!lrcText) return [];
    const lines = lrcText.split('\n');
    const result = [];
    const timeRegex = /\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\]/;

    for (const rawLine of lines) {
      const match = rawLine.match(timeRegex);
      if (match) {
        const min = parseInt(match[1], 10);
        const sec = parseInt(match[2], 10);
        const frac = match[3] ? parseFloat('0.' + match[3]) : 0;
        const totalSeconds = min * 60 + sec + frac;
        const text = rawLine.replace(/\[\d{2}:\d{2}(?:\.\d{2,3})?\]/, '').trim();
        if (text) {
          result.push({ time: Math.round(totalSeconds * 10) / 10, text });
        }
      }
    }
    return result;
  }

  parsePlainLyrics(plainText, duration = 180) {
    if (!plainText) return [];
    const lines = plainText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (!lines.length) return [];
    const dur = Math.max(30, duration);
    const interval = Math.max(2.5, (dur - 10) / lines.length);
    return lines.map((text, i) => ({
      time: Math.round((5 + i * interval) * 10) / 10,
      text
    }));
  }

  async fetchOnlineLyrics(song, forceRefresh = false) {
    if (!song) return;

    const refreshBtn = document.getElementById('lyrics-refresh-btn');
    if (refreshBtn && forceRefresh) refreshBtn.classList.add('spinning');

    const clean = this.cleanTrackMetadata(song.title, song.artist);
    const cacheKey = 'sp_lyrics_' + (clean.title + '__' + clean.artist).toLowerCase().replace(/[^a-z0-9_]+/g, '_');

    // 1. Check localStorage cache
    if (!forceRefresh) {
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsedCache = JSON.parse(cached);
          if (Array.isArray(parsedCache) && parsedCache.length > 0) {
            song.lyrics = parsedCache;
            song.lyricsSource = 'cached';
            song.lyricsFetched = true;
            if (this.songs[this.currentIndex]?.id === song.id) {
              this.renderLyricsLines(song.lyrics);
              this.updateLyricsBadge('Online Synced', 'online');
            }
            return;
          }
        }
      } catch (e) {
        console.warn('Lyrics cache read error:', e);
      }
    }

    this.updateLyricsBadge('Searching...', 'fetching');

    try {
      let data = null;

      // Attempt 1: Exact match query
      const getUrl = `https://lrclib.net/api/get?artist_name=${encodeURIComponent(clean.artist)}&track_name=${encodeURIComponent(clean.title)}`;
      const getRes = await fetch(getUrl);
      if (getRes.ok) {
        data = await getRes.json();
      }

      // Attempt 2: Search endpoint fallback
      if (!data || (!data.syncedLyrics && !data.plainLyrics)) {
        const searchUrl = `https://lrclib.net/api/search?q=${encodeURIComponent(clean.artist + ' ' + clean.title)}`;
        const searchRes = await fetch(searchUrl);
        if (searchRes.ok) {
          const results = await searchRes.json();
          if (Array.isArray(results) && results.length > 0) {
            data = results.find(r => r.syncedLyrics) || results.find(r => r.plainLyrics) || results[0];
          }
        }
      }

      let parsedLyrics = [];
      if (data && data.syncedLyrics) {
        parsedLyrics = this.parseLrc(data.syncedLyrics);
      } else if (data && data.plainLyrics) {
        parsedLyrics = this.parsePlainLyrics(data.plainLyrics, this.audio.duration || 180);
      }

      if (parsedLyrics.length > 0) {
        song.lyrics = parsedLyrics;
        song.lyricsSource = 'online';
        song.lyricsFetched = true;
        try {
          localStorage.setItem(cacheKey, JSON.stringify(parsedLyrics));
        } catch (e) {}

        if (this.songs[this.currentIndex]?.id === song.id) {
          this.renderLyricsLines(song.lyrics);
          this.updateLyricsBadge(data.syncedLyrics ? 'Online Synced' : 'Plain Lyrics', 'online');
        }
      } else {
        song.lyricsFetched = true;
        if (this.songs[this.currentIndex]?.id === song.id) {
          const hasLocal = song.lyrics && song.lyrics.length > 2;
          this.updateLyricsBadge(hasLocal ? 'Local Synced' : 'Offline', hasLocal ? 'online' : 'offline');
        }
      }
    } catch (err) {
      console.warn('Auto lyrics fetch error:', err);
      song.lyricsFetched = true;
      if (this.songs[this.currentIndex]?.id === song.id) {
        const hasLocal = song.lyrics && song.lyrics.length > 2;
        this.updateLyricsBadge(hasLocal ? 'Local Synced' : 'Offline', hasLocal ? 'online' : 'offline');
      }
    } finally {
      if (refreshBtn) refreshBtn.classList.remove('spinning');
    }
  }

  syncLyrics(currentTime) {
    const lines = document.querySelectorAll('.lyric-line');
    let currentLine = null;

    lines.forEach(line => {
      const t = parseFloat(line.dataset.time);
      if (currentTime >= t) {
        currentLine = line;
      }
    });

    lines.forEach(l => l.classList.remove('active'));
    if (currentLine) {
      currentLine.classList.add('active');
      currentLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  updateQueueView() {
    const nowPlayingBox = document.getElementById('queue-now-playing');
    const list = document.getElementById('queue-list');
    if (!nowPlayingBox || !list) return;

    const current = this.songs[this.currentIndex];
    nowPlayingBox.innerHTML = `
      <div class="queue-item">
        <img src="${encodeURI(current.cover)}" alt="${current.title}" />
        <div class="queue-item-info">
          <div class="queue-title">${current.title}</div>
          <div class="queue-artist">${current.artist}</div>
        </div>
      </div>
    `;

    list.innerHTML = '';
    for (let i = 1; i <= Math.min(5, this.songs.length - 1); i++) {
      const nextIdx = (this.currentIndex + i) % this.songs.length;
      const song = this.songs[nextIdx];
      const item = document.createElement('div');
      item.className = 'queue-item';
      item.innerHTML = `
        <img src="${encodeURI(song.cover)}" alt="${song.title}" />
        <div class="queue-item-info">
          <div class="queue-title">${song.title}</div>
          <div class="queue-artist">${song.artist}</div>
        </div>
      `;
      item.addEventListener('click', () => this.loadSong(nextIdx, true));
      list.appendChild(item);
    }
  }

  // ==========================================================================
  // 7. AUTOMATIC LOCAL MUSIC FOLDER IMPORT (HTML5 Directory API)
  // ==========================================================================
  handleFolderImport(files) {
    if (!files || files.length === 0) return;

    const newTracksMap = {};

    Array.from(files).forEach(file => {
      const pathParts = file.webkitRelativePath.split('/');
      const folderName = pathParts.length > 1 ? pathParts[pathParts.length - 2] : 'Imported';
      const ext = file.name.split('.').pop().toLowerCase();

      if (!newTracksMap[folderName]) {
        newTracksMap[folderName] = { title: folderName, artist: 'Local Artist', audioFile: null, imageFile: null };
      }

      if (['mp3', 'wav', 'ogg', 'm4a', 'flac'].includes(ext)) {
        newTracksMap[folderName].audioFile = file;
        // Check for artist - title syntax
        if (file.name.includes(' - ')) {
          const parts = file.name.replace(`.${ext}`, '').split(' - ');
          newTracksMap[folderName].artist = parts[0].trim();
          newTracksMap[folderName].title = parts[1].trim();
        }
      } else if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
        newTracksMap[folderName].imageFile = file;
      }
    });

    let addedCount = 0;
    Object.keys(newTracksMap).forEach(key => {
      const item = newTracksMap[key];
      if (item.audioFile) {
        const audioUrl = URL.createObjectURL(item.audioFile);
        const coverUrl = item.imageFile ? URL.createObjectURL(item.imageFile) : 'Svg/logo.svg';

        this.songs.unshift({
          id: `local-${Date.now()}-${addedCount}`,
          title: item.title,
          artist: item.artist,
          album: `${item.title} (Local Import)`,
          src: audioUrl,
          cover: coverUrl,
          duration: '3:00',
          vibe: 'Local Music Track',
          tags: ['local', 'imported', 'music'],
          color: '#1e3a8a',
          lyrics: [{ time: 0, text: `♪ Playing ${item.title} from local folder ♪` }]
        });
        addedCount++;
      }
    });

    if (addedCount > 0) {
      alert(`Success! Imported ${addedCount} local tracks into your Spotify player.`);
      this.renderAll();
      this.loadSong(0, true);
    } else {
      alert('No supported audio files (.mp3, .wav, .m4a) found in selected folder.');
    }
  }

  // ==========================================================================
  // 9. EVENT LISTENERS & KEYBOARD SHORTCUTS
  // ==========================================================================
  setupEventListeners() {
    // Play / Pause
    this.playBtn.addEventListener('click', () => this.togglePlay());
    this.prevBtn.addEventListener('click', () => this.prevSong());
    this.nextBtn.addEventListener('click', () => this.nextSong());
    this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
    this.repeatBtn.addEventListener('click', () => this.toggleRepeat());

    // Mobile playback controls (mini-player)
    document.getElementById('mobile-play-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.togglePlay();
    });
    document.getElementById('mobile-prev-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.prevSong();
    });
    document.getElementById('mobile-next-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.nextSong();
    });

    // Mobile mini-player tap to open fullscreen Now Playing
    const playerLeft = document.querySelector('.player-bar .player-left');
    if (playerLeft) {
      playerLeft.addEventListener('click', (e) => {
        if (e.target.closest('#player-heart-btn')) return;
        if (window.innerWidth <= 768) {
          const fsOverlay = document.getElementById('fullscreen-overlay');
          if (fsOverlay) fsOverlay.style.display = 'flex';
        }
      });
    }

    // Fullscreen controls
    document.getElementById('fs-play-btn')?.addEventListener('click', () => this.togglePlay());
    document.getElementById('fs-prev-btn')?.addEventListener('click', () => this.prevSong());
    document.getElementById('fs-next-btn')?.addEventListener('click', () => this.nextSong());
    document.getElementById('fs-shuffle-btn')?.addEventListener('click', () => this.toggleShuffle());
    document.getElementById('fs-repeat-btn')?.addEventListener('click', () => this.toggleRepeat());
    document.getElementById('fs-top-heart-btn')?.addEventListener('click', () => {
      const curr = this.songs[this.currentIndex];
      if (curr) this.toggleLike(curr.id);
    });
    document.getElementById('fs-lyrics-btn')?.addEventListener('click', () => {
      const fsOverlay = document.getElementById('fullscreen-overlay');
      if (fsOverlay) fsOverlay.style.display = 'none';
      this.toggleDrawer('lyrics');
    });

    // Mobile Bottom Navigation
    const bnavHome = document.getElementById('bnav-home');
    const bnavSearch = document.getElementById('bnav-search');
    const bnavLibrary = document.getElementById('bnav-library');
    const bnavLyrics = document.getElementById('bnav-lyrics');

    bnavHome?.addEventListener('click', () => {
      this.setBottomNavActive('bnav-home');
      this.closeDrawer();
      this.showHomeView();
      document.getElementById('main-content')?.scrollTo({ top: 0, behavior: 'smooth' });
    });

    bnavSearch?.addEventListener('click', () => {
      this.setBottomNavActive('bnav-search');
      this.closeDrawer();
      const searchInput = document.getElementById('search-input');
      if (searchInput) {
        searchInput.focus();
        if (!searchInput.value.trim()) {
          this.performSearch('');
        }
      }
    });

    bnavLibrary?.addEventListener('click', () => {
      this.setBottomNavActive('bnav-library');
      this.closeDrawer();
      this.openPlaylistView('liked');
      document.getElementById('main-content')?.scrollTo({ top: 0, behavior: 'smooth' });
    });

    bnavLyrics?.addEventListener('click', () => {
      this.setBottomNavActive('bnav-lyrics');
      this.toggleDrawer('lyrics');
    });

    // Like current song (mini-player & desktop)
    this.playerHeartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const curr = this.songs[this.currentIndex];
      if (curr) this.toggleLike(curr.id);
    });

    // Audio time update
    const fsProgressBar = document.getElementById('fs-progress-bar');
    const fsProgressFill = document.getElementById('fs-progress-fill');
    const fsCurrentTime = document.getElementById('fs-current-time');
    const fsDurationTime = document.getElementById('fs-duration-time');

    this.audio.addEventListener('timeupdate', () => {
      const cur = this.audio.currentTime;
      const dur = this.audio.duration || 1;
      const percent = (cur / dur) * 100;

      this.progressBar.value = percent;
      this.progressFill.style.width = `${percent}%`;
      this.currentTimeEl.textContent = this.formatTime(cur);

      // Sync fullscreen seekbar
      if (fsProgressBar) fsProgressBar.value = percent;
      if (fsProgressFill) fsProgressFill.style.width = `${percent}%`;
      if (fsCurrentTime) fsCurrentTime.textContent = this.formatTime(cur);

      // Sync lyrics
      if (this.activeDrawerPanel === 'lyrics') {
        this.syncLyrics(cur);
      }
    });

    this.audio.addEventListener('loadedmetadata', () => {
      const formatted = this.formatTime(this.audio.duration || 0);
      this.durationTimeEl.textContent = formatted;
      if (fsDurationTime) fsDurationTime.textContent = formatted;
    });

    this.audio.addEventListener('ended', () => {
      if (this.repeatMode === 2) {
        this.audio.currentTime = 0;
        this.playSong();
      } else {
        this.nextSong();
      }
    });

    // Scrub bar seek (desktop & mini-player)
    this.progressBar.addEventListener('input', () => {
      const dur = this.audio.duration || 1;
      const targetTime = (this.progressBar.value / 100) * dur;
      this.progressFill.style.width = `${this.progressBar.value}%`;
      this.currentTimeEl.textContent = this.formatTime(targetTime);
    });

    this.progressBar.addEventListener('change', () => {
      const dur = this.audio.duration || 1;
      this.audio.currentTime = (this.progressBar.value / 100) * dur;
    });

    // Fullscreen scrub bar seek
    if (fsProgressBar) {
      fsProgressBar.addEventListener('input', () => {
        const dur = this.audio.duration || 1;
        const targetTime = (fsProgressBar.value / 100) * dur;
        if (fsProgressFill) fsProgressFill.style.width = `${fsProgressBar.value}%`;
        if (fsCurrentTime) fsCurrentTime.textContent = this.formatTime(targetTime);
      });

      fsProgressBar.addEventListener('change', () => {
        const dur = this.audio.duration || 1;
        this.audio.currentTime = (fsProgressBar.value / 100) * dur;
      });
    }

    // Volume Slider
    this.volumeSlider.addEventListener('input', () => {
      this.audio.volume = this.volumeSlider.value;
      this.volumeFill.style.width = `${this.volumeSlider.value * 100}%`;
      this.updateVolumeIcons(this.audio.volume);
    });

    // Volume Mute Button
    const volIconBtn = document.getElementById('volume-icon-btn');
    if (volIconBtn) {
      volIconBtn.addEventListener('click', () => {
        if (this.audio.volume > 0) {
          this.previousVolume = this.audio.volume;
          this.audio.volume = 0;
          this.volumeSlider.value = 0;
          this.volumeFill.style.width = '0%';
        } else {
          this.audio.volume = this.previousVolume || 0.8;
          this.volumeSlider.value = this.audio.volume;
          this.volumeFill.style.width = `${this.audio.volume * 100}%`;
        }
        this.updateVolumeIcons(this.audio.volume);
      });
    }

    // Top Brand Home Click
    document.getElementById('brand-home-btn')?.addEventListener('click', () => this.showHomeView());
    document.getElementById('nav-home-btn')?.addEventListener('click', () => this.showHomeView());

    // Liked songs sidebar item
    document.getElementById('liked-songs-item')?.addEventListener('click', () => this.openPlaylistView('liked'));

    // Category Chips
    document.querySelectorAll('.cat-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.cat-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentCategory = btn.dataset.category;
        this.renderTracksTable();
      });
    });

    // Drawer triggers
    document.getElementById('lyrics-toggle-btn')?.addEventListener('click', () => this.toggleDrawer('lyrics'));
    document.getElementById('queue-toggle-btn')?.addEventListener('click', () => this.toggleDrawer('queue'));
    document.getElementById('close-drawer-btn')?.addEventListener('click', () => this.closeDrawer());
    document.getElementById('lyrics-refresh-btn')?.addEventListener('click', () => {
      const song = this.songs[this.currentIndex];
      if (song) {
        this.fetchOnlineLyrics(song, true);
      }
    });

    // Search input
    const searchInput = document.getElementById('search-input');
    const searchClear = document.getElementById('search-clear');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim();
        if (searchClear) searchClear.style.display = query ? 'block' : 'none';
        if (query) {
          this.performSearch(query);
        } else {
          this.showHomeView();
        }
      });
    }
    if (searchClear) {
      searchClear.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        searchClear.style.display = 'none';
        this.showHomeView();
      });
    }


    // Folder Import Trigger
    const folderInput = document.getElementById('folder-input');
    const importBtn = document.getElementById('import-folder-btn');
    if (importBtn && folderInput) {
      importBtn.addEventListener('click', () => folderInput.click());
      folderInput.addEventListener('change', (e) => this.handleFolderImport(e.target.files));
    }

    // Fullscreen Mode
    const fsBtn = document.getElementById('fullscreen-btn');
    const fsBtnMini = document.getElementById('fullscreen-btn-mini');
    const fsOverlay = document.getElementById('fullscreen-overlay');
    const fsClose = document.getElementById('fullscreen-close-btn');

    if (fsBtn && fsOverlay) {
      fsBtn.addEventListener('click', () => fsOverlay.style.display = 'flex');
    }
    if (fsBtnMini && fsOverlay) {
      fsBtnMini.addEventListener('click', () => fsOverlay.style.display = 'flex');
    }
    if (fsClose && fsOverlay) {
      fsClose.addEventListener('click', () => fsOverlay.style.display = 'none');
    }

    // Playlist Creation Modal
    const createPlBtn = document.getElementById('create-playlist-btn');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalCancel = document.getElementById('modal-cancel-btn');
    const modalSave = document.getElementById('modal-save-btn');
    const plNameInput = document.getElementById('new-playlist-name');

    if (createPlBtn && modalBackdrop) {
      createPlBtn.addEventListener('click', () => {
        modalBackdrop.style.display = 'flex';
        if (plNameInput) plNameInput.focus();
      });
    }
    if (modalCancel && modalBackdrop) {
      modalCancel.addEventListener('click', () => modalBackdrop.style.display = 'none');
    }
    if (modalSave && modalBackdrop && plNameInput) {
      modalSave.addEventListener('click', () => {
        const name = plNameInput.value.trim() || `My Playlist #${this.customPlaylists.length + 1}`;
        const newPl = { id: `pl-${Date.now()}`, name, songIds: [] };
        this.customPlaylists.push(newPl);
        localStorage.setItem('spotify_custom_playlists', JSON.stringify(this.customPlaylists));
        this.renderCustomPlaylists();
        modalBackdrop.style.display = 'none';
        plNameInput.value = '';
        this.openPlaylistView(newPl.id);
      });
    }
  }

  setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (['input', 'textarea'].includes(e.target.tagName.toLowerCase())) return;

      if (e.code === 'Space') {
        e.preventDefault();
        this.togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        this.audio.currentTime = Math.min(this.audio.currentTime + 5, this.audio.duration || 0);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        this.audio.currentTime = Math.max(this.audio.currentTime - 5, 0);
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        this.audio.volume = Math.min(this.audio.volume + 0.05, 1);
        this.volumeSlider.value = this.audio.volume;
        this.volumeFill.style.width = `${this.audio.volume * 100}%`;
        this.updateVolumeIcons(this.audio.volume);
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        this.audio.volume = Math.max(this.audio.volume - 0.05, 0);
        this.volumeSlider.value = this.audio.volume;
        this.volumeFill.style.width = `${this.audio.volume * 100}%`;
        this.updateVolumeIcons(this.audio.volume);
      } else if (e.key === 'm' || e.key === 'M') {
        document.getElementById('volume-icon-btn')?.click();
      } else if (e.key === 'l' || e.key === 'L') {
        const curr = this.songs[this.currentIndex];
        if (curr) this.toggleLike(curr.id);
      }
    });
  }

  setBottomNavActive(navId) {
    const ids = ['bnav-home', 'bnav-search', 'bnav-library', 'bnav-lyrics'];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.toggle('active', id === navId);
    });
  }

  showHomeView() {
    this.currentView = 'home';
    this.setBottomNavActive('bnav-home');
    document.getElementById('view-home').style.display = 'block';
    document.getElementById('view-search').style.display = 'none';
    document.getElementById('view-playlist').style.display = 'none';
    document.getElementById('liked-songs-item')?.classList.remove('active');
  }

  performSearch(query) {
    this.currentView = 'search';
    this.setBottomNavActive('bnav-search');
    document.getElementById('view-home').style.display = 'none';
    document.getElementById('view-playlist').style.display = 'none';
    const searchView = document.getElementById('view-search');
    searchView.style.display = 'block';

    const q = (query || '').toLowerCase().trim();
    const heading = document.getElementById('search-query-heading');
    if (heading) heading.textContent = q ? `Search results for "${query}"` : 'Browse all music';

    const results = q ? this.songs.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.artist.toLowerCase().includes(q) ||
      (s.vibe && s.vibe.toLowerCase().includes(q)) ||
      (s.tags && s.tags.some(t => t.toLowerCase().includes(q)))
    ) : this.songs;

    const grid = document.getElementById('search-cards-grid');
    const empty = document.getElementById('search-empty-state');
    grid.innerHTML = '';

    if (results.length === 0) {
      empty.style.display = 'block';
    } else {
      empty.style.display = 'none';
      results.forEach(song => {
        const realIdx = this.songs.findIndex(s => s.id === song.id);
        grid.appendChild(this.createSongCard(song, realIdx));
      });
    }
  }

  openPlaylistView(playlistId) {
    this.currentView = 'playlist';
    this.activePlaylistId = playlistId;
    this.setBottomNavActive('bnav-library');

    document.getElementById('view-home').style.display = 'none';
    document.getElementById('view-search').style.display = 'none';
    const plView = document.getElementById('view-playlist');
    plView.style.display = 'block';

    const titleEl = document.getElementById('playlist-detail-title');
    const descEl = document.getElementById('playlist-detail-desc');
    const countEl = document.getElementById('playlist-detail-count');
    const coverEl = document.getElementById('playlist-detail-cover');
    const deleteBtn = document.getElementById('playlist-delete-btn');

    if (playlistId === 'liked') {
      titleEl.textContent = 'Liked Songs';
      descEl.textContent = 'Your personal collection of favorite tracks.';
      countEl.textContent = `${this.likedSongIds.length} songs`;
      coverEl.style.background = 'linear-gradient(135deg, #450af5, #8e8ee5)';
      if (deleteBtn) deleteBtn.style.display = 'none';
    } else {
      const pl = this.customPlaylists.find(p => p.id === playlistId);
      if (pl) {
        titleEl.textContent = pl.name;
        descEl.textContent = 'Custom user-created playlist.';
        countEl.textContent = `${pl.songIds ? pl.songIds.length : 0} songs`;
        coverEl.style.background = 'linear-gradient(135deg, #10b981, #064e3b)';
        if (deleteBtn) {
          deleteBtn.style.display = 'block';
          deleteBtn.onclick = () => {
            this.customPlaylists = this.customPlaylists.filter(p => p.id !== playlistId);
            localStorage.setItem('spotify_custom_playlists', JSON.stringify(this.customPlaylists));
            this.renderCustomPlaylists();
            this.showHomeView();
          };
        }
      }
    }

    this.renderPlaylistTracks();
  }

  renderPlaylistTracks() {
    const tbody = document.getElementById('playlist-tracks-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    let songList = [];
    if (this.activePlaylistId === 'liked') {
      songList = this.songs.filter(s => this.likedSongIds.includes(s.id));
    } else {
      const pl = this.customPlaylists.find(p => p.id === this.activePlaylistId);
      if (pl && pl.songIds) {
        songList = this.songs.filter(s => pl.songIds.includes(s.id));
      }
    }

    if (songList.length === 0) {
      tbody.innerHTML = '<div style="padding: 24px; color: var(--text-subdued); text-align: center;">No songs in this playlist yet. Browse and like tracks to add them!</div>';
      return;
    }

    songList.forEach((song, i) => {
      const realIndex = this.songs.findIndex(s => s.id === song.id);
      const isLiked = this.likedSongIds.includes(song.id);

      const row = document.createElement('div');
      row.className = `table-row ${realIndex === this.currentIndex ? 'playing' : ''}`;
      row.innerHTML = `
        <span class="col-num">${i + 1}</span>
        <div class="col-title">
          <img src="${song.cover}" alt="${song.title}" />
          <div class="col-title-meta">
            <span class="col-title-name">${song.title}</span>
            <span class="col-title-artist">${song.artist}</span>
          </div>
        </div>
        <span class="col-album desktop-only">${song.album || song.title}</span>
        <span class="col-vibe desktop-only">
          <span class="vibe-tag-badge">${(song.tags && song.tags[0]) || song.vibe || 'music'}</span>
        </span>
        <span class="col-like">
          <button class="track-heart-btn ${isLiked ? 'liked' : ''}" data-song-id="${song.id}">♥</button>
        </span>
        <span class="col-dur">${song.duration || '3:30'}</span>
      `;

      row.addEventListener('click', (e) => {
        if (e.target.closest('.track-heart-btn')) return;
        this.loadSong(realIndex, true);
      });

      const heartBtn = row.querySelector('.track-heart-btn');
      if (heartBtn) {
        heartBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleLike(song.id);
        });
      }
      tbody.appendChild(row);
    });

    // Play all button
    const playAllBtn = document.getElementById('playlist-play-all-btn');
    if (playAllBtn && songList.length > 0) {
      playAllBtn.onclick = () => {
        const firstIdx = this.songs.findIndex(s => s.id === songList[0].id);
        this.loadSong(firstIdx >= 0 ? firstIdx : 0, true);
      };
    }
  }

  updateVolumeIcons(val) {
    if (val === 0) {
      this.volumeHighIcon.style.display = 'none';
      this.volumeMutedIcon.style.display = 'block';
    } else {
      this.volumeHighIcon.style.display = 'block';
      this.volumeMutedIcon.style.display = 'none';
    }
  }

  formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.spotifyApp = new SpotifyApp();
});
