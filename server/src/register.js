module.exports = ({ strapi }) => {
  console.log("🔌 Composite Field Plugin: Registering custom field...");

  strapi.customFields.register({
    name: "composite",
    plugin: "composite-field",
    type: "string",
  });

  console.log(
    "✅ Composite Field Plugin: Custom field registered successfully",
  );
};
