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
    const albumTotalDurationElement = document.getElementById("album-total-duration");
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
      row.innerHTML = `
        <th scope="row">${index + 1}</th>
        <td><a href="${track.link}" target="_blank">${track.title}</a></td>
        <td></td>
        <td class="text-end">${formatDuration(track.duration)}</td>
      `;
      tbody.appendChild(row);
    });
    const relatedAlbums = album.related_albums || [];
    if (relatedAlbums.length === 0) {
      container.innerHTML = "<p>Nessun album correlato disponibile</p>";
      return;
    }
  
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

document.addEventListener("DOMContentLoaded", () => {
  init();

  const prevButton = document.getElementById("button-prev");
  const nextButton = document.getElementById("button-next");

  prevButton.addEventListener("click", () => {
    changeAlbum(-1);
  });

  nextButton.addEventListener("click", () => {
    changeAlbum(1);
  });
});

const changeAlbum = (increment) => {
  const urlParams = new URLSearchParams(window.location.search);
  let albumId = urlParams.get("albumId");

  if (albumId) {
    albumId = parseInt(albumId) + increment;
    const newUrl =
      window.location.origin +
      window.location.pathname +
      `?albumId=${albumId}`;
    window.history.pushState({ path: newUrl }, "", newUrl);

    init();
  }
};
