const songs = [
    {
      title: "Pal Pal",
      src: "Songs/Pal Pal/Afusic - Pal Pal (Official Music Video) Prod. AliSoomroMusic - AFUSIC.mp3",
      cover: "Songs/Pal Pal/img.jpg"
    },
    {
      title: "On my own",
      src: "Songs/On My Own/utomp3.com -  Darci  On My Own Lyrics.mp3",
      cover: "Songs/On My Own/img.jpg"
    },
    {
      title: "Criminal",
      src: "Songs/Criminal/Britney Spears - Criminal (Lyrics).mp3",
      cover: "Songs/Criminal/img.jpg"
    },
    {
    title: "Wishes",
      artist: "Hassan Raheem,Umair ft Talwiinder",
      src: "Songs/Wishes/Hasan Raheem - Wishes ft Talwiinder  Prod by Umair (Official Lyric Video) - Hasan Raheem.mp3",
      cover: "Songs/Wishes/img.jpg"
    },

    {
    title: "Way Down We Go",
      artist: "KALEO",
      src: "Songs/Way Down We Go/KALEO - Way Down We Go (Official Music Video).mp3",
      cover: "Songs/Way Down We Go/img.jpg"
    },

    {
    title: "Gallan 4",
      artist: "Talwiinder",
      src: "Songs/Gallan 4/Talwiinder - GALLAN 4 (Lyrical Video).mp3",
      cover: "Songs/Gallan 4/img.jpg"
    }
  ];

  let currentIndex = 0;
  const audio = document.getElementById("audio-player");
  const playBtn = document.getElementById("play-btn");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const progressBar = document.getElementById("progress-bar");
  const currentTimeEl = document.getElementById("current-time");
  const durationEl = document.getElementById("duration");
  const volumeSlider = document.getElementById("volume-slider");
  const coverImg = document.getElementById("cover");
const songTitle = document.getElementById("current-song-title");
  const songArtist = document.getElementById("current-song-artist");
  const songCards = document.querySelectorAll(".card");


  function loadSong(index) {
    currentIndex = index;
    const song = songs[index];
    audio.src = song.src;
    coverImg.src = song.cover;
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;
    audio.load();
    
    // Update visual indicators
    updatePlayingCard();
  }

  function updatePlayingCard() {
    // Remove playing class from all cards
    songCards.forEach(card => card.classList.remove('playing'));
    
    // Add playing class to current card
    const currentCard = document.querySelector(`[data-song-index="${currentIndex}"]`);
    if (currentCard) {
      currentCard.classList.add('playing');
    }
  }

  function playSong() {
    audio.play();
    playBtn.textContent = "⏸";
  }

  function pauseSong() {
    audio.pause();
    playBtn.textContent = "▶";
  }

  // Add click event listeners to song cards
  songCards.forEach(card => {
    card.addEventListener('click', () => {
      const songIndex = parseInt(card.dataset.songIndex);
      loadSong(songIndex);
      playSong();
    });
  });

  playBtn.addEventListener("click", () => {
    if (audio.paused) {
      playSong();
    } else {
      pauseSong();
    }
  });

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    loadSong(currentIndex);
    playSong();
  });

  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % songs.length;
    loadSong(currentIndex);
    playSong();
  });

  audio.addEventListener("timeupdate", () => {
    progressBar.value = audio.currentTime;
    currentTimeEl.textContent = formatTime(audio.currentTime);
  });

  audio.addEventListener("loadedmetadata", () => {
    progressBar.max = audio.duration;
    durationEl.textContent = formatTime(audio.duration);
  });

  // Auto-play next song when current one ends
  audio.addEventListener("ended", () => {
    currentIndex = (currentIndex + 1) % songs.length;
    loadSong(currentIndex);
    playSong();
  });

  progressBar.addEventListener("input", () => {
    audio.currentTime = progressBar.value;
  });

  volumeSlider.addEventListener("input", () => {
    audio.volume = volumeSlider.value;
  });

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  }

  // Load first song
  loadSong(currentIndex);
