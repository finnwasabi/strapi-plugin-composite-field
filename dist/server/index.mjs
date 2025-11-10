function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var register$1 = ({ strapi }) => {
  console.log("🔌 Composite Field Plugin: Registering custom field...");
  strapi.customFields.register({
    name: "composite",
    plugin: "composite-field",
    type: "string"
  });
  console.log(
    "✅ Composite Field Plugin: Custom field registered successfully"
  );
};
const register = register$1;
var src = {
  register
};
const index = /* @__PURE__ */ getDefaultExportFromCjs(src);
export {
  index as default
};
