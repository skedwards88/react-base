/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  const singleRequire = name => {
    if (name !== 'require') {
      name = name + '.js';
    }
    let promise = Promise.resolve();
    if (!registry[name]) {
      
        promise = new Promise(async resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = name;
            document.head.appendChild(script);
            script.onload = resolve;
          } else {
            importScripts(name);
            resolve();
          }
        });
      
    }
    return promise.then(() => {
      if (!registry[name]) {
        throw new Error(`Module ${name} didn’t register its module`);
      }
      return registry[name];
    });
  };

  const require = (names, resolve) => {
    Promise.all(names.map(singleRequire))
      .then(modules => resolve(modules.length === 1 ? modules[0] : modules));
  };
  
  const registry = {
    require: Promise.resolve(require)
  };

  self.define = (moduleName, depsNames, factory) => {
    if (registry[moduleName]) {
      // Module is already loading or loaded.
      return;
    }
    registry[moduleName] = Promise.resolve().then(() => {
      let exports = {};
      const module = {
        uri: location.origin + moduleName.slice(1)
      };
      return Promise.all(
        depsNames.map(depName => {
          switch(depName) {
            case "exports":
              return exports;
            case "module":
              return module;
            default:
              return singleRequire(depName);
          }
        })
      ).then(deps => {
        const facValue = factory(...deps);
        if(!exports.default) {
          exports.default = facValue;
        }
        return exports;
      });
    });
  };
}
define("./service-worker.js",['./workbox-718aa5be'], function (workbox) { 'use strict';

  /**
  * Welcome to your Workbox-powered service worker!
  *
  * You'll need to register this file in your web app.
  * See https://goo.gl/nhQhGp
  *
  * The rest of the code is auto-generated. Please don't update this file
  * directly; instead, make changes to your Workbox build configuration
  * and re-run your build process.
  * See https://goo.gl/2aRDsh
  */

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */

  workbox.precacheAndRoute([{
    "url": "48f8595c71614683f1ab.png",
    "revision": null
  }, {
    "url": "assets/android-chrome-144x144.png",
    "revision": "21bd447da6ebbafe97159f15c34e8181"
  }, {
    "url": "assets/android-chrome-192x192.png",
    "revision": "5a6dfa144e7965f998859b264dd78c22"
  }, {
    "url": "assets/android-chrome-256x256.png",
    "revision": "0f832164823fbf0ca7bf3ee2f09f5cdd"
  }, {
    "url": "assets/android-chrome-36x36.png",
    "revision": "c81f49f2b34f37917ee4777cce8685a2"
  }, {
    "url": "assets/android-chrome-384x384.png",
    "revision": "827398d38c35f7f66f31763e888b0aa6"
  }, {
    "url": "assets/android-chrome-48x48.png",
    "revision": "9f671d40f74493490c6c8b98edec7ada"
  }, {
    "url": "assets/android-chrome-512x512.png",
    "revision": "4d1b5e540b2f223649ecd6a97d476057"
  }, {
    "url": "assets/android-chrome-72x72.png",
    "revision": "b3849404d94973f65c5cfc901a12df79"
  }, {
    "url": "assets/android-chrome-96x96.png",
    "revision": "891958371a7a92835d8274aaa9dabff2"
  }, {
    "url": "assets/apple-touch-icon-1024x1024.png",
    "revision": "7f1ee3bd6c804f5c873d47463a933a3c"
  }, {
    "url": "assets/apple-touch-icon-114x114.png",
    "revision": "fc1d1371eb0900a3b7fe84ff1dc7bd7c"
  }, {
    "url": "assets/apple-touch-icon-120x120.png",
    "revision": "b156b116e26061fc0c22e283877fa447"
  }, {
    "url": "assets/apple-touch-icon-144x144.png",
    "revision": "0a691737d047beb75dd3ebe638df6678"
  }, {
    "url": "assets/apple-touch-icon-152x152.png",
    "revision": "232c1d17373a87c6ec011eece6a84975"
  }, {
    "url": "assets/apple-touch-icon-167x167.png",
    "revision": "29093f8034b2cdc1c0dd4e04b0ae73df"
  }, {
    "url": "assets/apple-touch-icon-180x180.png",
    "revision": "ebfbc739b5e5abb10eb19ba1e707eff6"
  }, {
    "url": "assets/apple-touch-icon-57x57.png",
    "revision": "a050aac0676f204233b58b765c385446"
  }, {
    "url": "assets/apple-touch-icon-60x60.png",
    "revision": "6e5d4e6b48d3d01b9495c5dfda07dd78"
  }, {
    "url": "assets/apple-touch-icon-72x72.png",
    "revision": "a9c7feaae6cda810ffe55b09ab475b16"
  }, {
    "url": "assets/apple-touch-icon-76x76.png",
    "revision": "8ba032fce2e02c40dd03fdeaf61fd8a2"
  }, {
    "url": "assets/apple-touch-icon-precomposed.png",
    "revision": "ebfbc739b5e5abb10eb19ba1e707eff6"
  }, {
    "url": "assets/apple-touch-icon.png",
    "revision": "ebfbc739b5e5abb10eb19ba1e707eff6"
  }, {
    "url": "assets/apple-touch-startup-image-1125x2436.png",
    "revision": "c41417e047e338ec29bedcd9fdfd23bb"
  }, {
    "url": "assets/apple-touch-startup-image-1136x640.png",
    "revision": "5fb4ffdda7bf9e8ffe7445b413581c7c"
  }, {
    "url": "assets/apple-touch-startup-image-1242x2208.png",
    "revision": "007d3ff091e7bf61374e004e4ab011a5"
  }, {
    "url": "assets/apple-touch-startup-image-1242x2688.png",
    "revision": "b154b85964f10f5c0270f3c6708a5a7e"
  }, {
    "url": "assets/apple-touch-startup-image-1334x750.png",
    "revision": "dd9febc0ec46fac4e4a0c3677190610f"
  }, {
    "url": "assets/apple-touch-startup-image-1536x2048.png",
    "revision": "e652bca25de814190d7031bff1343228"
  }, {
    "url": "assets/apple-touch-startup-image-1620x2160.png",
    "revision": "42528790f9364677d167372d76adc2c7"
  }, {
    "url": "assets/apple-touch-startup-image-1668x2224.png",
    "revision": "b2ae9343e0c098ce873666b394bb593a"
  }, {
    "url": "assets/apple-touch-startup-image-1668x2388.png",
    "revision": "96e034328222fa25eb534bd59a81f703"
  }, {
    "url": "assets/apple-touch-startup-image-1792x828.png",
    "revision": "d0e8eabfd45ccf20b173648322739d66"
  }, {
    "url": "assets/apple-touch-startup-image-2048x1536.png",
    "revision": "63f11691f7330ccebbcf0ac9c703e700"
  }, {
    "url": "assets/apple-touch-startup-image-2048x2732.png",
    "revision": "6b01bf31e0397b5ef0c3abb2c52f4ec2"
  }, {
    "url": "assets/apple-touch-startup-image-2160x1620.png",
    "revision": "ff4d8574cba10f4b91d5f011a5ff8167"
  }, {
    "url": "assets/apple-touch-startup-image-2208x1242.png",
    "revision": "8402d3192709e74afbd1374aae23c8e9"
  }, {
    "url": "assets/apple-touch-startup-image-2224x1668.png",
    "revision": "9d42f91438b1e4136d95d7a639e0f81d"
  }, {
    "url": "assets/apple-touch-startup-image-2388x1668.png",
    "revision": "9387c91d3d34dd6a89c1e2e8dd826be9"
  }, {
    "url": "assets/apple-touch-startup-image-2436x1125.png",
    "revision": "170d0aac8da5b32370376287fa291127"
  }, {
    "url": "assets/apple-touch-startup-image-2688x1242.png",
    "revision": "39ae4d334af14c2f4cb4e23b17670f9e"
  }, {
    "url": "assets/apple-touch-startup-image-2732x2048.png",
    "revision": "915e076f592851c505108c6b97972ed5"
  }, {
    "url": "assets/apple-touch-startup-image-640x1136.png",
    "revision": "e0c170166402ad8d6e523aeeac7ecc5e"
  }, {
    "url": "assets/apple-touch-startup-image-750x1334.png",
    "revision": "11021e949e76718e459a6053269dd1f2"
  }, {
    "url": "assets/apple-touch-startup-image-828x1792.png",
    "revision": "e6ddf4e9b663e69febc7107d173b2372"
  }, {
    "url": "assets/browserconfig.xml",
    "revision": "ac855251e86a3f59b314f78cbb355554"
  }, {
    "url": "assets/favicon-16x16.png",
    "revision": "9366c680a72a48e1f5cbc4ba26fb86f0"
  }, {
    "url": "assets/favicon-32x32.png",
    "revision": "4012554b637a77f02a80b126e4597bbd"
  }, {
    "url": "assets/favicon-48x48.png",
    "revision": "9f671d40f74493490c6c8b98edec7ada"
  }, {
    "url": "assets/favicon.ico",
    "revision": "d7d2657899decaaf1dd9e739a79c774c"
  }, {
    "url": "assets/firefox_app_128x128.png",
    "revision": "a52ab40039798876931ed1e25d64d036"
  }, {
    "url": "assets/firefox_app_512x512.png",
    "revision": "bf9609c61ceb8d6bee301d844cfb3242"
  }, {
    "url": "assets/firefox_app_60x60.png",
    "revision": "828e1ca3f13a62469e97d211220c1d51"
  }, {
    "url": "assets/manifest.json",
    "revision": "42477c15d9df7badfb500967d72e947a"
  }, {
    "url": "assets/manifest.webapp",
    "revision": "f9d8e63ad4b10a7a0e1a1ee0c9663c3e"
  }, {
    "url": "assets/mstile-144x144.png",
    "revision": "21bd447da6ebbafe97159f15c34e8181"
  }, {
    "url": "assets/mstile-150x150.png",
    "revision": "b0df6b8a554a275f9ebfac9eb5a40c88"
  }, {
    "url": "assets/mstile-310x150.png",
    "revision": "22567db53b45690873420c917adb2aa2"
  }, {
    "url": "assets/mstile-310x310.png",
    "revision": "ff1b4726de2419a876ed46858d0f8e15"
  }, {
    "url": "assets/mstile-70x70.png",
    "revision": "6c35513dbf2269cf386c80d73aa1da6e"
  }, {
    "url": "bundle.js",
    "revision": "18c225de655c994dbb37f9d6ca20e935"
  }, {
    "url": "d2b7505a34b8d54d5939.svg",
    "revision": null
  }, {
    "url": "index.html",
    "revision": "70a574d55c2bc4a353a7ea55836912c8"
  }], {});

});
