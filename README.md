# RePrompt Chrome Extension

A Chrome Extension that extracts AI prompts from YouTube and Instagram videos.

## 📁 Project Structure

```
chrome-extension/
├── src/
│   ├── types/           # TypeScript type definitions
│   │   └── chrome.d.ts
│   ├── common/          # Common utilities and constants
│   │   ├── constants.ts
│   │   └── utils.ts
│   ├── content/         # Content Scripts
│   │   └── content.ts
│   ├── popup/           # Popup related files
│   │   ├── popup.html
│   │   └── popup.ts
│   └── background/      # Background Scripts (planned)
│       └── background.ts
├── public/              # Static resources
│   ├── manifest.json
│   └── icons/
│       └── icon.png
├── dist/                # Build output
└── docs/                # Documentation
```

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Production Build

```bash
npm run build:prod
```

## 🔧 Development Environment

- **TypeScript**: Using TypeScript for type safety
- **Vite**: Fast bundling and development server
- **React**: Modern UI components (optional)
- **ESLint**: Code quality management

## 📦 Chrome Extension Installation

1. Build with `npm run build:prod`
2. Go to `chrome://extensions/` in Chrome browser
3. Enable "Developer mode"
4. Click "Load unpacked extension"
5. Select the `dist` folder

## 🛠️ Key Features

- **Video Information Extraction**: Extract title and description from YouTube and Instagram videos
- **Platform Detection**: Automatically detect current platform
- **Type Safety**: Type-safe code implemented with TypeScript
- **Modern UI**: Clean and intuitive user interface

## 📝 Script Commands

- `npm run dev`: Development mode (watch mode)
- `npm run build`: Build
- `npm run build:prod`: Production build (including asset copying)
- `npm run lint`: Code linting
- `npm run clean`: Clean build folder

## 🌟 Improvements

### 1. Structured Folder System
- Clearly separated folder structure by functionality
- Increased reusability of common logic

### 2. TypeScript Support
- Ensured type safety
- Enhanced developer experience
- Chrome API type support

### 3. Modern Build System
- Fast build using Vite
- Real-time updates during development
- Optimized bundling

### 4. Enhanced UX
- Intuitive popup interface
- Loading state display
- Error handling

## 🔄 Migration Guide

Key changes migrated from old structure to new structure:

1. **File Location Changes**:
   - `popup/` → `src/popup/`
   - `content.js` → `src/content/content.ts`
   - `manifest.json` → `public/manifest.json`

2. **TypeScript Introduction**:
   - Converted JavaScript files to TypeScript
   - Added type definitions

3. **Build System Improvements**:
   - Optimized Vite configuration
   - Multiple entry point support

## 🤝 Contributing

1. Fork this repository
2. Create a new feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Create a Pull Request

## 📄 License

This project is distributed under the MIT License.
# re-prompt-chrome-extension
