# Strapi Plugin Composite Field

A Strapi v5 plugin that creates composite display fields by combining multiple text fields.

![Composite Field Demo](https://img.shields.io/badge/Strapi-v5-blue)
![npm version](https://img.shields.io/npm/v/@tunghtml/strapi-plugin-composite-field)
![License](https://img.shields.io/npm/l/@tunghtml/strapi-plugin-composite-field)

## Features

- 🔗 **Multiple Fields**: Combine any text/string/enum fields
- 🔄 **Generate Button**: Click icon to generate composite value
- ⚡ **Auto-Generate**: Automatically update when source fields change
- 📝 **Easy Config**: Textarea input (one field per line)
- ⚙️ **Custom Separator**: Configure separator (default: " - ")
- ✨ **Smart Spacing**: Automatically handles spacing for separators
- 🎯 **Manual Edit Protection**: Preserves manual edits until source fields change
- 🎨 **Clean UI**: Matches Strapi admin design system

## Installation

```bash
npm install @tunghtml/strapi-plugin-composite-field
```

Then add the plugin to your `config/plugins.js`:

```javascript
module.exports = {
  // ...
  'composite-field': {
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
| `autoGenerate` | checkbox | `false` | Automatically generate when source fields change |

## Advanced Usage

### Auto-Generate Mode

Enable **Auto-generate** in Advanced settings to automatically update the composite field when any source field changes.

**Smart Manual Edit Protection**: When auto-generate is enabled, the plugin intelligently handles manual edits:

- If you manually edit the composite field, it will preserve your changes
- When any source field changes, auto-generation resumes with the new values
- This prevents accidental overwrites while maintaining automatic updates

### Space-Only Separator

When using a space `" "` as the separator, the plugin automatically uses a single space without adding extra spaces around it. For other separators like `-` or `|`, spaces are added around them for better readability.

Examples:

- Separator: `" "` → Result: `John Doe`
- Separator: `-` → Result: `John - Doe`

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

## Changelog

### v1.2.4 (2026-02-05)

**🎯 Improvements:**

- **Smart Manual Edit Protection**: Auto-generate now respects manual edits and only resumes when source fields change
- **Improved Separator Logic**: Space-only separators now use single space without extra padding
- **Removed Editable Option**: Simplified configuration by removing the unnecessary editable toggle

**🐛 Bug Fixes:**

- Fixed auto-generate overwriting manual edits immediately
- Fixed excessive spacing when using space as separator
- Improved change detection for more reliable auto-generation

**🔧 Technical:**

- Added `isManuallyEdited` state tracking
- Enhanced `watchedValues` change detection
- Optimized re-render performance

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
