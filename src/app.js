import express from "express";
import axios from "axios";
import pkg from "lodash";
import dotenv from "dotenv"

dotenv.config();

const port = process.env.PORT || 4000;
const app = express();
const { get } = pkg;

/* 
  Set up github URL
  with client ID,
  secret client ID
  and cookie name
*/
const clientID = process.env.SERVER_APP_CLIENT_ID;
const secretClientID = process.env.SERVER_APP_CLIENT_SECRET_ID;
const githubAuth = process.env.SERVER_APP_GITHUB_AUTH_URI;
const COOKIE_NAME = "github-jwt";

const getGithubAuthToken = async ({ code }) => {
  const requestURL = `${githubAuth}/access_token?client_id=${clientID}&client_secret=${secretClientID}&code=${code}`;
  const githubToken = await axios
    .post(requestURL)
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
  const decoded = new URLSearchParams(githubToken);
  const token = decoded.get("access_token");
  return token;
};

app.get("/api/auth/github", async (req, res) => {
  const code = get(req, "query.code");
  const path = get(req, "query.path", "/");
  if (!code) {
    throw new Error();
  }
  const token = await getGithubAuthToken({ code });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    domain: "localhost",
  });
  res.redirect(`${path}`);
});

app.listen(port, () => {
  console.log("server running on port: ", port);
  console.log(
    "env vars \nSERVER_APP_CLIENT_ID: ",
    process.env.SERVER_APP_CLIENT_ID
  );
  console.log(
    "SERVER_APP_CLIENT_SECRET_ID: ",
    process.env.SERVER_APP_CLIENT_SECRET_ID
  );
  console.log(
    "SERVER_APP_GITHUB_AUTH_URI: ",
    process.env.SERVER_APP_GITHUB_AUTH_URI
  );
});
