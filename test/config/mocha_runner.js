var jsdom = require('jsdom').jsdom;

var exposedProperties = ['window', 'navigator', 'document'];

global.document = jsdom('');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

const noop = () => {};
global.window.getComputedStyle = () => {
  return {
    getPropertyValue: noop
  };
};

global.navigator = {
  userAgent: 'node.js'
};

documentRef = document;

require('babel-core/register');
require('babel-polyfill');
