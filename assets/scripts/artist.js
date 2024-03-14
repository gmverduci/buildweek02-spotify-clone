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
  const artistId = urlParams.get("artistId");

  if (artistId) {
    const artist = await fetchArtistDetails(artistId);
    const tracks = await fetchArtistTracks(artistId);
    const albums = await fetchArtistAlbums(artistId);

    if (
      artist &&
      tracks &&
      albums &&
      Array.isArray(tracks.data) &&
      tracks.data.length >= 3
    ) {
      displayArtistDetails(artist);
      displayTracksDetails(tracks);
      displayAlbumsDetails(albums);
    } else {
      console.error("Error: Invalid artist or tracks data.");
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
    const tracks = await response.json();
    console.log("Tracks from API:", tracks);

    if (tracks && Array.isArray(tracks.data) && tracks.data.length >= 3) {
      localStorage.setItem(`Tracks-${artistId}`, JSON.stringify(tracks));
      return tracks;
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

const displayTracksDetails = (tracks) => {
  const songs = [];
  const durations = [];
  const trackAlbums = [];

  for (let i = 0; i < 3; i++) {
    songs[i] = document.getElementById(`song-${i + 1}`);
    durations[i] = document.getElementById(`duration-${i + 1}`);
    trackAlbums[i] = document.getElementById(`track-album-${i + 1}`);
  }

  if (
    songs.length === 3 &&
    durations.length === 3 &&
    trackAlbums.length === 3 &&
    tracks &&
    Array.isArray(tracks.data) &&
    tracks.data.length >= 3
  ) {
    for (let i = 0; i < 3; i++) {
      songs[i].textContent = tracks.data[i].title;
      durations[i].textContent = formatDuration(tracks.data[i].duration);
      trackAlbums[i].textContent = tracks.data[i].album.title;
    }
  } else {
    console.error(
      "Error: One or more elements not found or invalid track data."
    );
  }
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
});
