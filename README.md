## Run `git init` and create a repo

## Run `npm init`

## Create the app base structure

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
`npm install --save-dev react-hot-loader`

### `.babelrc`

### `webpack.config.js`

### `package.json`

`"main": "index.js",` becomes `"main": "webpack.config.js"`

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

### `package.json`

`"homepage": "https://skedwards88.github.io/repo-name/",` todo not required

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

### Check settings

Your repo settings should specify that GitHub Pages is build from the `gh-pages` branch: https://github.com/skedwards88/repo-name/settings/pages

### Inspect

Verify the site: https://github.com/skedwards88/repo-name/settings/pages

## Linters

### Prettier

`npm install --save-dev prettier`

Create `.prettierrc.json`

To run: `npx prettier --write .`

### Stylelint

`npm install --save-dev stylelint stylelint-config-standard`

Create `.stylelintrc.json`

To run: `npx stylelint "**/*.css"`

### ESlint

`npm install eslint --save-dev`

Instead of copying `.eslintrc.json`, run `npx eslint --init`

To run `npx eslint .`

`.eslintrc.json`

### Pre-commit hook

Copy from https://github.com/skedwards88/config to run the linters automatically

## Actions

