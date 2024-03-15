const artistsCache = "cachedArtists";
const albumCache = "cachedAlbums";
const tracksCache = "cachedTracks";
const trackApi = "https://striveschool-api.herokuapp.com/api/deezer/artist/";
const albumByArtist = `https://corsproxy.io/?https://api.deezer.com/artist/`;
const albumApi = "https://corsproxy.io/?https://api.deezer.com/album/";
const artistApi = "https://corsproxy.io/?https://api.deezer.com/artist/";
const searchApi = "https://striveschool-api.herokuapp.com/api/deezer/search?q=";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWVhZDUyMTJkN2IxMTAwMTkwZTZkY2IiLCJpYXQiOjE3MTAxNjg2MjcsImV4cCI6MTcxMTM3ODIyN30.Js9yWPVZ-_WVXu5nVOvuKTIW9yEyXbD3UJ5A-Deo6LA";

const init = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const albumId = urlParams.get("albumId");

  if (albumId) {
    const album = await fetchAlbum(albumId);
    populateAlbumDetails(album);
  }
};

const fetchAlbum = async (albumId) => {
  try {
    const response = await fetch(`${albumApi}${albumId}`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const album = await response.json();
    console.log("Fetched album:", album);

    return album;
  } catch (error) {
    console.error("Error fetching album:", error);
    return null;
  }
};

const populateAlbumDetails = (album) => {
  const albumTitleElement = document.getElementById("album-title");
  const albumCoverElement = document.getElementById("album-cover");
  const avatarSmall = document.getElementById("avatar-sm");
  const albumArtistElement = document.getElementById("album-author");
  const albumReleaseElement = document.getElementById("album-release");
  const albumTracksCountElement = document.getElementById("album-tracks-count");
  const albumTotalDurationElement = document.getElementById(
    "album-total-duration"
  );
  const albumFansCountElement = document.getElementById("album-fans-count");
  const tbody = document.getElementById("tbody");
  const container = document.getElementById("container-cards-album");

  container.innerHTML = "";

  albumTitleElement.textContent = album.title;
  albumCoverElement.src = album.cover_medium;
  avatarSmall.src = album.cover_small;
  albumArtistElement.textContent = album.artist.name;
  albumReleaseElement.textContent = album.release_date;

  const totalTracks = `${album.nb_tracks} brani`;
  albumTracksCountElement.textContent = totalTracks;

  let totalDurationSeconds = 0;
  album.tracks.data.forEach((track) => {
    totalDurationSeconds += track.duration;
  });

  const formattedDuration = formatDuration(totalDurationSeconds);
  albumTotalDurationElement.textContent = formattedDuration;

  albumFansCountElement.textContent = album.fans.toLocaleString();

  tbody.innerHTML = "";

  album.tracks.data.forEach((track, index) => {
    const row = document.createElement("tr");
    const trackLink = document.createElement("a");
    trackLink.classList.add("btn", "td-none","overfooter");
    trackLink.textContent = track.title;
    trackLink.href = "javascript:void(0);";
    trackLink.addEventListener("click", () => {
      playTrack(track);
    });
    const titleCell = document.createElement("td");
    titleCell.appendChild(trackLink);

    const durationCell = document.createElement("td");
    durationCell.textContent = formatDuration(track.duration);

    row.appendChild(document.createElement("th")).textContent = index + 1;
    row.appendChild(titleCell);
    row.appendChild(document.createElement("td"));
    row.appendChild(durationCell);

    tbody.appendChild(row);
  });

  relatedAlbums.forEach((relatedAlbum) => {
    const card = document.createElement("div");
    card.classList.add("card", "col-2", "me-1", "mb-4");
    card.style.width = "9rem";
    card.innerHTML = `
        <img src="${relatedAlbum.cover_medium}" class="card-img-top mt-3" alt="${relatedAlbum.title}">
        <div class="card-body">
          <h5 class="card-title">${relatedAlbum.title}</h5>
          <p class="card-text">Artista: ${relatedAlbum.artist.name}</p>
          <a href="album.html?albumId=${relatedAlbum.id}" class="btn btn-primary">Vedi Album</a>
        </div>
      `;
    container.appendChild(card);
  });
};

const formatDuration = (durationInSeconds) => {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  const seconds = durationInSeconds % 60;
  const formattedHours = hours > 0 ? `${hours} h. ` : "";
  const formattedMinutes = minutes > 0 ? `${minutes} min. ` : "";
  const formattedSeconds = seconds > 0 ? `${seconds} sec.` : "";
  return `${formattedHours}${formattedMinutes}${formattedSeconds}`;
};

const changeAlbum = (increment) => {
  const urlParams = new URLSearchParams(window.location.search);
  let albumId = urlParams.get("albumId");

  if (albumId) {
    albumId = parseInt(albumId) + increment;
    const newUrl =
      window.location.origin + window.location.pathname + `?albumId=${albumId}`;
    window.history.pushState({ path: newUrl }, "", newUrl);

    init();
  }
};

const audioElement = new Audio();
let isPlaying = false;
let currentTrackIndex = 0;
let updateTimer;

const setTrack = (index) => {
  const allTracks = JSON.parse(localStorage.getItem(tracksCache));

  if (!allTracks || allTracks.length === 0 || !allTracks[index]) {
    console.error("No track available");
    return;
  }

  const track = allTracks[index];

  if (!track.preview) {
    console.error("Track preview URL is missing");
    return;
  }

  audioElement.src = track.preview;
  currentTrackIndex = index;

  if (updateTimer) {
    clearInterval(updateTimer);
  }

  document.getElementById("track-title").innerText =
    track.title || "Unknown Title";
  document.getElementById("track-artist").innerText =
    track.artist.name || "Unknown Artist";
  document.getElementById("progress-bar").value = 0;
  document.getElementById("current-time").innerText = "0:00";
  document.getElementById("total-duration").innerText = formatTime(
    audioElement.duration
  );

  updateTimer = setInterval(seekUpdate, 1000);
  audioElement.onloadedmetadata = () => {
    document.getElementById("total-duration").innerText = formatTime(
      audioElement.duration
    );
  };

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  audioElement.onloadedmetadata = () => {
    document.getElementById("total-duration").innerText = formatTime(
      audioElement.duration
    );
    seekUpdate();
  };

  playTrack(track.preview);
};

document.getElementById("progress-bar").addEventListener("input", (event) => {
  audioElement.currentTime = event.target.value;
});

document.getElementById("volume-control").addEventListener("input", (event) => {
  audioElement.volume = event.target.value;
});

const togglePlayPause = () => {
  if (isPlaying) {
    audioElement.pause();
    cancelAnimationFrame(animationFrameId);
  } else {
    audioElement
      .play()
      .catch((error) => console.error("Error playing track:", error));
    seekUpdate();
  }

  isPlaying = !isPlaying;
  updatePlayPauseButton();
};

const playTrack = (track) => {
  if (!track || !track.preview) {
    console.error("Track URL is missing");
    return;
  }

  audioElement.src = track.preview;
  audioElement
    .play()
    .catch((error) => console.error("Error playing the track:", error));

  isPlaying = true;
  updatePlayPauseButton();

  document.getElementById("track-title").innerText =
    track.title || "Unknown Title";
  document.getElementById("track-artist").innerText =
    track.artist && track.artist.name ? track.artist.name : "Unknown Artist";

  if (updateTimer) {
    clearInterval(updateTimer);
  }

  updateTimer = setInterval(seekUpdate, 1000);
  audioElement.onloadedmetadata = () => {
    document.getElementById("total-duration").innerText = formatTime(
      audioElement.duration
    );
    seekUpdate();
  };
};

const playNextTrack = () => {
  currentTrackIndex =
    (currentTrackIndex + 1) %
    JSON.parse(localStorage.getItem(tracksCache)).length;
  setTrack(currentTrackIndex);

  if (isPlaying) {
    audioElement.play();
  }
};

const playPreviousTrack = () => {
  currentTrackIndex =
    (currentTrackIndex - 1) %
    JSON.parse(localStorage.getItem(tracksCache)).length;
  setTrack(currentTrackIndex);

  if (isPlaying) {
    audioElement.play();
  }
};

const updatePlayPauseButton = () => {
  const playPauseButton = document.getElementById("play-pause");
  playPauseButton.innerHTML = isPlaying
    ? '<i class="bi bi-pause-fill"></i>'
    : '<i class="bi bi-play-fill"></i>';
};

let animationFrameId;

const seekUpdate = () => {
  let current = audioElement.currentTime;
  let duration = audioElement.duration;

  if (!isNaN(duration)) {
    document.getElementById("progress-bar").max = duration;
    document.getElementById("progress-bar").value = current;
    document.getElementById("current-time").innerText = formatTime(current);
  }

  animationFrameId = requestAnimationFrame(seekUpdate);
};

const formatTime = (seconds) => {
  let min = Math.floor(seconds / 60);
  let sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
};

audioElement.onended = () => {
  cancelAnimationFrame(animationFrameId);
  playNextTrack();
};

document.addEventListener("DOMContentLoaded", () => {
  init();
  setTrack(currentTrackIndex);
  document.getElementById("prev").addEventListener("click", playPreviousTrack);
  document
    .getElementById("play-pause")
    .addEventListener("click", togglePlayPause);
  document.getElementById("next").addEventListener("click", playNextTrack);
  const prevButton = document.getElementById("button-prev");
  const nextButton = document.getElementById("button-next");

  prevButton.addEventListener("click", () => {
    changeAlbum(-1);
  });

  nextButton.addEventListener("click", () => {
    changeAlbum(1);
  });
});
