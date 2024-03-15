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
// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
      const trackCard = cardTracks(track);
      console.log(allTracks);
      tracksCardContainer.appendChild(trackCard);
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

  const fetchedArtists = []; 

  const randomArtistId = () => {
    const randomIndex = Math.floor(Math.random() * artists.length);
    return artists[randomIndex];
  };

  const fetchArtist = async (artistId) => {
    try {
      const response = await fetch(`${artistApi}${artistId}`, {
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
      artist.id = artistId;
      return artist;
    } catch (error) {
      console.error("Error fetching artist:", error);
      return null;
    }
  };

  const fetchUniqueArtist = async () => {
    let artistId = randomArtistId();
    while (fetchedArtists.includes(artistId)) {
      
      artistId = randomArtistId();
    }
    fetchedArtists.push(artistId); 
    const artist = await fetchArtist(artistId);
    return artist;
  };

  try {
    // await delay(0);
    const artist = await fetchUniqueArtist();
    return artist;
  } catch (error) {
    console.error("Error fetching artist:", error);
    return null;
  }
};



const loadRandomArtists = async () => {
  let fetchedArtists = [];
  const selectedArtistIds = new Set();

  while (fetchedArtists.length < 10) {
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

  const artistsContainer1 = document.getElementById("container-cards-artista");
  const artistsContainer2 = document.getElementById("container-cards-artista-2");
  artistsContainer1.innerHTML = "";
  artistsContainer2.innerHTML = "";

  const firstGroup = fetchedArtists.slice(0, 5);
  const secondGroup = fetchedArtists.slice(5);

  firstGroup.forEach((artist) => {
    const artistElement = createArtistCard(artist);
    artistsContainer1.appendChild(artistElement);
  });

  secondGroup.forEach((artist) => {
    const artistElement = createArtistCard(artist);
    artistsContainer2.appendChild(artistElement);
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
  card.className = "card col-2 mx-1 mb-4 text-center altezza p-3 position-relative";
  card.setAttribute("style", "width: 10rem");

  const image = document.createElement("img");
  image.src = artist.picture_big;
  image.className = "card-img-top my-3 m rounded-circle";

  const cardBody = document.createElement("div");
  cardBody.className = "card-body p-0";

  const name = document.createElement("h5");
  name.innerHTML = artist.name;
  name.className = "card-title overfooter fs-7 mb-0 pb-1 lh-1";
  name.addEventListener("click", () => {
    window.location.href = `artist.html?artistId=${artist.id}`;
  });



  const button = document.createElement("button");
  button.type = "button";
  button.className = "rounded-5 btn text-success fs-3 position-absolute end-0";
  button.innerHTML = '<i class="bi bi-play-circle"></i>';


  button.addEventListener("click", () => {

  });

  card.appendChild(image); 
   card.appendChild(button);
  cardBody.append(name); 
  card.appendChild(cardBody);

  return card;
};

const createAlbumCard = (album) => {
  const card = document.createElement("div");
  card.className = "card col-2 mx-1 mb-4 text-center overfooter";
  card.setAttribute("style", "width: 10rem");
  card.addEventListener("click", () => {
    window.location.href = `album.html?albumId=${album.id}`;
  });


  const image = document.createElement("img");
  image.src = album.cover_medium;
  image.className = "card-img-top mt-3 ";

  const cardBody = document.createElement("div");
  cardBody.className = "card-body ";

  const title = document.createElement("h5");
  title.innerText = album.title;
  title.className = "card-title  grandezza";


  card.appendChild(image);
  cardBody.append(title);
  card.appendChild(cardBody);
  console.log(album);
  return card;
};

const loadRandomAlbums = async (artistName) => {
  try {
    // await delay(0);

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
    // await delay(0);

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
    console.log('DATSAAAAA: '+ data.data)
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

const cardTracks = (track) => {
    const card = document.createElement("div");
    card.className = "card col-2 mx-1 mb-4 text-center cardColor overfooter";
    card.setAttribute("style", "width: 10rem");

    const image = document.createElement("img");
    image.className = "card-img-top mt-3 rounded-circle";
    image.src = track.album.cover_medium;
    card.appendChild(image);

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const name = document.createElement("h5");
    name.className = "card-title  grandezza ";
    name.innerText = track.title;
    cardBody.appendChild(name);

    const text = document.createElement("p");
    text.className = "card-text  textbluu fw-bold";
    text.innerText = track.artist.name;
    cardBody.appendChild(text);

    card.appendChild(cardBody);

    card.addEventListener("click", function() {
        playTrack(track);
    });

    return card;
};

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const mainContainer = document.getElementById("main-container");
const searchButton = document.getElementById("search-button");

const invisibile = document.getElementById("invisibile");
const invisibile1 = document.getElementById("invisibile1");
const invisibile2 = document.getElementById("invisibile2");
const invisibile3 = document.getElementById("invisibile3");

searchInput.addEventListener("click", () => {
  invisibile.style.display = "none";
  invisibile1.style.display = "none";
  invisibile2.style.display = "none";
  invisibile3.style.display = "none";
  const searchImg = document.createElement("div");
  searchImg.classList.add("search-height");

  searchImg.style.background = "url('../assets/img-generi/generi.png')";
  searchImg.style.height = "700px";
  searchImg.style.marginTop = "50px";

  mainContainer.appendChild(searchImg);
});

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
  albumCoverDiv.classList.add("col-4");
  const albumCoverImg = document.createElement("img");
  albumCoverImg.src = album.cover_medium;
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
  trackLink.className = "text-decoration-none text-white ";
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

    document.getElementById('track-title').innerText = track.title || "Unknown Title";
    document.getElementById('track-artist').innerText = track.artist.name || "Unknown Artist";
    document.getElementById('progress-bar').value = 0;
    document.getElementById('current-time').innerText = '0:00';
    document.getElementById('total-duration').innerText = formatTime(audioElement.duration);

    updateTimer = setInterval(seekUpdate, 1000);
    audioElement.onloadedmetadata = () => {
        document.getElementById('total-duration').innerText = formatTime(audioElement.duration);
    }

    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }

    audioElement.onloadedmetadata = () => {
        document.getElementById('total-duration').innerText = formatTime(audioElement.duration);
        seekUpdate();
    }

    playTrack(track.preview);

}

document.getElementById('progress-bar').addEventListener('input', (event) => {
    audioElement.currentTime = event.target.value;
})

document.getElementById('volume-control').addEventListener('input', (event) => {
    audioElement.volume = event.target.value;
});

const togglePlayPause = () => {
    if (isPlaying) {
        audioElement.pause();
        cancelAnimationFrame(animationFrameId);
    } else {
        audioElement.play().catch((error) => console.error("Error playing track:", error));
        seekUpdate();
    }

    isPlaying = !isPlaying;
    updatePlayPauseButton();
}

const playTrack = (track) => {
    if (!track || !track.preview) {
        console.error("Track URL is missing");
        return;
    }

    audioElement.src = track.preview;
    audioElement.play().catch(error => console.error("Error playing the track:", error));

    isPlaying = true;
    updatePlayPauseButton();

    document.getElementById('track-title').innerText = track.title || "Unknown Title";
    document.getElementById('track-artist').innerText = track.artist && track.artist.name ? track.artist.name : "Unknown Artist";

    if (updateTimer) {
        clearInterval(updateTimer);
    }

    updateTimer = setInterval(seekUpdate, 1000);
    audioElement.onloadedmetadata = () => {
        document.getElementById('total-duration').innerText = formatTime(audioElement.duration);
        seekUpdate();
    }

};

const playNextTrack = () => {
    currentTrackIndex = (currentTrackIndex + 1) % JSON.parse(localStorage.getItem(tracksCache)).length;
    setTrack(currentTrackIndex);

    if (isPlaying) {
        audioElement.play();
    }
}

const playPreviousTrack = () => {
    currentTrackIndex = (currentTrackIndex - 1) % JSON.parse(localStorage.getItem(tracksCache)).length;
    setTrack(currentTrackIndex);

    if (isPlaying) {
        audioElement.play();
    }
}

const updatePlayPauseButton = () => {
    const playPauseButton = document.getElementById('play-pause');
    playPauseButton.innerHTML = isPlaying ? '<i class="bi bi-pause-fill"></i>' : '<i class="bi bi-play-fill"></i>';
}

let animationFrameId;

const seekUpdate = () => {
    let current = audioElement.currentTime;
    let duration = audioElement.duration;

    if (!isNaN(duration)) {
        document.getElementById('progress-bar').max = duration;
        document.getElementById('progress-bar').value = current;
        document.getElementById('current-time').innerText = formatTime(current);
    }

    animationFrameId = requestAnimationFrame(seekUpdate);
}

const formatTime = (seconds) => {
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

audioElement.onended = () => {
    cancelAnimationFrame(animationFrameId);
    playNextTrack();
}

document.addEventListener("DOMContentLoaded", () => {
    init();
    setTrack(currentTrackIndex);
    document.getElementById('prev').addEventListener('click', playPreviousTrack);
    document.getElementById('play-pause').addEventListener('click', togglePlayPause);
    document.getElementById('next').addEventListener('click', playNextTrack);
});


