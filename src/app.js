import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import pkg from "lodash";

const port = process.env.PORT || 4000;
const env = dotenv.config();
const app = express();
const { get } = pkg;

/* 
  Set up github URL
  with client ID,
  secret client ID
  and code
*/
const clientID = process.env.SERVER_APP_CLIENT_ID;
const secretClientID = process.env.SERVER_APP_CLIENT_SECRET_ID;
const githubAuth = process.env.SERVER_APP_GITHUB_AUTH_URI;
const redirectURL = process.env.SERVER_APP_CLIENT_REDIRECT_URL;

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

app.get("/api/auth/github", (req, res) => {
  const code = get(req, "query.code");
  const path = get(req, "query.path", "/");
  if (!code) {
    throw new Error({ message: "No code :(", code: 400 });
  }
  return getGithubAuthToken({ code })
    .then((token) => {
      res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        domain: "localhost",
      });
      res.redirect(`${redirectURL}${path}`);
    })
    .catch((err) => {
      throw err;
    });
});

app.get("/", (req, res) => {
  res.send("Olá! Essa é a API do gitstatz :)");
});

app.listen(port, () => {});
