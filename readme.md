# Spotify clone


This project is a web platform that replicates some functionalities of Spotify, allowing users to explore artists, albums, and music tracks. The three main pages of the site are home.html, artist.html, and album.html, each providing an interactive and dynamic experience for users. The project was developed as part of the Full-Stack Developer course at Epicode, class FS0124.

#### Development Team members:
- Marcello Verduci
- Riccardo Del Piccolo
- Alessio Luise
- Luca Martella
- Francesco Naccari
- Sergio Nolasco


## Technologies Used
#### Markup and Programming Languages:
- HTML: Used for the structure of web pages.
- CSS: Used for styling and presenting web pages.
- JavaScript: Used to add interactivity and dynamism to web pages.
#### Libraries and Framework:
- Bootstrap: CSS framework used to create responsive and stylized layouts.
#### APIs and External Services:
- Deezer API: Used to obtain information about artists, albums, and music tracks.
- CORS Proxy: Used to handle CORS (Cross-Origin Resource Sharing) requests when accessing Deezer API resources.
#### Other Technologies:
- LocalStorage: Used to temporarily store data such as artists, albums, and tracks, reducing the number of API requests.
- Fetch API: Used to make HTTP requests to Deezer API to fetch and send data.
- GitHub: Hosting platform for Git repositories, used for versioning and project distribution.


### Home Page (home.html)
#### Features:
- Displays a list of featured artists.
- Allows searching for specific artists or tracks using the search bar.
- Shows recommended albums and new releases.
- Includes an audio player at the bottom of the page to listen to the latest tracks.
#### Dynamic Population:
- Featured artists are dynamically loaded using the Deezer API.
- Images of recommended albums and audio track previews are loaded dynamically.
- Real-time search results are displayed as you type in the search bar.
- The audio player automatically updates playing tracks and allows track change or pause.

### Artist Page (artist.html)
#### Features:
- Displays details of a specific artist, including the top 3 most popular tracks.
- Shows the artist's albums and related albums.
- Allows listening to track previews from the albums.
#### Dynamic Population:
- Uses Deezer API to get artist details and top popular tracks.
- Artist details and album images are dynamically loaded.
- Artist's albums and related albums are loaded dynamically.
- Allows listening to track previews from the albums without interrupting the currently playing track.

### Album Page (album.html)
#### Features:
- Displays details of a specific album, including the album tracks and artist information.
- Allows playing the tracks of the album, showing the title, artist, and track duration.
- Shows related albums with the option to explore them.
#### Dynamic Population:
- Uses Deezer API to get album details and album tracks.
- Album details and images are dynamically loaded.
- Displays album tracks with the option to listen, showing title and duration.
- Related albums are suggested and displayed dynamically.


### Dynamic Population of Pages
#### Use of Deezer APIs:
- Each page makes requests to the Deezer API to get information about artists, albums, and tracks.
- The obtained data is then used to dynamically populate the HTML pages.
- Artist images, album images, and track previews are loaded dynamically from the API.


### User Interaction Management:
- The pages allow users to interact with artists, albums, and tracks through play buttons, the search bar, and navigation controls.
- Track playback happens directly on the page without reloading the entire page.
- Users can explore artists, albums, and tracks in-depth without interruptions.


### Final Thoughts:
This project provides users with an experience similar to Spotify, allowing them to discover and listen to new artists and albums. Thanks to the use of Deezer APIs and the dynamic management of HTML pages through JavaScript, the user experience is smooth and engaging.


## Authors

- [@gmverduci](https://www.github.com/gmverduci)

- [@rdpic](https://www.github.com/rdpic)

- [@SerNo-dev](https://www.github.com/SerNo-dev)

- [@martella93](https://www.github.com/martella93)

- [@FrancescoNaccari](https://www.github.com/FrancescoNaccari)

- [@alex89luis](https://www.github.com/alex89luis)