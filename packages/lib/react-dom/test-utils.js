"use strict";

if (process.env.NODE_ENV === "production") {
  module.exports = require("./react-dom-test-utils.production.min.js");
} else {
  module.exports = require("./react-dom-test-utils.development.js");
}
