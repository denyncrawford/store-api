# 🎡 Graviton Store's API

The Graviton's Store API (GSA) is a service as a RESTful API that provides methods for obtaining, modifying and publishing plugins in the graviton store.

Hosted in https://graviton-api.herokuapp.com/
You can tast this version at https://graviton-api-v2.herokuapp.com/

## 📖 Usage (^2.0.0): 

### Plugin API Methods

| Method | Endpoint | Description | Access |
| ------------- | ------------- | ----- | ---- |
| GET | / | Get session basic information | Private |
| GET | /api/ | Get API information | Public |
| GET | /api/plugins/ | Get the whole list of plugin ids | Public / Limited |
| GET | /api/plugins/:pluginID | Get plugin info by it's id | Public / Limited |
| DELETE | /api/plugins/:pluginID/ | Remove a plugin by it's id | Private |
| POST | /api/plugins/publish/ | Register or Update a plugin | Private |
| GET | /api/plugins/:pluginID/download | Direct plugin download (last release) | Public |
| GET | /api/plugins/:pluginID/download/:release | Direct plugin download by release | Public |

### Auth Web Endpoints

To use some private endpoints of the API service as well as the plugin publishing API, you must generate an APIKEY by logging in with your Github account.

> You should not use this endpoints for any programmatically purpose, only works on browser.

| Method | Endpoint | Description |
| --------------- | ------------- | ------ |
| GET | /auth/github/ | Login with the user Github Account |
| GET | /auth/github/callback | Serialize the user's session data |
| GET | /auth/logout | Deserialize and estroy the session. |

> This will redirect you to your profile on the Graviton site, then you will see your APIKEY. 

The API KEY allows user identification and ensures the data transport. It also isolates API transactions using a permission model to avoid modifying other users' data.

## 📖 Alternative usage:

> To support the older versions of the Graviton ecosystem, we still keep the old endpoints, we do not recommend their use as their support will end eventually.

| Method | Endpoint | Description |
| ------------- | ------------- | ----- |
| GET | / | Get API information |
| GET | /plugins/ | Get the whole list of plugin ids |
| GET | /plugins/:pluginID | Get plugin info by it's id |

## 🛠️ Development

1. Install all the dependencies
```sh
$ npm install
```

2. Create your `.env` file on root.

```sh
DATABASE_PASSWORD=<DATABASE-PASSWORD>
GITHUB_CLIENT_ID=<OAUTH-GITHUB-CLIENT-ID>
GITHUB_CLIENT_SECRET=<OAUTH-GITHUB-CLIENT-SECRET>
SESSION_SECRET=<SESSION-SECRET>
HOST=http://localhost:2035 OR <DOMAIN-NAME>
```

3. Start the project in dev mode. This command will start a development server.
```sh
$ npm run dev
```
> Please note that we do not provide any DB Instances / Clusters for public development, you need to get your own MongoDB datastore and credentials (***You must set all your private stuff placing them on the .env file at the root of the project***).

## 🔌 Publishing Plugins

## REST

1. Get your [API KEY](http://graviton.netlify.app).
2. Write a POST request on `https://graviton-api.herokuapp.com/api/plugins/publish` with the following body:
```json
{
  "name": "<PLUGIN-NAME>",
  "id": "<ID-FOR-PLUGIN>",
  "author": "<YOUR-NAME>",
  "description": "<DESCRIPTION>",
  "repository": "<LINK-TO-PLUGIN-REPO>",
  "releases": [ 
    {"version": "<PLUGIN-VERSION>"}
  ],
   "minTarget": "<MINIMUM-GRAVITON-VERSION>",
   "target": "<GRAVITON-VERSION>",
   "url": "<LINK-TO-PLUGIN-RELEASE-ZIP>"
}
```
3. Add the required headers to the request:

```json
{
  "Content-type":"application/json",
  "Authorization": "Api-Key <YOUR-API-KEY>"
}
```

4. Get the status response.

##### About the Json body information above
* `id, repository, url`: __cannot__ contain whitespace
* `releases` is an array, so you can have multiple releases
* To create a release for your plugin:
  1. On your plugin's repository homepage, create a release and upload a `.zip` folder with only functional files for the plugin
  2. Once the release is published, copy the download-url, and release version of the release and paste into the `url`, `version` fields above respectively.
* `minTarget` will be the minimum version of Graviton(`X.X.X`)
* `target` will be a more specific target, you can for example use `2` to target Graviton v2.X.X, or `2.1` for v2.1.X



## 🎎 Contributing
#### Before commiting on git

* Get all your linting error (with ESlint)
```sh
$ npm run lint
```

* Fix all your linting error automatically (with ESlint)
```sh
$ npm run lint:fix
```

## 🧦 Tests

To run the tests, run:
```shell
$ npm test
```

## 💾 Production

1. Install all the dependencies
```sh
$ npm install
```

2. Start the project in production mode.
```sh
$ npm run start
```

## Contributors 🤠
LucasAlt [Github](https://github.com/LucasCtrl)
David Niederweis [Github](https://github.com/DJN1)
Denyn Crawford [Github](https://github.com/denyncrawford)
