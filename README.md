![](https://badgen.net/badge/SoS正/0.8.0/f2a) ![](https://badgen.net/badge/editor.js/v2.19.0/blue) ![](https://badgen.net/badge/plugin/v2.0.0/orange) 

# File Plugin bring Clear, load Url, Open/save local file facilities to editor.js


## What's new doc ?

- Since 2.0.0 , build use webpack way but sample.js is still minified using node.

## Feature(s)

### File init helper

Provides File.init() to initialise File plugin just after editor isready.

### sample script

![](file-panel.png)

This script will add 3 nice Fa icons buttons Clear(or open Url), Open and Save on SoSIE's Menubar for you,

## Integration

Add a line in  either your example.html, after the script-loader line in the loadPlugins section

```html
	/**
        * Plugins
        */
         await loadPlugins([
            {'sosie-js/script-loader@3.0.0': '[example/plugins/script-loader](https://github.com/sosie-js/script-loader)'}, //virtual , already loaded we keep a version trace here
            {'sosie-js/file-plugin@2.0.0': ['[example/plugins/file-plugin](https://github.com/sosie-js/file-plugin)',['dist/bundle.js','dist/sample.js']]},
        ],nocache,mode,target);
```

## Building the plugin

To produce the dist/bundle.js for production use the command: 

```shell
yarn build
```

## Missing something?

[A demo please SoSie](http://sosie.sos-productions.com/)
