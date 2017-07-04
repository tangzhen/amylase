global.expect = require('chai').expect;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

global.window = new JSDOM('<!doctype html><html><body><div id="appRoot"></div></body></html>').window;
global.document = global.window.document;
global.navigator = {userAgent: ''};
