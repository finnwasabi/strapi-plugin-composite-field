import { Button, Field, Flex, Typography } from '@strapi/design-system';
import { Play } from '@strapi/icons';
import { unstable_useContentManagerContext as useContentManagerContext } from '@strapi/strapi/admin';
import get from 'lodash/get';
import React from 'react';
import { useIntl } from 'react-intl';

const ISO_DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})(T[\d:.]+Z?)?$/;
const TIME_REGEX = /^(\d{2}):(\d{2}):(\d{2})(\.\d{3})?$/;

// Format a source value for display (especially time/date)
const formatFieldValue = (val) => {
  if (val === null || val === undefined) return '';

  // If it's a Date object
  if (val instanceof Date) {
    return val.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  const stringVal = String(val);

  // ISO date (YYYY-MM-DDTHH:MM:SS.sssZ or YYYY-MM-DD) => MM/DD/YYYY
  const dateMatch = ISO_DATE_REGEX.exec(stringVal);
  if (dateMatch) {
    const [, year, month, day] = dateMatch;
    return `${month}/${day}/${year}`;
  }

  // Time (HH:MM:SS.mmm or HH:MM:SS) => HH:MM
  const timeMatch = TIME_REGEX.exec(stringVal);
  if (timeMatch) {
    return `${timeMatch[1]}:${timeMatch[2]}`;
  }

  return stringVal;
};

// Text of one source value: relations/objects use their name, title or label
const toDisplayText = (rawValue) => {
  if (rawValue === null || rawValue === undefined) return '';
  if (typeof rawValue === 'object' && !(rawValue instanceof Date)) {
    return String(rawValue.name || rawValue.title || rawValue.label || '');
  }
  return formatFieldValue(rawValue);
};

// A space-only separator joins with single spaces, other separators get spaces around them
const joinParts = (parts, separator) => {
  const cleanSeparator = separator.trim();
  return cleanSeparator === ''
    ? parts.join(' ').trim()
    : parts.join(` ${cleanSeparator} `).trim();
};

const CompositeInput = (props) => {
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
  const { form } = useContentManagerContext();
  const { values } = form;

  const [localValue, setLocalValue] = React.useState(value || '');
  const [isManuallyEdited, setIsManuallyEdited] = React.useState(false);

  const lastGeneratedVal = React.useRef(value || '');
  // Source values the field was last generated from; null until the form has loaded
  const lastWatchedValues = React.useRef(null);

  React.useEffect(() => {
    const validValue = value || '';
    // A value this field did not produce (another entry loaded, form reset) is a new baseline
    if (validValue !== lastGeneratedVal.current) {
      lastWatchedValues.current = null;
    }
    setLocalValue(validValue);
    lastGeneratedVal.current = validValue;
    // Reset manual edit flag when value changes from outside (e.g., form reset)
    setIsManuallyEdited(false);
  }, [value]);

  const fieldsConfig = attribute?.options?.fields || '';
  const separator = attribute?.options?.separator || ' - ';
  const autoGenerate = attribute?.options?.autoGenerate === true;

  // Parse fields
  const fields = React.useMemo(() => {
    if (typeof fieldsConfig === 'string') {
      return fieldsConfig
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean);
    }
    return [];
  }, [fieldsConfig]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    lastGeneratedVal.current = newValue;
    // Mark as manually edited when user types
    setIsManuallyEdited(true);
    if (onChange) {
      onChange({ target: { name, value: newValue, type: 'text' } });
    }
  };

  const handleGenerate = React.useCallback(() => {
    // Calculate parent path to resolve relative field names
    const parts = name.split('.');

    parts.pop(); // Remove current field name
    const parentPath = parts.join('.');

    const generatedParts = fields
      .map((fieldName) => {
        // Resolve full path for the target field
        const fullPath = parentPath ? `${parentPath}.${fieldName}` : fieldName;
        return toDisplayText(get(values, fullPath));
      })
      .filter(Boolean);

    const result = joinParts(generatedParts, separator);

    if (result !== lastGeneratedVal.current) {
      setLocalValue(result);
      lastGeneratedVal.current = result;
      // Reset manual edit flag when auto-generating
      setIsManuallyEdited(false);

      if (onChange) {
        onChange({ target: { name, value: result, type: 'text' } });
      }
    }
  }, [fields, separator, onChange, name, values]);

  // Watch only the relevant field values to trigger auto-generation
  const watchedValues = React.useMemo(() => {
    const parts = name.split('.');
    parts.pop();
    const parentPath = parts.join('.');

    return fields.map((fieldName) => {
      const fullPath = parentPath ? `${parentPath}.${fieldName}` : fieldName;
      return get(values, fullPath);
    });
  }, [fields, name, values]);

  // Auto-generate when watched values change
  React.useEffect(() => {
    if (!autoGenerate || fields.length === 0) return;

    // Check if watched values actually changed
    const currentWatchedValues = JSON.stringify(watchedValues);

    // Keep the saved value when an entry opens: regenerating it there marks the form as
    // modified and overwrites values written by the server on the next save
    if (lastWatchedValues.current === null) {
      lastWatchedValues.current = currentWatchedValues;
      return;
    }

    // Only auto-generate if:
    // 1. Values actually changed
    // 2. User hasn't manually edited the field
    if (currentWatchedValues !== lastWatchedValues.current) {
      lastWatchedValues.current = currentWatchedValues;

      if (!isManuallyEdited) {
        const timeoutId = setTimeout(() => {
          handleGenerate();
        }, 300); // Debounce

        return () => clearTimeout(timeoutId);
      } else {
        // If manually edited, reset the flag when source fields change
        // This allows auto-generation to resume after source field changes
        setIsManuallyEdited(false);
      }
    }
  }, [autoGenerate, fields, handleGenerate, watchedValues, isManuallyEdited]);

  if (!props) {
    return null;
  }

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

        <div style={{ position: 'relative' }}>
          <Field.Input
            type="text"
            value={localValue}
            onChange={handleChange}
            disabled={disabled}
            placeholder={
              autoGenerate
                ? 'Auto-generated from fields'
                : 'Click button to generate'
            }
            style={{ paddingRight: '40px' }}
          />
          {!autoGenerate && (
            <div
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Button
                type="button"
                onClick={handleGenerate}
                disabled={disabled || fields.length === 0}
                variant="tertiary"
                aria-label="Generate composite value"
                style={{
                  width: '28px',
                  height: '28px',
                  padding: '0',
                  minWidth: 'auto',
                  border: 'none',
                  background: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#8e8ea9',
                }}
              >
                <Play style={{ width: '14px', height: '14px' }} />
              </Button>
            </div>
          )}
        </div>

        {fields.length > 0 && (
          <Field.Hint>
            <Typography variant="pi" textColor="neutral600">
              Combines: {fields.join(', ')}
              {autoGenerate && ' (auto-generated)'}
            </Typography>
          </Field.Hint>
        )}

        <Field.Error />
      </Flex>
    </Field.Root>
  );
};

export default CompositeInput;
