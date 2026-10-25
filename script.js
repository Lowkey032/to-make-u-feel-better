const questionScreen = document.querySelector("#question-screen");
const optionsScreen = document.querySelector("#options-screen");
const storyScreen = document.querySelector("#story-screen");
const noScreen = document.querySelector("#no-screen");

const storyPanels = document.querySelectorAll(".story-panel");
const songAudio = document.querySelector("#our-song");
const songPlayButton = document.querySelector("#song-play-button");
const songPlayIcon = document.querySelector("#song-play-icon");
const songProgress = document.querySelector("#song-progress");
const songCurrentTime = document.querySelector("#song-current-time");
const songDuration = document.querySelector("#song-duration");
const songStatus = document.querySelector("#song-status");

function formatTime(timeInSeconds) {
  if (!Number.isFinite(timeInSeconds)) {
    return "0:00";
  }

  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function showScreen(screenToShow) {
  const screens = [
    questionScreen,
    optionsScreen,
    storyScreen,
    noScreen
  ];

  screens.forEach((screen) => {
    screen.hidden = screen !== screenToShow;
  });

  if (screenToShow !== storyScreen || document.querySelector("#song-panel").hidden) {
    songAudio.pause();
  }

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  window.scrollTo({
    top: 0,
    behavior: reduceMotion ? "auto" : "smooth"
  });
}

// YES BUTTON
document.querySelector("#yes-button").addEventListener("click", () => {
  showScreen(optionsScreen);
});

// NO BUTTON
document.querySelector("#no-button").addEventListener("click", () => {
  showScreen(noScreen);
});

// OPEN A GIFT
document.querySelectorAll(".gift-option").forEach((button) => {
  button.addEventListener("click", () => {
    const selectedPanel = button.dataset.story;

    storyPanels.forEach((panel) => {
      panel.hidden = panel.id !== selectedPanel;
    });

    showScreen(storyScreen);
  });
});

// BACK TO GIFT OPTIONS
document.querySelector("#back-to-gifts").addEventListener("click", () => {
  showScreen(optionsScreen);
});

// BACK TO THE QUESTION
document.querySelector("#back-to-question").addEventListener("click", () => {
  showScreen(questionScreen);
});

// TRY AGAIN
document.querySelector("#no-screen .again-button").addEventListener("click", () => {
  showScreen(questionScreen);
});

songPlayButton.addEventListener("click", () => {
  if (songAudio.paused) {
    songAudio.play().catch((error) => {
      songStatus.textContent = "The song couldn't start. Please try again.";
      console.error("Song playback failed:", error);
    });
  } else {
    songAudio.pause();
  }
});

songAudio.addEventListener("play", () => {
  songPlayIcon.textContent = "Ⅱ";
  songPlayButton.setAttribute("aria-label", "Pause the song");
  songStatus.textContent = "Playing this song for you ♡";
});

songAudio.addEventListener("pause", () => {
  songPlayIcon.textContent = "▶";
  songPlayButton.setAttribute("aria-label", "Play the song");
  if (!songAudio.ended) {
    songStatus.textContent = "Paused. I'm here if you need me.";
  }
});

songAudio.addEventListener("loadedmetadata", () => {
  songDuration.textContent = formatTime(songAudio.duration);
});

songAudio.addEventListener("timeupdate", () => {
  songCurrentTime.textContent = formatTime(songAudio.currentTime);
  songProgress.value = songAudio.duration
    ? String((songAudio.currentTime / songAudio.duration) * 100)
    : "0";
});

songProgress.addEventListener("input", () => {
  if (Number.isFinite(songAudio.duration)) {
    songAudio.currentTime = (Number(songProgress.value) / 100) * songAudio.duration;
  }
});

songAudio.addEventListener("ended", () => {
  songStatus.textContent = "Take your time. I'm rooting for you. ♡";
});

songAudio.addEventListener("error", () => {
  songStatus.textContent = "The song couldn't be loaded. Check that the audio file is available.";
  console.error("Song audio failed to load:", songAudio.error);
});
