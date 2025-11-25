import React from "react";
import { Field, Flex, Button, Typography } from "@strapi/design-system";
import { Play } from "@strapi/icons";
import { useIntl } from "react-intl";

const CompositeInput = (props) => {
  if (!props) {
    return null;
  }

  const {
    attribute,
    name,
    value,
    onChange,
    disabled,
    required,
    error,
    description,
    labelAction,
    label,
    intlLabel,
  } = props;

  const { formatMessage } = useIntl();
  const [localValue, setLocalValue] = React.useState(value || "");

  React.useEffect(() => {
    setLocalValue(value || "");
  }, [value]);

  const fieldsConfig = attribute?.options?.fields || "";
  const separator = attribute?.options?.separator || " - ";
  const editable = attribute?.options?.editable !== false;
  const autoGenerate = attribute?.options?.autoGenerate === true;

  // Parse fields
  let fields = [];
  if (typeof fieldsConfig === "string") {
    fields = fieldsConfig
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);
  }

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    if (onChange) {
      onChange({ target: { name, value: newValue, type: "text" } });
    }
  };

  const handleGenerate = React.useCallback(() => {
    const parts = [];

    // Get values from form fields
    fields.forEach((fieldPath) => {
      let fieldValue = null;

      // Strategy 1: Try to find input/textarea with name attribute
      const input = document.querySelector(
        `input[name="${fieldPath}"], textarea[name="${fieldPath}"]`
      );
      if (input && input.value) {
        fieldValue = input.value;
      }

      // Strategy 2: Try to find select/enum field by name
      if (!fieldValue) {
        const select = document.querySelector(`select[name="${fieldPath}"]`);
        if (select && select.value) {
          fieldValue = select.value;
        }
      }

      // Strategy 3: Try to find SingleSelect/Combobox by searching near the field name
      if (!fieldValue) {
        // Look for all combobox buttons
        const allComboboxes = document.querySelectorAll(
          'button[role="combobox"]'
        );

        for (const combobox of allComboboxes) {
          // Check if this combobox is associated with our field
          // by looking at the parent structure
          const fieldContainer =
            combobox.closest("[data-strapi-field]") ||
            combobox.closest('div[class*="Field"]');

          if (fieldContainer) {
            // Look for label or input with matching name in this container
            const label = fieldContainer.querySelector("label");
            const hiddenInput = fieldContainer.querySelector(
              `input[name="${fieldPath}"]`
            );

            if (label || hiddenInput) {
              const labelText = label?.textContent?.trim().toLowerCase() || "";
              const fieldName = fieldPath.toLowerCase();

              // Check if label matches field name (with some flexibility)
              if (
                labelText === fieldName ||
                labelText
                  .replace(/\s+/g, "")
                  .includes(fieldName.replace(/\s+/g, "")) ||
                hiddenInput
              ) {
                const selectedText = combobox.textContent?.trim();
                if (
                  selectedText &&
                  selectedText !== "Select..." &&
                  selectedText !== ""
                ) {
                  fieldValue = selectedText;
                  break;
                }
              }
            }
          }
        }
      }

      // Strategy 4: Fallback - search by field ID or aria attributes
      if (!fieldValue) {
        const fieldById = document.getElementById(fieldPath);
        if (fieldById) {
          if (fieldById.tagName === "SELECT") {
            fieldValue = fieldById.value;
          } else if (fieldById.value) {
            fieldValue = fieldById.value;
          }
        }
      }

      if (fieldValue) {
        parts.push(fieldValue);
      }
    });

    // Ensure separator has spaces around it
    const cleanSeparator = separator.trim();
    const result = parts.join(` ${cleanSeparator} `).trim();

    setLocalValue(result);

    if (onChange) {
      onChange({ target: { name, value: result, type: "text" } });
    }
  }, [fields, separator, onChange, name]);

  // Auto-generate when fields change
  React.useEffect(() => {
    if (!autoGenerate || fields.length === 0) return;

    const handleFieldChange = () => {
      // Debounce to avoid too many updates
      setTimeout(() => {
        handleGenerate();
      }, 300);
    };

    // Listen to input events on all fields
    const listeners = [];
    fields.forEach((fieldPath) => {
      const elements = document.querySelectorAll(
        `input[name="${fieldPath}"], textarea[name="${fieldPath}"], select[name="${fieldPath}"], button[role="combobox"]`
      );

      elements.forEach((element) => {
        element.addEventListener("change", handleFieldChange);
        element.addEventListener("input", handleFieldChange);
        element.addEventListener("click", handleFieldChange);
        listeners.push({ element, handler: handleFieldChange });
      });
    });

    return () => {
      listeners.forEach(({ element, handler }) => {
        element.removeEventListener("change", handler);
        element.removeEventListener("input", handler);
        element.removeEventListener("click", handler);
      });
    };
  }, [autoGenerate, fields, handleGenerate]);

  return (
    <Field.Root
      name={name}
      id={name}
      error={error}
      hint={description?.id ? formatMessage(description) : description}
      required={required}
    >
      <Flex direction="column" alignItems="stretch" gap={1}>
        <Flex>
          <Field.Label action={labelAction}>
            {label || intlLabel?.defaultMessage || name}
          </Field.Label>
        </Flex>

        <div style={{ position: "relative" }}>
          <Field.Input
            type="text"
            value={localValue}
            onChange={handleChange}
            disabled={disabled || !editable}
            placeholder={
              autoGenerate
                ? "Auto-generated from fields"
                : "Click button to generate"
            }
            style={{ paddingRight: "40px" }}
          />
          {!autoGenerate && (
            <div
              style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                type="button"
                onClick={handleGenerate}
                disabled={disabled || fields.length === 0}
                variant="tertiary"
                aria-label="Generate composite value"
                style={{
                  width: "28px",
                  height: "28px",
                  padding: "0",
                  minWidth: "auto",
                  border: "none",
                  background: "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#8e8ea9",
                }}
              >
                <Play style={{ width: "14px", height: "14px" }} />
              </Button>
            </div>
          )}
        </div>

        {fields.length > 0 && (
          <Field.Hint>
            <Typography variant="pi" textColor="neutral600">
              Combines: {fields.join(", ")}
              {autoGenerate && " (auto-generated)"}
              {!editable && " (read-only)"}
            </Typography>
          </Field.Hint>
        )}

        <Field.Error />
      </Flex>
    </Field.Root>
  );
};

export default CompositeInput;
