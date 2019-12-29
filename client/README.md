![StreetHack](../.github/logo.png)

# Front-End

## Live Demo

A live demonstration is available at [streethack.ghosh.pro](https://streethack.ghosh.pro) and runs on an Ubuntu 18.04 server hosted on Hetzner Cloud.

## Views

### Dashboard
Requests information about the currently authenticated user and sets a key in the `localStorage` of the browser. During the same time, it loads the list of hackathons and the leaderboard via the back-end APIs. Displays a slider of Challenges, the leaderboard and a form for sending invites.

### Profile
Displays an user's profile and provides access to export the profile as JSON, a PDF of resume generated from user's profile data and links to edit, delete or deactivate one's own profile. These features are only available if user is viewing own profile.

## Components

### Loader
CSS Loader for better UX.

### Navbar
Navigation bar with logo on the top left and buttons on the right. Dynamically changes button layouts with user authentication services.

### Container
Generic container with CSS3 layout.

### Footer
Generic footer with CSS3 layout.

### Slider
CSS3 Slider which iterates over children that are passed to it.

### Card
Utilizes data available from the API to construct a card for Hackathons. Array of these cards is passed to a Slider component.

## Available Scripts

In the project directory, you can run the following npm scripts:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.
The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!
