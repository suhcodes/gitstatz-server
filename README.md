<h1>
  <div align="center">
    <img src="./public/logos/Gitstatz.png" />
  </div>
</h1>

**This is a simple backend solution to help convert the code received from github's OAuth into a JWT.**

---
##### :wrench: Configuration:
- After creating your own Github OAuth application, you'll need to set a few env variables. This can be done through creating a `.env` file with the following information:
```sh
SERVER_APP_CLIENT_ID="YOUR CLIENT ID"
SERVER_APP_CLIENT_SECRET_ID="YOUR CLIENT SECRET ID"
SERVER_APP_GITHUB_AUTH_URI="https://github.com/login/oauth"
SERVER_APP_GITHUB_API_URI="https://api.github.com"
SERVER_APP_PUBLIC_PATH="/"
SERVER_APP_CLIENT_REDIRECT_URL="http://localhost:3000/"
```
> There's an exemple file with all the variables named `.env.exemple`.

- Make sure that your Github OAuth callback URL is the same as the one you'll use for your API.

```
[YOUR_ROOT_URL]/api/auth/github
```

> :books: More about how to use github's api [here](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps)
