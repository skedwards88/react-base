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
  
  ### Install `gh-pages`
  
  `npm install gh-pages --save-dev`

### Modify `package.json`

Optinoally, change `homepage` to `"homepage": "https://username.github.io/repo-name/",`. Replace `username` and `repo-name`.

Add a predeploy and deploy script. The `dist` in the predeploy script should change if you told webpack to use a different output directory in `webpack.config.js`.:

```json
"scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
```

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

Note: To prevent the `[webpack-dev-server] GenerateSW has been called multiple times, perhaps due to running webpack in --watch mode. The precache manifest generated after the first call may be inaccurate! Please see https://github.com/GoogleChrome/workbox/issues/1790 for more information.` error, you can skip using this plugin when in development mode. For example, the `webpack.config.js` can look like:

```javascript
const path = require("path");
const WorkboxPlugin = require('workbox-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env, argv) => {

  if (argv.mode === 'development') {
    console.log('RUNNING IN DEV MODE. Service worker will not generate.')
  } else {
    console.log('RUNNING IN NON-DEV MODE. Service worker will generate.')
  }

  const htmlPlugin = new HtmlWebpackPlugin({
    // Need to use template because need 'root' div for react injection. templateContent doesn't play nice with title, so just use a template file instead.
    template: "./src/index.html"
  })

  const serviceWorkerPlugin = new WorkboxPlugin.GenerateSW({
    // these options encourage the ServiceWorkers to get in there fast
    // and not allow any straggling "old" SWs to hang around
    clientsClaim: true,
    skipWaiting: true,
  })

  const plugins = argv.mode === 'development' ? [htmlPlugin] : [htmlPlugin, serviceWorkerPlugin]

  return {
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
  plugins: plugins,
}
};
```

And your `package.json` can have two scripts to start the server:

```json
  "scripts": {
    "dev": "webpack-dev-server --mode development",
    "start": "webpack-dev-server",
  }
```

Running `npm run dev` will avoid generating the service worker. This is useful if you want to test out changes in the browser during development.

Running `npm start` will generate the service worker. This is useful for testing your full app and making sure it works offline.

### Register the service worker

To `src/index.js` after the imports, add:

```javascript
if (process.env.NODE_ENV !== "development" && "serviceWorker" in navigator) {
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

Note that the service worker will not be registered if you are running the server in development mode (`process.env.NODE_ENV !== "development"`).

(See [`src/index.js`](https://github.com/skedwards88/react-base/blob/main/src/index.js) for an example.)

Replace `repo-name` with the name of your repo. Prepending `repo-name` to the path and scope is required for working with GitHub pages since the page is hosted at `https://user-name.github.io/repo-name/`. This isn't true when running locally (or presumably when hosting from something other than GitHub pages).

Now, if you load the page with internet connection, you will see a console log entry `SW Registered`. If you turn off internet connection in the dev tools, you can still load the page (and note that the `SW Registered` is not logged).

### Create the webapp manifest

Your progressive webapp should include a webapp manifest and favicons. You can either create these assets manually and copy them to your build, or you can use a plugin to generate and inject the assets for you.

#### Creating manually and copying

Manually create your icons and a manifest file. A good minimum set of favicons could include a `svg`, `ico`, 192x192 px `png`, 512x512 px `png`, and maskable `png`. You can create a maskable icon with https://maskable.app/editor.

Manually create a `manifest.json` file. For example:

```json
{
  "name": "App name",
  "short_name": "Short app name",
  "description": "App description",
  "dir": "auto",
  "lang": "en-US",
  "display": "standalone",
  "orientation": "any",
  "start_url": "../.",
  "background_color": "#FFFFFF",
  "theme_color": "#262481",
  "icons": [
    {
      "src": "favicon.svg",
      "type": "image/svg+xml",
      "sizes": "512x512"
    },
    {
      "src": "icon_192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "icon_512.png",
      "type": "image/png",
      "sizes": "512x512"
    },
    {
      "src": "maskable_icon.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

Edit the `index.html` file to reference the manifest file and icons.

```html
<!DOCTYPE html>
<html>
  <head lang="en">
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>App Name</title>
    <meta name="description" content="App description" />
    <link rel="icon" href="assets/favicon.ico" sizes="any" />
    <link rel="icon" href="assets/favicon.svg" type="image/svg+xml" />
    <link rel="manifest" href="assets/manifest.json" />
    <link rel="apple-touch-icon" href="assets/icon_192.png" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="theme-color" content="#262481" />
    <meta name="application-name" content="App title" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta
      name="apple-mobile-web-app-status-bar-style"
      content="black-translucent"
    />
    <meta name="apple-mobile-web-app-title" content="App title" />
  </head>

  <body>
    <div id="root"></div>
    <noscript> You need to enable JavaScript to run this app. </noscript>
  </body>
</html>
```

Install `copy-webpack-plugin`.

`npm install --save-dev copy-webpack-plugin`

To top of `webpack.config.js` add:

`const CopyPlugin = require("copy-webpack-plugin");`

Add to the plugins list in `webpack.config.js` add:

```javascript
new CopyPlugin({
    patterns: [
      { from: "./src/images/favicon.svg", to: "./assets/favicon.svg" },
      { from: "./src/images/favicon.ico", to: "./assets/favicon.ico" },
      { from: "./src/images/icon_192.png", to: "./assets/icon_192.png" },
      { from: "./src/images/icon_512.png", to: "./assets/icon_512.png" },
      { from: "./src/images/maskable_icon.png", to: "./assets/maskable_icon.png" },
      { from: "./src/manifest.json", to: "./assets/manifest.json" },
    ],
    options: {
      concurrency: 100,
    },
  });
```

Update the filepaths above if needed.

#### Creating programmatically

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

### Lighthouse

Use Lighthouse in Chrome developer tools to verify that the app is installable and meets PWA requirements.
