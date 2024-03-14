const artistsCache = "cachedArtists";
const albumCache = "cachedAlbums";
const tracksCache = "cachedTracks";
const trackApi = "https://striveschool-api.herokuapp.com/api/deezer/artist/";

const albumApi = "https://corsproxy.io/?https://api.deezer.com/album/";
const artistApi = "https://corsproxy.io/?https://api.deezer.com/artist/";
const searchApi = "https://striveschool-api.herokuapp.com/api/deezer/search?q=";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWVhZDUyMTJkN2IxMTAwMTkwZTZkY2IiLCJpYXQiOjE3MTAxNjg2MjcsImV4cCI6MTcxMTM3ODIyN30.Js9yWPVZ-_WVXu5nVOvuKTIW9yEyXbD3UJ5A-Deo6LA";

const artists = [
  719, 275373, 11, 13, 3381, 2468, 1005, 412, 848, 927, 636, 210, 176, 115, 863,
  1379, 637, 405, 415, 1154, 849, 868, 663, 847, 3307, 3350, 817, 808, 1723,
  687, 5292, 820, 1032, 239, 2048, 2799, 1658, 9052, 2025, 3, 2, 2519, 1309, 2449, 1342, 2059, 2337, 617, 997, 
];
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const init = async () => {
  localStorage.clear();

  console.log("Local Storage Support:", "localStorage" in window);
  console.log("Local Storage Usage:", localStorage.length);
  console.log("Local Storage Quota:", navigator.storage.estimate());

  try {
    await loadRandomArtists();
    const cachedArtists = JSON.parse(localStorage.getItem(artistsCache));
    let allAlbums = [];
    let allTracks = [];

    for (const artist of cachedArtists) {
      const artistId = artist.id;
      const artistName = artist.name;
      const albums = await loadRandomAlbums(artistName);
      allAlbums = allAlbums.concat(albums);
      const tracks = await loadRandomTracks(artistId);
      allTracks = allTracks.concat(tracks);
    }

    localStorage.setItem(albumCache, JSON.stringify(allAlbums));
    localStorage.setItem(tracksCache, JSON.stringify(allTracks));
    console.log(allAlbums);

    const albumContainer = document.getElementById("container-cards-album");
    albumContainer.innerHTML = "";

    allAlbums.forEach((album) => {
      const cards = createAlbumCard(album);
      albumContainer.appendChild(cards);
      console.log(allAlbums);
    });

    const tracksCardContainer = document.getElementById("tracksCardContainer");
    tracksCardContainer.innerHTML = "";
    allTracks.forEach((track) => {
      console.log(track.album);
      const tracks = cardTracks(track.album, track.artist);
      console.log(allTracks);
      tracksCardContainer.appendChild(tracks);
    });
  } catch (error) {
    console.error("Initialization error", error);
  }
};

const fetchRandomArtist = async () => {
  let cachedArtists = localStorage.getItem(artistsCache);
  if (cachedArtists) {
    return JSON.parse(cachedArtists);
  }

  const randomArtist = artists[Math.floor(Math.random() * artists.length)];
  try {
    await delay(0);

    const response = await fetch(`${artistApi}${randomArtist}`, {
      method: "GET",
    });
    if (!response.ok) {
      console.error(`Error fetching artist: ${response.statusText}`);
      return null;
    }
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Non-JSON response received");
      return null;
    }
    const artist = await response.json();
    artist.id = randomArtist;
    return artist;
  } catch (error) {
    console.error("Error fetching artist:", error);
    return null;
  }
};

const loadRandomArtists = async () => {
  let fetchedArtists = [];
  const selectedArtistIds = new Set();

  while (fetchedArtists.length < 7) {
    const randomIndex = Math.floor(Math.random() * artists.length);
    const randomArtistId = artists[randomIndex];

    if (!selectedArtistIds.has(randomArtistId)) {
      selectedArtistIds.add(randomArtistId);
      const artist = await fetchRandomArtist(randomArtistId);
      if (artist) {
        fetchedArtists.push(artist);
      }
    }
  }

  const artistsContainer = document.getElementById("container-cards-artista");
  artistsContainer.innerHTML = "";

  fetchedArtists.forEach((artist) => {
    const artistElement = createArtistCard(artist);
    artistsContainer.appendChild(artistElement);
  });
  console.log("Fetched artists before storing:", fetchedArtists);
  if (fetchedArtists.length > 0) {
    localStorage.setItem(artistsCache, JSON.stringify(fetchedArtists));
    console.log("Stored artists in local storage:", fetchedArtists);
  } else {
    console.error("No artists fetched successfully.");
  }
};

const createArtistCard = (artist) => {
  const card = document.createElement("div");
  card.className = "card col-2 mx-1 mb-4 text-center";
  card.setAttribute("style", "width: 10rem");

  const image = document.createElement("img");
  image.src = artist.picture_big;
  image.className = "card-img-top mt-3";

  const cardBody = document.createElement("div");
  cardBody.className = "card-body";

  const name = document.createElement("h5");
  name.innerHTML = artist.name;
  name.className = "card-title overfooter grandezza";
  name.addEventListener("click", () => {
    window.location.href = `artist.html?artistId=${artist.id}`;
  });

  const text = document.createElement("p");
  text.className = "card-text text-success";
  text.innerText = "Artista";

  card.appendChild(image);
  cardBody.append(name, text);
  card.appendChild(cardBody);

  return card;
};

