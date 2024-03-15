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
let currentTrackIndex = 0;
let tracks = [];

const init = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const artistId = urlParams.get("artistId");

  if (artistId) {
    const artist = await fetchArtistDetails(artistId);
    const trackss = await fetchArtistTracks(artistId);
    const albums = await fetchArtistAlbums(artistId);

    if (
      artist &&
      trackss &&
      albums &&
      Array.isArray(trackss.data) &&
      trackss.data.length >= 3
    ) {
      displayArtistDetails(artist);
      displayTracksDetails(trackss);
      displayAlbumsDetails(albums);
    } else {
      console.error("Error: Invalid artist or tracks data.");
    }
  }
};

const fetchArtistDetails = async (artistId) => {
  const cachedArtists = JSON.parse(localStorage.getItem(artistsCache));
  if (cachedArtists && cachedArtists.length > 0) {
    const cachedArtist = cachedArtists.find(
      (artist) => artist.id === parseInt(artistId)
    );
    console.log("Cached Artists:", cachedArtists);
    console.log("Artist from cache:", cachedArtist);

    if (cachedArtist) {
      console.log("Artist found in cache:", cachedArtist);
      return cachedArtist;
    }
  }
  try {
    const response = await fetch(`${artistApi}${artistId}`, {
      method: "GET",
    });
    const artist = await response.json();
    console.log("Artist from API:", artist);

    if (artist) {
      const updatedCachedArtists = cachedArtists
        ? [...cachedArtists, artist]
        : [artist];
      localStorage.setItem(artistsCache, JSON.stringify(updatedCachedArtists));
    }

    return artist;
  } catch (error) {
    console.error("Error fetching artist details:", error);
    return null;
  }
};

const fetchArtistTracks = async (artistId) => {
  localStorage.removeItem("cachedTracks");

  try {
    const response = await fetch(`${trackApi}${artistId}/top?limit=3`, {
      method: "GET",
    });
    const fetchedTracks = await response.json();
    console.log("Tracks from API:", fetchedTracks.data);

    if (
      fetchedTracks &&
      Array.isArray(fetchedTracks.data) &&
      fetchedTracks.data.length >= 3
    ) {
      tracks = fetchedTracks.data;
      localStorage.setItem(`Tracks-${artistId}`, JSON.stringify(fetchedTracks));
      return fetchedTracks;
    } else {
      console.error("Error: Invalid tracks data format or length.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching artist tracks:", error);
    return null;
  }
};

const fetchArtistAlbums = async (artistId) => {
  const cachedAlbums = JSON.parse(localStorage.getItem("cachedAlbums")) || [];

  const artistAlbums = cachedAlbums.find(
    (album) => album.artistId === parseInt(artistId)
  );

  if (artistAlbums) {
    console.log("Albums found in cache:", artistAlbums.albums);
    return artistAlbums.albums;
  }

  const url = `${albumByArtist}${artistId}/albums`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    const albums = data.data.map((album) => ({
      id: album.id,
      title: album.title,
      cover: album.cover,
      cover_small: album.cover_small,
      cover_medium: album.cover_medium,
      cover_big: album.cover_big,
      cover_xl: album.cover_xl,
      md5_image: album.md5_image,
      tracklist: album.tracklist,
      type: album.type,
    }));

    const newCachedAlbums = [{ artistId, albums }];
    localStorage.setItem("cachedAlbums", JSON.stringify(newCachedAlbums));

    console.log("Albums fetched from API:", albums);
    return albums;
  } catch (error) {
    console.error("Error fetching albums:", error);
    return null;
  }
};

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
  return `${minutes}:${formattedSeconds}`;
};

const displayArtistDetails = (artist) => {
  const artistNameElement = document.getElementById("artist-name");
  const artistImageElement = document.getElementById("artist-image");
  const artistFollowersElement = document.getElementById("artist-followers");
  const artistAlbumsElement = document.getElementById("artist-albums");

  if (artist) {
    artistNameElement.className = "display-3";
    artistNameElement.textContent = artist.name;
    artistImageElement.style.backgroundImage = `url(${artist.picture_xl})`;
    artistImageElement.style.backgroundSize = "cover";
    artistImageElement.style.backgroundRepeat = "no-repeat";
    artistFollowersElement.textContent = `${artist.nb_fan.toLocaleString(
      "it-IT",
      {
        maximumFractionDigits: 0,
      }
    )} ascoltatori mensili`;
    artistAlbumsElement.textContent = `${artist.nb_album} album`;
  } else {
    console.error("Error: Invalid artist data.");
  }
};

let currentPlayingTrack = null;

