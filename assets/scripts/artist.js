document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const artistId = urlParams.get("artistId");

  if (artistId) {
    fetchArtistDetails(artistId);
  }
});

const fetchArtistDetails = async (artistId) => {
    const cachedArtist = localStorage.getItem(`artist-${artistId}`);
    if (cachedArtist) {
       const artist = JSON.parse(cachedArtist);
       displayArtistDetails(artist);
    } else {
       try {
         const response = await fetch(`${artistApi}${randomArtist}`, {
            method: "GET",
          });
         const artist = await response.json();
         localStorage.setItem(`artist-${artistId}`, JSON.stringify(artist));
         displayArtistDetails(artist);
       } catch (error) {
         console.error("Error fetching artist details:", error);
       }
    }
   };

const displayArtistDetails = (artist) => {
  const artistNameElement = document.querySelector(".artist-name");
  const artistImageElement = document.querySelector(".artist-image");
  const artistFollowersElement = document.querySelector(".artist-followers");
  const artistAlbumsElement = document.querySelector(".artist-albums");

  artistNameElement.textContent = artist.name;
  artistImageElement.src = artist.picture_xl;
  artistFollowersElement.textContent = `${artist.nb_fan} ascoltatori mensili`;
  artistAlbumsElement.textContent = `${artist.nb_album} album`;
};


//memo per domani: andare a riguardare come minchia si importano i moduli javascript