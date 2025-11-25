module.exports = ({ strapi }) => {
  strapi.customFields.register({
    name: "composite",
    plugin: "composite-field",
    type: "string",
  });
};
