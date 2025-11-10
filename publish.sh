#!/bin/bash

echo "🚀 Publishing Strapi Plugin Composite Field..."

# Check if logged in to npm
if ! npm whoami &> /dev/null; then
    echo "❌ Not logged in to npm. Please run: npm login"
    exit 1
fi

# Build plugin
echo "📦 Building plugin..."
npm run build

# Git operations
echo "📝 Committing to git..."
git add .
git commit -m "Release v1.0.0: Strapi v5 Composite Field Plugin" || true

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
if ! git remote | grep -q origin; then
    git remote add origin https://github.com/finnwasabi/strapi-plugin-composite-field.git
fi
git branch -M main
git push -u origin main

# Publish to npm
echo "📤 Publishing to npm..."
npm publish --access public

echo "✅ Published successfully!"
echo "📦 Package: @tunghtml/strapi-plugin-composite-field"
echo "🔗 GitHub: https://github.com/finnwasabi/strapi-plugin-composite-field"
