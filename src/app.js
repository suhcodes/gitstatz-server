import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import pkg from "lodash";

const port = process.env.PORT || 4000
const env = dotenv.config().parsed;
const app = express();
const { get } = pkg;

/* 
  Set up github URL
  with client ID,
  secret client ID
  and code
*/
const clientID = env.SERVER_APP_CLIENT_ID;
const secretClientID = env.SERVER_APP_CLIENT_SECRET_ID;
const githubAuth = env.SERVER_APP_GITHUB_AUTH_URI;
const redirectURL = env.SERVER_APP_CLIENT_REDIRECT_URL;

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
    throw new Error({ message: "No code :(", code: 400 });
  }
  const token = await getGithubAuthToken({ code });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    domain: "localhost",
  });
  res.redirect(`${redirectURL}${path}`);
});

app.listen(port, () => {});
