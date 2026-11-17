# Aurora Hotel

Aurora Hotel is a responsive hospitality website for guests planning a visit to Astana. It uses HTML, CSS, JavaScript, jQuery and Bootstrap CSS.

## Pages

- `index.html`: Home, guest welcome and Astana weather
- `rooms.html`: Room catalogue, search, category filters and wishlist
- `about.html`: Hotel facilities and information
- `booking.html`: Stay preferences and FAQ
- `stay-review.html`: Stay summary
- `contact.html`: Contact details and enquiry preparation
- `register.html`: Guest account registration
- `login.html`: Guest account login
- `profile.html`: Guest details and logout

## Run the project

Serve this directory as the root of a static website. HTTPS hosting or a local web server at localhost is recommended because account password verification uses the browser's Web Crypto API. For local development, run `python -m http.server 8000` in this directory and open `http://localhost:8000/`. No server-side application or npm installation is required. jQuery and Bootstrap CSS are included locally.

## Features

The shared menu and light/dark theme work across pages. The room catalogue combines text search and category filters. The wishlist and guest accounts use browser local storage; stay preferences use session storage. The account system is a frontend simulation with salted password verifiers, not a secure server-side authentication service. Contact enquiries open the visitor's email application and the stay review does not create an actual reservation. The weather panel retrieves current Astana conditions from Open-Meteo and handles unavailable responses.

## Team

- Meizamkhan Zhanbyrbayev
- Ayazhan Nurtaza
- Dilnaz Toktanova

Group: MT-2502