const createAlbumCard = (album) => {
  const card = document.createElement("div");
  card.className = "card col-2 mx-1 mb-4 text-center";
  card.setAttribute("style", "width: 10 rem");

  const image = document.createElement("img");
  image.src = album.cover_xl;
  image.className = "card-img-top mt-3";

  const cardBody = document.createElement("div");
  cardBody.className = "card-body ";

  const title = document.createElement("h5");
  title.innerText = album.title;
  title.className = "card-title overfooter grandezza";

  card.appendChild(image);
  cardBody.append(title);
  card.appendChild(cardBody);
  console.log(album);
  return card;
};

const loadRandomAlbums = async (artistName) => {
  try {
    await delay(0);

    const response = await fetch(`${searchApi}${artistName}`, {
      method: "GET",
    });
    if (!response.ok) {
      console.error(`Error fetching albums: ${response.statusText}`);
      return null;
    }
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Non-JSON response received");
      return null;
    }
    const data = await response.json();
    let albums = [];
    data.data.forEach((index) => albums.push(index.album));
    console.log('Albums:', albums)

    if (albums.length > 0) {
      const randomIndex = Math.floor(Math.random() * albums.length);
      const album = albums[randomIndex];
      console.log("Fetched album:", album);
      return album;
    } else {
      console.error("No albums fetched successfully.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching albums:", error);
    return null;
  }
};

const loadRandomTracks = async (artistId) => {
  try {
    await delay(0);

    const response = await fetch(`${trackApi}${artistId}/top?limit=10`, {
      method: "GET",
    });
    if (!response.ok) {
      console.error(`Error fetching tracks: ${response.statusText}`);
      return null;
    }
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Non-JSON response received");
      return null;
    }
    const data = await response.json();
    if (data.data.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.data.length);
      const track = data.data[randomIndex];
      console.log("Fetched track:", track);
      return track;
    } else {
      console.error("No tracks fetched successfully.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching tracks:", error);
    return null;
  }
};

const cardTracks = (album, artist) => {
  const card = document.createElement("div");
  card.className = "card col-2 mx-1 mb-4 text-center cardColor ";
  card.setAttribute("style", "width: 10rem");

  const image = document.createElement("img");
  image.className = "card-img-top mt-3 rounded-circle";
  image.src = album.cover_xl;
  card.appendChild(image);

  const cardBody = document.createElement("div");
  cardBody.className = "card-body";

  const name = document.createElement("h5");
  name.className = "card-title overfooter grandezza ";
  name.innerText = album.title;
  cardBody.appendChild(name);

  const text = document.createElement("p");
  text.className = "card-text  textbluu fw-bold";
  text.innerText = artist.name;
  cardBody.appendChild(text);

  card.appendChild(cardBody);

  return card;
};

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const mainContainer = document.getElementById("main-container");
const searchButton = document.getElementById("search-button");

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const searchTerm = searchInput.value.trim();

  if (searchTerm === "") {
    alert("Please write something!");
    return;
  }

  try {
    const searchResults = await fetchSearchResults(searchTerm);
    displayResults(searchResults);
  } catch (error) {
    console.error("Search error:", error);
  }
});

searchButton.addEventListener("click", async (event) => {
  event.preventDefault();

  const searchTerm = searchInput.value.trim();

  if (searchTerm === "") {
    alert("Please write something!");
    return;
  }

  try {
    const searchResults = await fetchSearchResults(searchTerm);
    displayResults(searchResults);
  } catch (error) {
    console.error("Search error:", error);
  }
});

const fetchSearchResults = async (term) => {
  const response = await fetch(`${searchApi}${term}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  console.log(data);
  return data.data;
};

const displayResults = (results) => {
  mainContainer.innerHTML = "";

  if (results.length === 0) {
    mainContainer.innerHTML =
      "<p>These aren't the droids you're looking for.</p>";
    return;
  }

  results.forEach((result) => {
    const resultElement = createResultElement(result);
    mainContainer.appendChild(resultElement);
  });
};

const createResultElement = (result) => {
  const { id, title, link, artist, album } = result;

  const searchContainer = document.createElement("div");
  searchContainer.classList.add("container-fluid", "p-3");
  

  const resultDiv = document.createElement("div");
  resultDiv.classList.add("row", "d-flex", "result");

  const albumCoverDiv = document.createElement("div");
  albumCoverDiv.classList.add("col-5");
  const albumCoverImg = document.createElement("img");
  albumCoverImg.src = album.cover_xl;
  albumCoverImg.alt = `${album.title} Cover`;
  albumCoverImg.classList.add("img-fluid", "rounded" );
  albumCoverDiv.appendChild(albumCoverImg);
 
  const infoDiv = document.createElement("div");
  infoDiv.classList.add(
    "col-6",
    "d-flex",
    "flex-column",
    "ms-5"
  );

  const titleElement = document.createElement("h4");
  titleElement.className = "overfooter";
  titleElement.textContent = title;

  const artistLink = document.createElement("a");
  artistLink.className = "text-decoration-none text-success overfooter";
  artistLink.href = artist.link;
  artistLink.textContent = `Artist: ${artist.name}`;

  const albumLink = document.createElement("a");
  albumLink.className = "text-decoration-none text-success overfooter";
  albumLink.href = album.link;
  albumLink.textContent = `Album: ${album.title}`;

  const trackLink = document.createElement("a");
  trackLink.className = "text-decoration-none text-success ";
  trackLink.href = link;
  trackLink.textContent = "Open Track";

  infoDiv.appendChild(titleElement);
  infoDiv.appendChild(artistLink);
  infoDiv.appendChild(albumLink);
  infoDiv.appendChild(trackLink);

  resultDiv.appendChild(albumCoverDiv);
  resultDiv.appendChild(infoDiv);

  searchContainer.appendChild(resultDiv);

  return searchContainer;
};

document.addEventListener("DOMContentLoaded", init);


