"use strict";
const React = require("react");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const React__default = /* @__PURE__ */ _interopDefault(React);
const CompositeIcon = () => React__default.default.createElement(
  "div",
  {
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "32px",
      height: "24px",
      borderRadius: "4px",
      border: "1px solid #b8e1ff",
      background: "#eafbff",
      fontSize: "14px",
      fontWeight: "600",
      color: "#0c75af"
    }
  },
  "Aa"
);
const index = {
  register(app) {
    app.customFields.register({
      name: "composite",
      pluginId: "composite-field",
      type: "string",
      icon: CompositeIcon,
      intlLabel: {
        id: "composite-field.label",
        defaultMessage: "Composite"
      },
      intlDescription: {
        id: "composite-field.description",
        defaultMessage: "Combine multiple fields into one display value"
      },
      components: {
        Input: async () => Promise.resolve().then(() => require("../_chunks/CompositeInput-B2zE74Yh.js"))
      },
      options: {
        base: [
          {
            sectionTitle: {
              id: "composite-field.section.title",
              defaultMessage: "Settings"
            },
            items: [
              {
                name: "options.fields",
                type: "textarea",
                intlLabel: {
                  id: "composite-field.fields.label",
                  defaultMessage: "Fields to combine"
                },
                description: {
                  id: "composite-field.fields.description",
                  defaultMessage: "Enter field names (one per line). Only text/string fields are supported."
                },
                placeholder: {
                  id: "composite-field.fields.placeholder",
                  defaultMessage: "salutation\nfirstName\nlastName\nemail"
                }
              },
              {
                name: "options.separator",
                type: "text",
                intlLabel: {
                  id: "composite-field.separator.label",
                  defaultMessage: "Separator"
                },
                description: {
                  id: "composite-field.separator.description",
                  defaultMessage: 'Separator between fields (default: " - ")'
                },
                placeholder: {
                  id: "composite-field.separator.placeholder",
                  defaultMessage: " - "
                }
              }
            ]
          }
        ],
        advanced: [
          {
            sectionTitle: {
              id: "composite-field.advanced.title",
              defaultMessage: "Settings"
            },
            items: [
              {
                name: "options.editable",
                type: "checkbox",
                intlLabel: {
                  id: "composite-field.editable.label",
                  defaultMessage: "Editable"
                },
                description: {
                  id: "composite-field.editable.description",
                  defaultMessage: "Allow manual editing of the composite field value"
                }
              },
              {
                name: "options.autoGenerate",
                type: "checkbox",
                intlLabel: {
                  id: "composite-field.autoGenerate.label",
                  defaultMessage: "Auto-generate"
                },
                description: {
                  id: "composite-field.autoGenerate.description",
                  defaultMessage: "Automatically generate value when source fields change"
                }
              }
            ]
          }
        ]
      }
    });
  },
  bootstrap() {
  }
};
module.exports = index;