const displayTracksDetails = (tracks) => {
  tracks.data.forEach((track, index) => {
    track.index = index;
    const songElement = document.getElementById(`song-${index + 1}`);
    const albumElement = document.getElementById(`track-album-${index + 1}`);
    const durationElement = document.getElementById(`duration-${index + 1}`);

    songElement.textContent = track.title;
    albumElement.innerHTML = `<i class="bi bi-e-square"></i> ${track.album.title}`;
    durationElement.textContent = formatDuration(track.duration);

    const playPauseButton = document.createElement("button");
    playPauseButton.className =
      "btn btn-sm text-success ms-2 play-pause-btn";
    playPauseButton.innerHTML = '<i class="bi bi-play-fill"></i>';
    playPauseButton.setAttribute("data-track-id", `track-${index + 1}`);

    durationElement.parentNode.insertBefore(
      playPauseButton,
      durationElement.nextSibling
    );

    playPauseButton.addEventListener("click", function () {
      const trackId = this.getAttribute("data-track-id");

      if (currentPlayingTrack === trackId && !currentAudio.paused) {
        currentAudio.pause();
        this.innerHTML = '<i class="bi bi-play-fill"></i>';
      } else {
        if (currentPlayingTrack !== trackId && currentAudio) {
          currentAudio.pause();
          document.querySelector(".bi-pause-fill").parentNode.innerHTML =
            '<i class="bi bi-play-fill"></i>';
        }

        playTrack(track);
        currentPlayingTrack = trackId;
        this.innerHTML = '<i class="bi bi-pause-fill"></i>';
      }
    });
  });
};

let currentAudio = null;

const playTrack = (track) => {
  if (!track || !track.preview) {
    console.error("Track object is undefined or missing preview URL");
    return;
  }

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  currentAudio = new Audio(track.preview);
  currentAudio.addEventListener("timeupdate", updateProgress);
  currentAudio.addEventListener("ended", resetPlayer);

  document
    .getElementById("volume-control")
    .addEventListener("input", function () {
      currentAudio.volume = this.value;
    });

  updatePlayerInfo(track);

  currentAudio
    .play()
    .catch((error) => console.error("Error playing the track:", error));
};

const playNextTrack = () => {
  currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  const nextTrack = tracks[currentTrackIndex];
  if (nextTrack) {
    playTrack(nextTrack);
  }
};

const playPreviousTrack = () => {
  currentTrackIndex =
    currentTrackIndex - 1 < 0 ? tracks.length - 1 : currentTrackIndex - 1;
  const prevTrack = tracks[currentTrackIndex];
  if (prevTrack) {
    playTrack(prevTrack);
  }
};

const updatePlayerInfo = (track) => {
  document.getElementById("track-title").textContent = track.title;
  document.getElementById("track-artist").textContent = track.artist.name;
  document.getElementById("total-duration").textContent = formatDuration(
    track.duration
  );

  const playPauseButton = document.getElementById("play-pause");
  playPauseButton.innerHTML = '<i class="bi bi-pause-fill"></i>';
  playPauseButton.onclick = () => {
    if (currentAudio.paused) {
      currentAudio.play();
      playPauseButton.innerHTML = '<i class="bi bi-pause-fill"></i>';
    } else {
      currentAudio.pause();
      playPauseButton.innerHTML = '<i class="bi bi-play-fill"></i>';
    }
  };
};

const updateProgress = () => {
  if (!currentAudio) return;
  const progressBar = document.getElementById("progress-bar");
  const currentTimeElement = document.getElementById("current-time");
  const progressValue =
    (currentAudio.currentTime / currentAudio.duration) * 100;

  progressBar.value = progressValue;
  currentTimeElement.textContent = formatDuration(
    Math.floor(currentAudio.currentTime)
  );

  progressBar.addEventListener("input", () => {
    const seekTime = (progressBar.value / 100) * currentAudio.duration;
    currentAudio.currentTime = seekTime;
  });
};

const resetPlayer = () => {
  document.getElementById("progress-bar").value = 0;
  document.getElementById("current-time").textContent = "0:00";
  document.getElementById("play-pause").innerHTML =
    '<i class="bi bi-play-fill"></i>';
};

const displayAlbumsDetails = (albums) => {
  const container = document.getElementById("container-cards-album");
  container.innerHTML = "";
  if (!container) {
    console.error("Container not found");
    return;
  }

  const uniqueAlbums = [];
  const addedIds = new Set();

  for (let i = 0; i < albums.length && uniqueAlbums.length < 8; i++) {
    const album = albums[i];
    if (!addedIds.has(album.id)) {
      uniqueAlbums.push(album);
      addedIds.add(album.id);
    }
  }

  uniqueAlbums.forEach((album) => {
    const card = document.createElement("div");
    card.classList.add("col-md-3", "mb-4");

    card.innerHTML = `
        <div class="card h-100">
          <a href="${album.link}" class="text-decoration-none"><img src="${album.cover_medium}" class="card-img-top h-100" alt="${album.title}">
            <div class="card-body d-flex flex-column justify-content-center align-items-center text-center">
              <h4 class="card-title text-white fs-5">${album.title}</h4></a>
            </div>
          </div>
        `;

    container.appendChild(card);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  init();

  document.getElementById("prev").addEventListener("click", playPreviousTrack);
  document.getElementById("next").addEventListener("click", playNextTrack);

  const prevButton = document.getElementById("button-prev");
  const nextButton = document.getElementById("button-next");

  prevButton.addEventListener("click", () => {
    changeArtist(-1);
  });

  nextButton.addEventListener("click", () => {
    changeArtist(1);
  });
});

const changeArtist = (increment) => {
  const urlParams = new URLSearchParams(window.location.search);
  let artistId = urlParams.get("artistId");

  if (artistId) {
    artistId = parseInt(artistId) + increment;
    const newUrl =
      window.location.origin +
      window.location.pathname +
      `?artistId=${artistId}`;
    window.history.pushState({ path: newUrl }, "", newUrl);

    init();
  }
};
