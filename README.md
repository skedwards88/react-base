Steps to set up a react webapp project.

## Run `git init` and create a repo

## Run `npm init`

## Create the app base structure

For example, can copy:

`src/App.css`

`src/App.js`

`src/index.html`

`src/index.js`

`src/images` add favicon and other image assets

## Set up webpack/babel/react

### Install

`npm install react`

`npm install react react-dom`

`npm install --save-dev @babel/core`

`npm install --save-dev @babel/preset-react`

`npm install --save-dev @babel/preset-env`

`npm install --save-dev webpack`

`npm install --save-dev style-loader`

`npm install --save-dev css-loader`

`npm install --save-dev babel-loader`

`npm install --save-dev webpack-cli`

`npm install --save-dev webpack-dev-server`

`npm install --save-dev html-webpack-plugin`

`npm install --save-dev react-hot-loader` todo don't need

### Copy `.babelrc`

### Copy `webpack.config.js`

### Modify `package.json`

`"main": "index.js",` becomes `"main": "webpack.config.js"` todo don't need. look up what this means

Add a start and build script:

```
"scripts": {
    "start": "webpack-dev-server --mode development",
    "build": "webpack",
  },
```

### Test

`npm run build`

`npm start`

## GitHub Pages

Nice reference: https://create-react-app.dev/docs/deployment/

### Modify `package.json`

`"homepage": "https://skedwards88.github.io/repo-name/",` (not required)

Add a predeploy and deploy script. The `dist` in the predeploy script should change if you tell webpack to use a different output directory.:

```
"scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
```

### Install

`npm install gh-pages --save-dev`

### Run

`npm run deploy`

This will push the build to a branch called `gh-pages`.

### Set up automatic deployment

Add a workflow to deploy whenever a push to `main` occurs:

```yaml
name: "Deploy to GitHub Pages"

on:
  push:
    branches: [main]

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

### Check settings

Your repo settings should specify that GitHub Pages is build from the `gh-pages` branch: https://github.com/skedwards88/repo-name/settings/pages

### Inspect

Verify the site: https://skedwards88.github.io/repo-name/

## Linters

### Prettier

`npm install --save-dev prettier`

Copy `.prettierrc.json`

To run: `npx prettier --write .`

### Stylelint

`npm install --save-dev stylelint stylelint-config-standard`

Copy `.stylelintrc.json`

To run: `npx stylelint "**/*.css"`

### ESlint

`npm install eslint --save-dev`

Instead of copying `.eslintrc.json`, run `npx eslint --init`

To run `npx eslint .`

### Pre-commit hook

Copy from https://github.com/skedwards88/config to run the linters automatically

### Offline/PWA

#### Service worker

Install this package, which webpack will use to automatically generate the service worker.

`npm install workbox-webpack-plugin --save-dev`

Add to top of `webpack.config.js`:

`const WorkboxPlugin = require('workbox-webpack-plugin');`

Add to the plugins list in `webpack.config.js`:

```javascript
    new WorkboxPlugin.GenerateSW({
      // these options encourage the ServiceWorkers to get in there fast
      // and not allow any straggling "old" SWs to hang around
      clientsClaim: true,
      skipWaiting: true,
    }),
```

Now, when you run `npm build`, a `service-worker.js` file is built. A `workbox-###.js` file is also built.

#### Register service worker

To `src/index.js` after the imports, add

```javascript
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}
```

Now, if you load the page with internet connection, you will see a console log entry `SW Registered`. If you turn off internet connection in the dev tools, you can still load the page (and note that the `SW Registered` is not logged).

#### Manifest

Install this package, which will generate all of the different icons from a single icon, generate the manifest, and inject the icons and manifest into the html.

`npm install favicons-webpack-plugin --save-dev`

Add to top of `webpack.config.js`:

`const FaviconsWebpackPlugin = require('favicons-webpack-plugin')`

Add to the plugins list in `webpack.config.js`:

```
    new FaviconsWebpackPlugin({
      logo: "./src/images/favicon.png", // svg works too!
      mode: 'webapp', // optional can be 'webapp', 'light' or 'auto' - 'auto' by default
      devMode: 'webapp', // optional can be 'webapp' or 'light' - 'light' by default
      favicons: {
        appName: 'my-app',
        start_url: ".",
        appDescription: 'My awesome App',
        developerName: 'Me',
        developerURL: null, // prevent retrieving from the nearest package.json
        background: '#ddd',
        theme_color: '#333',
        icons: {
          coast: false,
          yandex: false
        }
      }
    })
```

Add a logo to `./src/images/favicon.png`. (If using a different path or format, update the FaviconsWebpackPlugin inputs above.) Image size should be 1024x1024 pixels since the favicons package will scale the image up or down to generate different icon sizes. 1024x1024 pixels is the largest icon it generates.

In the FaviconsWebpackPlugin inputs above, update the favicons properties with the values you want in the manifest.json.

In the FaviconsWebpackPlugin inputs above, setting `mode` and `devMode` to `webapp` will cause all of the icons to be built even if webpack is run in developer mode. For a faster build, set to `light`. Alternatively, you can also toggle `mode` in the `webpack.config.js` file. You could also make `npm run build` accept a mode argument. (https://webpack.js.org/configuration/mode/)

Alternatively, instead of using `favicons-webpack-plugin`, you could instead create all of the icons separately and use `copy-webpack-plugin` to copy the icons and manifest to the dist directory at build time.

`favicons-webpack-plugin` does not generate maskable icons.

#### Lighthouse

Use Lighthouse in Chrome developer tools to verify that the app is installable and meets PWA requirements.
