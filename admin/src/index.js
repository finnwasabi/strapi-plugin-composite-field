import React from "react";

const CompositeIcon = () =>
  React.createElement(
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
        color: "#0c75af",
      },
    },
    "Aa",
  );

export default {
  register(app) {
    app.customFields.register({
      name: "composite",
      pluginId: "composite-field",
      type: "string",
      icon: CompositeIcon,
      intlLabel: {
        id: "composite-field.label",
        defaultMessage: "Composite",
      },
      intlDescription: {
        id: "composite-field.description",
        defaultMessage: "Combine multiple fields into one display value",
      },
      components: {
        Input: async () => import("./components/CompositeInput"),
      },
      options: {
        base: [
          {
            sectionTitle: {
              id: "composite-field.section.title",
              defaultMessage: "Settings",
            },
            items: [
              {
                name: "options.fields",
                type: "textarea",
                intlLabel: {
                  id: "composite-field.fields.label",
                  defaultMessage: "Fields to combine",
                },
                description: {
                  id: "composite-field.fields.description",
                  defaultMessage:
                    "Enter field names (one per line). Only text/string fields are supported.",
                },
                placeholder: {
                  id: "composite-field.fields.placeholder",
                  defaultMessage: "salutation\nfirstName\nlastName\nemail",
                },
              },
              {
                name: "options.separator",
                type: "text",
                intlLabel: {
                  id: "composite-field.separator.label",
                  defaultMessage: "Separator",
                },
                description: {
                  id: "composite-field.separator.description",
                  defaultMessage: 'Separator between fields (default: " - ")',
                },
                placeholder: {
                  id: "composite-field.separator.placeholder",
                  defaultMessage: " - ",
                },
              },
            ],
          },
        ],
        advanced: [],
      },
    });
  },

  bootstrap() {
    // Plugin bootstrap
  },
};
