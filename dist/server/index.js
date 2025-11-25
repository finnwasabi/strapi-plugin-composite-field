"use strict";
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var register$1 = ({ strapi }) => {
  strapi.customFields.register({
    name: "composite",
    plugin: "composite-field",
    type: "string"
  });
};
const register = register$1;
var src = {
  register
};
const index = /* @__PURE__ */ getDefaultExportFromCjs(src);
module.exports = index;
