# Strapi Plugin Composite Field

A Strapi v5 plugin that creates composite display fields by combining multiple text fields.

![Composite Field Demo](https://img.shields.io/badge/Strapi-v5-blue)
![npm version](https://img.shields.io/npm/v/@tunghtml/strapi-plugin-composite-field)
![License](https://img.shields.io/npm/l/@tunghtml/strapi-plugin-composite-field)

## Features

- 🔗 **Multiple Fields**: Combine any text/string/enum fields
- 🔄 **Generate Button**: Click icon to generate composite value
- ⚡ **Auto-Generate**: Automatically update when source fields change
- 🔒 **Editable Control**: Make field read-only or editable
- 📝 **Easy Config**: Textarea input (one field per line)
- ⚙️ **Custom Separator**: Configure separator (default: " - ")
- ✨ **Auto Spacing**: Automatically adds spaces around separator
- 🎨 **Clean UI**: Matches Strapi admin design system

## Installation

```bash
npm install @tunghtml/strapi-plugin-composite-field
```

Then add the plugin to your `config/plugins.js`:

```javascript
module.exports = {
  // ...
  "composite-field": {
    enabled: true,
  },
};
```

Rebuild your admin panel:

```bash
npm run build
npm run develop
```

## Usage

### 1. Add Custom Field

- Go to **Content-Type Builder**
- Select your content type (e.g., Corp Rep List)
- Click **"Add another field"**
- Choose **"Composite"** from custom fields
- Name it (e.g., `displayName`)

### 2. Configure Fields

**Fields to combine** (one per line):

```
salutation
firstName
lastName
email
```

**Separator** (optional, default: " - "):

```
-
```

### 3. Generate Value

- Fill in source fields (firstName, lastName, email, etc.)
- Click the **Play icon** button
- Composite field populates automatically with proper spacing!

## Examples

### Representative Display Name

```
Fields:
  salutation
  firstName
  lastName
  email

Separator: -

Result: Mr. - Tung - Le - tung@example.com
```

### Product SKU

```
Fields:
  category
  brand
  model

Separator: -

Result: Electronics - Apple - iPhone15
```

### Full Name

```
Fields:
  firstName
  lastName

Separator: (space)

Result: Tung Le
```

## Configuration Options

### Base Settings

| Option      | Type     | Default | Description                           |
| ----------- | -------- | ------- | ------------------------------------- |
| `fields`    | textarea | -       | Field names to combine (one per line) |
| `separator` | text     | `" - "` | Separator between fields              |

### Advanced Settings

| Option         | Type     | Default | Description                                      |
| -------------- | -------- | ------- | ------------------------------------------------ |
| `editable`     | checkbox | `true`  | Allow manual editing of the composite field      |
| `autoGenerate` | checkbox | `false` | Automatically generate when source fields change |

## Advanced Usage

### Auto-Generate Mode

Enable **Auto-generate** in Advanced settings to automatically update the composite field when any source field changes. This is useful for fields that should always reflect the current values.

### Read-Only Mode

Disable **Editable** in Advanced settings to make the composite field read-only. Users can only generate values using the button or auto-generate, but cannot manually edit the field.

### Enum Field Support

The plugin now supports enumeration fields! Simply include the enum field name in your fields list, and the plugin will automatically extract the selected value.

Example:

```
Fields:
  meetingType (enum)
  name

Result: Panel Discussion - John Doe
```

## Notes

- Supports text, string, and enumeration fields
- Automatically adds spaces around separator for clean output
- Empty fields are skipped automatically
- Relation fields are not supported (use simple fields only)
- Auto-generate uses a 300ms debounce to avoid excessive updates

## Requirements

- Strapi v5.0.0 or higher
- Node.js 18.x or higher

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Issues

If you encounter any issues, please report them at:
https://github.com/finnwasabi/strapi-plugin-composite-field/issues

## License

MIT

## Author

Tung Le - [@finnwasabi](https://github.com/finnwasabi)
