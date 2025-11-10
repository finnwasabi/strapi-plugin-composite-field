# Strapi Plugin Composite Field

A Strapi v5 plugin that creates composite display fields by combining multiple text fields.

![Composite Field Demo](https://img.shields.io/badge/Strapi-v5-blue)
![npm version](https://img.shields.io/npm/v/@tunghtml/strapi-plugin-composite-field)
![License](https://img.shields.io/npm/l/@tunghtml/strapi-plugin-composite-field)

## Features

- 🔗 **Multiple Fields**: Combine any text/string fields
- 🔄 **Generate Button**: Click icon to generate composite value
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

| Option      | Type     | Default | Description                           |
| ----------- | -------- | ------- | ------------------------------------- |
| `fields`    | textarea | -       | Field names to combine (one per line) |
| `separator` | text     | `" - "` | Separator between fields              |

## Notes

- Only combines simple text/string fields
- Automatically adds spaces around separator for clean output
- Empty fields are skipped automatically
- Relation fields are not supported (use simple fields only)

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
