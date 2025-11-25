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
    const formData = {};

    // Get values from text fields, selects, and enums
    fields.forEach((fieldPath) => {
      // Try to find input/textarea/select
      const input = document.querySelector(
        `input[name="${fieldPath}"], textarea[name="${fieldPath}"], select[name="${fieldPath}"]`
      );

      if (input && input.value) {
        formData[fieldPath] = input.value;
      } else {
        // Try to find enum field (Strapi v5 uses different structure)
        const enumSelect = document.querySelector(
          `[data-strapi-field-name="${fieldPath}"] select`
        );
        if (enumSelect && enumSelect.value) {
          formData[fieldPath] = enumSelect.value;
        }

        // Also try to find the selected option text for better display
        const enumButton = document.querySelector(
          `[data-strapi-field-name="${fieldPath}"] button[role="combobox"]`
        );
        if (enumButton) {
          const selectedText = enumButton.textContent?.trim();
          if (selectedText && selectedText !== "Select...") {
            formData[fieldPath] = selectedText;
          }
        }
      }
    });

    const parts = [];
    fields.forEach((fieldPath) => {
      const fieldValue = formData[fieldPath];
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
      const timeoutId = setTimeout(() => {
        handleGenerate();
      }, 300);
      return () => clearTimeout(timeoutId);
    };

    // Listen to input events on all fields
    const listeners = [];
    fields.forEach((fieldPath) => {
      const elements = document.querySelectorAll(
        `input[name="${fieldPath}"], textarea[name="${fieldPath}"], select[name="${fieldPath}"], [data-strapi-field-name="${fieldPath}"] select, [data-strapi-field-name="${fieldPath}"] button`
      );

      elements.forEach((element) => {
        element.addEventListener("change", handleFieldChange);
        element.addEventListener("input", handleFieldChange);
        listeners.push({ element, handler: handleFieldChange });
      });
    });

    return () => {
      listeners.forEach(({ element, handler }) => {
        element.removeEventListener("change", handler);
        element.removeEventListener("input", handler);
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
