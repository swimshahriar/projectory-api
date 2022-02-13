### Live 🔥

API Documentation: [Click Here](https://documenter.getpostman.com/view/10469502/U16nM5K1)
<br>

### Getting Started 👨‍💻

#### 1. Download or Cloning ⬇️

First, download or clone the repository to your local machine. For cloning execute `git clone https://github.com/swimshahriar/projectory-api.git`.

#### 2. Installing Packages 🗳

Execute `npm install` or `yarn install` and it will download the packages locally.

**Note: Make sure you have nodejs installed in your machine. If you want to run via yarn then you have to install yarn too.**

#### 3. Starting the development server 🏁

Execute `npm run dev` or `yarn run dev` and it will open the development server on the localhost.

### Environment Variables 📄

Rename the file `.env.example` to `.env` and fill out the varriables.

```
NODE_ENV=production
MONGO_URI=

JWT_SECRET=
JWT_EXPIRES_IN=15d

NODE_MAILER_USERNAME=
CLIENT_ID=
CLIENT_SECRET=
CLIENT_REDIRECT_URI=https://developers.google.com/oauthplayground
REFRESH_TOKEN=
FRONT_END_URL=http://localhost:3000

# cloudinary details
CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_SECRET=

# stripe
STRIPE_KEY=
```

### Docker Setup
Fill the `environments` in the `docker-compose.yml` file. Then run `docker compose up`. You can access the server at port `4000` on your local machine.

Note: Make sure you have installed `Docker` in your machine.

### Links 🔗

- Frontend Repo: [Click Here](https://github.com/swimshahriar/projectory-frontend) <br/>

- Socket Server Repo: [Click Here](https://github.com/swimshahriar/projectory-socket-server) <br/>
