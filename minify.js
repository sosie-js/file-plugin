const minify = require('@node-minify/core');
const terser = require('@node-minify/terser');


minify({
  compressor: terser,
  input: ['src/sample.js'],
  output: ['dist/sample.js'],
  callback: function(err, min) {}
});
