Steps to set up a React WebApp project without create-react-app.

## Run `git init` and create a repository on GitHub

## Run `npm init`

## Create the app base structure

This example expects a structure like:

- [`src/index.html`](https://github.com/skedwards88/react-base/blob/main/src/index.html) that contains `<div id="root"></div>`

- [`src/App.js`](https://github.com/skedwards88/react-base/blob/main/src/App.js) that contains a JSX component called `App` that is exported

- [`src/index.js`](https://github.com/skedwards88/react-base/blob/main/src/index.js) that contains `ReactDOM.render(<App />, document.getElementById("root"));`. (You can omit the `if ("serviceWorker" in navigator)` part in the example file for now.)

- [`src/App.css`](https://github.com/skedwards88/react-base/blob/main/src/App.css) that contains styling used by `src/App.js`

- [`src/images`](https://github.com/skedwards88/react-base/blob/main/src/images) containing your favicon and other image assets

## Set up webpack/babel/react

### Install packages

`npm install react react-dom`

`npm install --save-dev @babel/core @babel/preset-react @babel/preset-env webpack style-loader css-loader babel-loader webpack-cli webpack-dev-server html-webpack-plugin`

### Create a `.babelrc` file

Create a `.babelrc` file at the root of your repo with these contents:

```json
{
  "presets": ["@babel/env", "@babel/preset-react"]
}
```

### Create a `webpack.config.js` file

Create a `webpack.config.js` file at the root of your repo with the following contents. If you did not follow the app structure outlined [above](#create-the-app-base-structure), you may need to modify the places that reference `./src/index.js` and `./src/index.html`.

```javascript
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  mode: "production",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: { presets: ["@babel/env"] },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  resolve: { extensions: ["*", ".js", ".jsx"] },
  output: {
    publicPath: "",
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true, // removes unused files from output dir
  },
  devServer: {
    static: "./dist",
  },
  plugins: [
    new HtmlWebpackPlugin({
      // Need to use template because need 'root' div for react injection. templateContent doesn't play nice with title, so just use a template file instead.
      template: "./src/index.html",
    }),
  ],
};

```

### Modify `package.json`

Optionally, `"main": "index.js",` becomes `"main": "webpack.config.js"`. (I got this from the webpack docs, but it doesn't seem necessary/I'm not sure of the purpose.)

Add a start and build script:

```json
"scripts": {
    "start": "webpack-dev-server --mode development",
    "build": "webpack",
  },
```

### Test it out

`npm run build`

`npm start`

## GitHub Pages

Nice reference: https://create-react-app.dev/docs/deployment/

### Modify `package.json`

Optinoally, change `homepage` to `"homepage": "https://username.github.io/repo-name/",`. Replace `username` and `repo-name`.

Add a predeploy and deploy script. The `dist` in the predeploy script should change if you told webpack to use a different output directory in `webpack.config.js`.:

```json
"scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
```

### Install `gh-pages`

`npm install gh-pages --save-dev`

### Test out deployment

`npm run deploy`

This will push the build to a branch called `gh-pages`.

### Set up automatic deployment

Add a workflow to deploy whenever a push to `main` occurs. Create a file `.github/workflows/deploy.yml` with these contents:

```yaml
name: "Deploy to GitHub Pages"

on:
  push:
    branches: [main]
  workflow_dispatch:

concurrency:
  group: gh-pages
  cancel-in-progress: true

jobs:
  deploy:
    name: Deploy
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Install requirements
        run: npm install

      - name: Build
        run: npm run build

      - name: Deploy
        run: |
          git config --global user.name ${{ github.actor }}
          git config --global user.email ${{ github.actor }}@gmail.com
          git remote set-url origin https://${{ github.actor }}:${{ secrets.GITHUB_TOKEN }}@github.com/${{ github.repository }}
          npm run deploy
```

### Configure your repo settings

Your repo settings should specify that GitHub Pages is built from the `gh-pages` branch: https://github.com/username/repo-name/settings/pages

### Check out your deployed app

Verify the site (replace `username` and `repo-name`): https://username.github.io/repo-name/

## Set up linters

### Prettier

`npm install --save-dev prettier`

Create a `.prettierrc.json` file with these contents to use the default config:

```json
{}
```

To run: `npx prettier --write .`

### Stylelint

`npm install --save-dev stylelint stylelint-config-standard`

Create a `.stylelintrc.json` file with these contents to use the default config:

```json
{
  "extends": "stylelint-config-standard"
}
```

To run: `npx stylelint "**/*.css"`

### ESlint

`npm install eslint --save-dev`

To create `.eslintrc.json`, run `npx eslint --init`. Note: As of the time of writing, `eslint` is on version 8 but the corresponding react plugin (that will be installed if you tell `eslin --init` that you are using React) only supports up to version 7, so you may need to downgrade `eslint`.

To run `npx eslint .`

### Pre-commit hook

Copy from https://github.com/skedwards88/config to run the linters automatically on each commit.

## Create a PWA/Make your app work offline + be installable

### Service worker

Install this package, which webpack will use to automatically generate the service worker.

`npm install workbox-webpack-plugin --save-dev`

Add to top of `webpack.config.js` add:

`const WorkboxPlugin = require('workbox-webpack-plugin');`

Add to the plugins list in `webpack.config.js` add:

```javascript
    new WorkboxPlugin.GenerateSW({
      // these options encourage the ServiceWorkers to get in there fast
      // and not allow any straggling "old" SWs to hang around
      clientsClaim: true,
      skipWaiting: true,
    }),
```

(See [`webpack.config.js`](https://github.com/skedwards88/react-base/blob/main/webpack.config.js) for an example.)

Now, when you run `npm build`, a `service-worker.js` file is built. A `workbox-###.js` file is also built.

### Register the service worker

To `src/index.js` after the imports, add:

```javascript
if ("serviceWorker" in navigator) {
  const path =
    location.hostname === "localhost"
      ? "/service-worker.js"
      : "/repo-name/service-worker.js";
  const scope = location.hostname === "localhost" ? "" : "/repo-name/";
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(path, { scope: scope })
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}
```

(See [`src/index.js`](https://github.com/skedwards88/react-base/blob/main/src/index.js) for an example.)

Replace `repo-name` with the name of your repo. Prepending `repo-name` to the path and scope is required for working with GitHub pages since the page is hosted at `https://user-name.github.io/repo-name/`. This isn't true when running locally (or presumably when hosting from something other than GitHub pages).

Now, if you load the page with internet connection, you will see a console log entry `SW Registered`. If you turn off internet connection in the dev tools, you can still load the page (and note that the `SW Registered` is not logged).

Note: When you make changes to your app while the app is running locally, you will likely see the browser constantly refresh with the error `[webpack-dev-server] GenerateSW has been called multiple times, perhaps due to running webpack in --watch mode. The precache manifest generated after the first call may be inaccurate! Please see https://github.com/GoogleChrome/workbox/issues/1790 for more information.`. Doing a hard refresh will stop the constant refreshes, and you can clear the error. I'm not sure how to fix this--please let me know if you know how!

### Create the manifest

Install `favicons-webpack-plugin` (and the `favicons` package that it wraps), which will generate all of the different icons from a single icon, generate the manifest, and inject the icons and manifest into the html.

`npm install --save-dev favicons favicons-webpack-plugin`

Add to top of `webpack.config.js` add:

`const FaviconsWebpackPlugin = require('favicons-webpack-plugin')`

Add to the plugins list in `webpack.config.js` add:

```javascript
new FaviconsWebpackPlugin({
  logo: "./src/images/favicon.png",
  mode: "webapp", // optional can be 'webapp', 'light' or 'auto' - 'auto' by default
  devMode: "webapp", // optional can be 'webapp' or 'light' - 'light' by default
  favicons: {
    appName: "App name",
    short_name: "Short app name",
    start_url: "../.",
    appDescription: "App description",
    display: "standalone",
    developerName: "skedwards88",
    developerURL: null, // prevent retrieving from the nearest package.json
    background: "#F1F0F0",
    theme_color: "#6e799e",
    icons: {
      coast: false,
      yandex: false,
    },
  },
});
```

In the FaviconsWebpackPlugin inputs above, update the favicons properties with the values you want in the manifest.json. Specifically, set `appName`, `short_name`, `appDescription`, `developerName` to appropriate values.

In the FaviconsWebpackPlugin inputs above, setting `mode` and `devMode` to `webapp` will cause all of the icons to be built even if webpack is run in developer mode. For a faster build, set to `light`. Alternatively, you can also toggle `mode` in the `webpack.config.js` file. You could also make `npm run build` accept a mode argument. (https://webpack.js.org/configuration/mode/)

Add a logo to `./src/images/favicon.png`. (If using a different path or format, update the FaviconsWebpackPlugin `logo` input above.) Image size should be 1024x1024 pixels since the favicons package will scale the image up or down to generate different icon sizes. 1024x1024 pixels is the largest icon it generates.

The value of `"../."` for `start_url` is required for this configuration to work, since the FaviconsWebpackPlugin puts the manifest.json file into an `assets` directory that is one level lower than where webpack puts `index.html`.

`favicons-webpack-plugin` does not generate maskable icons.

Alternatively, instead of using `favicons-webpack-plugin`, you could instead create all of the icons separately and use `copy-webpack-plugin` to copy the icons and manifest to the dist directory at build time.

### Lighthouse

Use Lighthouse in Chrome developer tools to verify that the app is installable and meets PWA requirements.
