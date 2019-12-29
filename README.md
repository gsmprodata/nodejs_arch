![StreetHack](./.github/logo.png)

# Backend

## Live Demo

A live demonstration is available at [streethack.ghosh.pro](https://streethack.ghosh.pro) and runs on an Ubuntu 18.04 server hosted on Hetzner Cloud.


## Quick Start
Assuming this is run on the server which is pointed by the domain [streethack.ghosh.pro](https://streethack.ghosh.pro) and has the proxy server set-up.

```bash
git clone https://github.com/sudiptog81/streethack.git
cd streethack
npm install
pm2 start server.js
```

## Standard User Flow

### Front-End

`/register => /verifyEmail => /login => /dashboard`

### API

`/api/users/auth => /api/users/current (jwt token in response)` 

## NGINX Configuration

The proxy server configuration for serving the application is similar to the following one.

```nginx
server {
    server_name streethack.ghosh.pro;

    location / {
          proxy_pass http://localhost:5011/;
          proxy_buffering off;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection 'upgrade';
          proxy_set_header Host $host;
          proxy_cache_bypass $http_upgrade;
     }
 
      listen [::]:443 ssl; # managed by Certbot
      listen 443 ssl; # managed by Certbot
      ssl_certificate /etc/letsencrypt/live/streethack.ghosh.pro-0001/fullchain.pem; # managed by Certbot
      ssl_certificate_key /etc/letsencrypt/live/streethack.ghosh.pro-0001/privkey.pem; # managed by Certbot
      include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
      ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
  
 }
```

## Environment Variables

These are the environment variables to be set in the `.env` file at the root of the project folder. These environment variables set currently are customized values for testing and development.

```bash
APP_URL="<app-url>"
MONGO_URI="<mongo-db-url>"
USER_AUTH_SECRET="<passport-auth-secret>"
SESSION_SECRET="<express-session-secret>"

SMTP_SRVR="<smtp-server-host>"
SMTP_FROM="<smtp-from-alias>"
SMTP_USER="<smtp-username>"
SMTP_PASS="<smtp-password>"

FB_APP_ID="<facebook-application-id>"
FB_APP_TOKEN="<facebook-application-token>"
FB_APP_SECRET="<facebook-application-secret>"

GH_CLIENT_ID="<github-client-id>"
GH_CLIENT_SECRET="<github-client-secret>"

GOOGLE_CLIENT_ID="<google-client-id>"
GOOGLE_CLIENT_SECRET="<google-client-secret>"

LINKEDIN_CLIENT_ID="<linkedin-client-id>"
LINKEDIN_CLIENT_SECRET="<linkedin-client-secret>"
```

An additional environment variable is currently required for ReactJS in the `client/.env` file:

```bash
REACT_APP_URL="<app-url>"
```

## Database Design

Models are placed in the `models` folder in the root of the project. The project currently uses MongoDB as the database management system and utilizes the Mongoose ORM for NodeJs.

```md
User
----
    - name
    - email
    - emailIsVerified
    - password
    - about
    - isDeactivated
    - regCodeRequired
    - profileImageUrl
    - following
    - followers
    - hackathonsRegisteredFor
    - id
    - facebookId
    - facebookUrl
    - githubId
    - githubUrl
    - googleId
    - googleUrl
    - linkedinId
    - linkedinUrl
    - interests
    - projects
    - previousInternships
    - previousWorkExperience
    - papersPublished
    - academicDetails
    - achievements
    - skills
    - contributions
    - githubUsername
    - timestamp

Hackathon
---------
    - title
    - coverImageUrl
    - description
    - postedBy
    - registeredUsers
    - karmaPointsOnCompletion
    - difficulty
    - steps
    - timestamps
```

## Controllers

### Authentication Controllers
Responsible for calling apt services for handling authentication-related tasks to expose itself as an API to the routes. Includes logic for authentication, verification and logout events.

### Registration Controllers
Responsible for creation of users in the databases using User Model CRUD Services and sending mails for email verification.

### Invitation Controllers
Responsible for handling invitation requests and invite-based authentication system including provision of unique invitation codes.

### Hackathon Controllers
TODO

### User Model CRUD Controllers
Responsible for exposing minute interfaces to interact with the User Model in the database. Handles retrieval, creation, updation, deletion of records and generation of documents based on user details.

## Services

### Authentication Service
Returns a JSON object containing user details other than the user password and a JWT token to be used for future API authentication.

### User Model CRUD Services
Collection of functions that create, retrieve, update, and delete users in the database.

### Mail Services
Sends and verifies authenticity of various mails that pertain to invitations, password reset intents and email verification use cases.

### Hackathon Model CRUD Services
Collection of functions that create, retrieve, update, and delete hackathons in the database.

## Helpers

### Error Handler
Maps errors thrown while accessing various endpoints and returns appropriate error messages.

### JWT Helper
Handles configurations defining routes to be exempted from JWT revocation-based autentication.

## HTTP Endpoints
The project currently uses the Express web framework with PassportJS and JSONWebToken authentication frameworks.

### Authentication APIs

#### E-Mail `/users/auth`
PassportJS handles this form of authentication using `LocalStrategy` with `email` and `password` being the credential fields.

#### Facebook `/auth/facebook`
PassportJS handles OAuth authentication using `FacebookStrategy` and is authorized for accessing the `id`, `emails`, `name`, `link`, `photos` fields.

#### GitHub `/auth/github`
PassportJS handles OAuth authentication using `GitHubStrategy` and is authorized for accessing the default profile fields as detailed by relevant documentation.

#### Google `/auth/google`
PassportJS handles OAuth authentication using `GoogleStrategy` and is authorized for accessing the fields in the `openid`, `email` and `profile` scopes as returned by the callback.

#### LinkedIn `/auth/linkedin`
PassportJS handles OAuth authentication using `LinkedInStrategy` and is authorized for accessing the `id`, `name`, and `emails` fields.

_**NOTE**_: The profile image with the highest resolution is automatically selected at login. 

### Social Authentication Callbacks

#### Facebook `/auth/facebook/callback`

#### GitHub `/auth/github/callback`

#### Google `/auth/google/callback`

#### LinkedIn `/auth/linkedin/callback`

### User Routes

#### POST `/api/users/resetPassword`
Sends a password reset mail to the user's registered e-mail address containing a link with an unique SHA256-HMAC token with a hexadecimal digest value hashed with user's e-mail address.

#### POST `/api/users/resetPassword/:id`
Resets the password of an user with the user ID found in the route parameter when the user is authenticated.

#### POST `/api/users/update/:id`
Updates profile fields of the user when the user is authenticated.

#### POST `/api/users/register`
Creates an user in the database and sends a verification email with an unique link. Throws an error if the user creation fails.

#### POST `/api/users/invite`
Sends an invite email to a new user with an unique invitation code.

#### GET `/api/users/logout`
Causes the currently authenticated user to logout of the session.

#### GET `/api/users/verifyEmail`
User's email is verified on this route by comparing the authenticity of the verification token as a query parameter.

#### GET `/api/users/resetPassword`
User's reset password claim is verified on this route by comparing the authenticity of the token.

#### GET `/api/users`
Returns a list of all users in the database.

#### GET `/api/users/current`
Returns the current user from the database whose ID is found from the PassportJS session object.

#### GET `/api/users/:id`
Returns details about a specific user.

#### GET `/api/users/deactivate:id`
Deactivates a particular user when the user is authenticated.

#### GET `/api/resume/:id`
Returns a PDF file formatted according to a HTML template with profile details.

#### DELETE `/api/users/:id`
Deletes a user from the database.

### Hackathon Routes

#### GET `/api/hackathons`
Returns a JSON response containing all hackathons in the database.

#### POST `/api/hackathons/add`
Adds a hackathon to the database with details passed as a JSON object with the request.

### Leaderboard Routes

#### GET `/api/leaderboard`
Returns a JSON response containing top four users sorted according to their Karma Points.

### Front-end Routes

#### `/`
Homepage.

#### `/enterprise`
Enterprise Offerings Page.

#### `/university`
University Offerings Page.

#### `/blockhack`
BlockHack Event Page.

#### `/hackathon`
Hackathon Offerings Page.

#### `/uhack`
UHack Event Page.

#### `/login`
Login Page.

#### `/register`
Registration Page.

#### `/forgotPassword`
Handles reset password intents when user is unable to remember the password but has access to the mailbox.

#### `/askForInvite`
View for a prospective user to request an invitation from an administrator.

#### `/buildProfile`
Page for editing and updating profile fields by an authenticated user/

#### `/dashboard`
Default redirection target which lists all hackathons and displays the leaderboard.

#### `/profile/:id`
For viewing profile of another user or of the current authenticated user.

#### `/requestInvite`
Sends an e-mail to the `SMTP_USER` with details of the interested user who wishes to request an invitation to the platform. The e-mail shall contain the name, institution, email address and the motivation of the user to join the platform.# nodejs_arch
