Sports League Web UI
This is a fun project where you can explore building a browser-based Single Page Application (SPA) that retrieves data from a backend API to generate and display a leaderboard based on match results. The application consists of a Schedule Page, a Leaderboard Page, and a 404 Not Found error page.
Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [API Details](#api-details)
- [Visual Style Guide](#visual-style-guide)
- [Usage](#usage)
- [Tests](#tests)
- [Contributing](#contributing)
- [License](#license)

Features
- **Schedule Page**: Displays a list of matches with details such as match date, stadium, teams, and scores.
- **Leaderboard Page**: Generates a leaderboard based on match results, ordered by points with tiebreakers including head-to-head points, goal difference, and goals scored.
- **404 Not Found Page**: Custom error page displayed for undefined routes.

Technologies Used
- **Frontend**: Vue.js
- **CSS**: Custom styles with variables for easy theming and consistency.
- **Backend API**: Simple RESTful API with endpoints to fetch the API version, access token, and match data.

Setup and Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/luksha6/sports-league-web-ui.git
   cd sports-league-web-ui
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run the backend mock server:**
   ```bash
   npx json-fake-server -m dev-mock-server-config.json
   ```
   The backend will be accessible at `http://localhost:3001`.

4. **Start the application:**
   ```bash
   npm start
   ```
5. **Access the application:**
Open your browser and navigate to `http://localhost:3000`.
API Details
- **Base URL**: `http://localhost:3001`

- **Endpoints**:
  - **GET /api/version**: Fetches the API version. No authorization required.
  - **GET /api/v1/getAccessToken**: Retrieves an access token. No authorization required.
  - **GET /api/v1/getAllMatches**: Retrieves all matches. Requires Bearer Token authorization.
Visual Style Guide
It is important for the created UI to look as close to the above screenshots as possible. To help with that here are some technical details about the UI design: 

- All needed graphics (such as logo, icons, "404" image) are available in the project repository already.
- You can use any CSS Framework you like or not use one at all - as long as the final look is as in the screenshots above.
- **Primary font family**: 'Open Sans', sans-serif.
- **Font sizes**:
  - Font size in the menu is 16px.
  - Font size in headings on pages is 24px.
  - Font size in table headers is 12px.
  - Font size for non-bolded table cells is 14px.
  - Font size for bolded table cells is 16px.
- **Font colors**:
  - Font color in the menu is #FFFFFF.
  - Font color in page headings is #182C62.
  - Font color in tables is #4B5C68.
  - Font color in the footer is #4B5C68.
- **Background colors**:
  - Page header background color is #025FEB.
  - Table header background and table border colors are #E4EDF2.
  - Background color for even rows on the schedule page is #F6F7F7.
  - Page footer background color is #F6F7F7.
- **Date/Time column** is formatted as "D.M.YYYY hh:mm" by following the W3C Date/Time Formatting formatting rules.
- **Flag images** should be taken from Country Flags API.
- The **404 image** is displayed in its original size.
