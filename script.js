const trackButtons = Array.from(
  document.querySelectorAll('button[id^="play-track-"][data-audio]')
);

let currentAudio = null;
let currentButton = null;

function setButtonPlaying(button, isPlaying) {
  const icon = button.querySelector('.track-play-icon');
  icon.textContent = isPlaying ? 'pause' : 'play_arrow';
  button.setAttribute(
    'aria-label',
    `${isPlaying ? 'Jeda' : 'Putar'} ${button.getAttribute('aria-label').replace(/^(Putar|Jeda) /, '')}`
  );
}

function stopCurrentTrack() {
  if (!currentAudio) return;

  currentAudio.pause();
  currentAudio.currentTime = 0;
  setButtonPlaying(currentButton, false);
  currentAudio = null;
  currentButton = null;
}

function playTrack(audio, button) {
  audio.play().then(() => {
    if (audio === currentAudio) {
      setButtonPlaying(button, !audio.paused);
    }
  }).catch((error) => {
    if (audio !== currentAudio) return;

    setButtonPlaying(button, false);
    currentAudio = null;
    currentButton = null;
    console.error(`Tidak dapat memutar ${audio.src}`, error);
  });
}

trackButtons.forEach((button) => {
  const audio = new Audio(button.dataset.audio);

  button.addEventListener('click', () => {
    if (audio === currentAudio) {
      if (!audio.paused) {
        audio.pause();
        setButtonPlaying(button, false);
      } else {
        playTrack(audio, button);
      }
      return;
    }

    stopCurrentTrack();
    currentAudio = audio;
    currentButton = button;
    playTrack(audio, button);
  });

  audio.addEventListener('ended', () => {
    if (audio !== currentAudio) return;

    setButtonPlaying(button, false);
    currentAudio = null;
    currentButton = null;
  });
});
