import React from "react";
import { Field, Flex, Button, Typography } from "@strapi/design-system";
import { Play } from "@strapi/icons";
import { useIntl } from "react-intl";
import { useCMEditViewDataManager } from "@strapi/strapi/admin";

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

  // Get form data from Strapi's context
  const { modifiedData } = useCMEditViewDataManager();

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

    // Get values directly from Strapi's form context (modifiedData)
    fields.forEach((fieldPath) => {
      // Get value from form data
      const fieldValue = modifiedData?.[fieldPath];

      if (
        fieldValue !== null &&
        fieldValue !== undefined &&
        fieldValue !== ""
      ) {
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
  }, [fields, separator, onChange, name, modifiedData]);

  // Auto-generate when fields change
  React.useEffect(() => {
    if (!autoGenerate || fields.length === 0 || !modifiedData) return;

    // Debounce to avoid too many updates
    const timeoutId = setTimeout(() => {
      handleGenerate();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [autoGenerate, fields, modifiedData, handleGenerate]);

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
