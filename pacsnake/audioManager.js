// ======
// AUDIO
// ======

'use strict';

var audioManager = {
  // Audio management variables
  audioMain: new Audio(),
  audioBlue: new Audio(),
  audioGameOver: new Audio(),
  initialAudio: true,
  mainIsPlaying: false,
  loopSource:
    'https://notendur.hi.is/boo11/Tolvuleikjaforritun/pac-snake/Music/loopGB',
  fadeOutInterval: 0,
  fadeInInterval: 0,
  KEY_MUTE: 'M'.charCodeAt(0),
  musicMuted: false,

  // Initialiser
  init: function() {
    // Audio file urls
    this.audioMain.src =
      'https://notendur.hi.is/boo11/Tolvuleikjaforritun/pac-snake/Music/GB.mp3';
    this.audioBlue.src =
      'https://notendur.hi.is/boo11/Tolvuleikjaforritun/pac-snake/Music/Blue.mp3';
    this.audioGameOver.src =
      'https://notendur.hi.is/boo11/Tolvuleikjaforritun/pac-snake/Music/GameOver.mp3';

    // Event listeners to detect when the music finishes
    this.audioMain.addEventListener('ended', this.switchToLoopAudio.bind(this));
    this.audioMain.addEventListener('ended', this.playMainMusic.bind(this));
    this.audioBlue.addEventListener('ended', this.playMainMusic.bind(this));
    this.audioGameOver.addEventListener('ended', this.stopMusic.bind(this));

    this.playMainMusic();
  },

  // Update function, mainly for the mute option
  update: function(du) {
    if (this.muteKeyPressed()) {
      this.muteMusic();
    } else {
      this.unMuteMusic();
    }
  },

  // Plays main music
  playMainMusic: function() {
    this.audioBlue.pause();
    this.audioBlue.currentTime = 0;
    this.audioMain.play();
    this.mainIsPlaying = true;
  },

  // Plays blue musics
  playBlueMusic: function() {
    this.mainIsPlaying = false;
    this.audioBlue.play();

    // Pauses main music after 0.5 seconds for fade out purposes
    setTimeout(this.audioMain.pause(), 500);
    setTimeout(this.switchToLoopAudio.bind(this), 500);
    this.fade(this.audioMain, this.audioBlue);
  },

  // Plays game over music
  playGameOverMusic: function() {
    this.stopMusic();
    this.audioGameOver.play();
  },

  // Stops all music
  stopMusic: function() {
    this.audioMain.pause();
    this.audioBlue.pause();
    this.audioGameOver.pause();
  },

  // Mutes all music
  muteMusic: function() {
    this.audioMain.volume = 0;
    this.audioBlue.volume = 0;
    this.audioGameOver.volume = 0;
  },

  // Unmutes all music
  unMuteMusic: function() {
    if (this.mainIsPlaying) {
      this.audioMain.volume = 1;
    } else {
      this.audioBlue.volume = 1;
    }
    this.audioGameOver.volume = 1;
  },

  // Switches main audio to looped version
  switchToLoopAudio: function() {
    if (this.initialAudio) {
      this.initialAudio = false;
      this.audioMain.src = this.loopSource;
      this.audioMain.currentTime = 0;
      this.audioMain.loop = true;
    }
  },

  // Fades out audio A and fades in audio B
  fade: function(audioFadeOut, audioFadeIn) {
    audioFadeIn.volume = 0;
    this.fadeInInterval = setInterval(this.fadeIn(audioFadeIn), 50);
    this.fadeOutInterval = setInterval(this.fadeOut(audioFadeOut), 50);
  },

  // Fades in audio
  fadeIn: function(audio) {
    if (audio.volume < 1) {
      audio.volume += 0.1;
    }
    if (audio.volume === 1.0) {
      clearInterval(this.fadeInInterval);
    }
  },

  // Fades out audio
  fadeOut: function(audio) {
    if (audio.volume > 0) {
      audio.volume -= 0.1;
    }
    if (audio.volume === 0.0) {
      clearInterval(this.fadeOutInterval);
    }
  },

  // Returns true if the M(mute) key has been pressed
  muteKeyPressed: function() {
    if (eatKey(this.KEY_MUTE)) {
      this.musicMuted = !this.musicMuted;
    }
    return this.musicMuted;
  }
};
