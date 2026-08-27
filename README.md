# 🍌 SoggyBanana

A free, open-source pixel-art and 2D animation editor built with vanilla HTML, CSS, and JavaScript. Professional-grade tools for creating pixel art, sprites, and animations directly in your browser.

## Features ✨

### Drawing Tools
- ✏️ **Pencil Tool** - Precise pixel drawing
- 🧹 **Eraser** - Clean removal of pixels
- 🎨 **Color Picker (Eyedropper)** - Sample colors from canvas
- 🎨 **Color Palette** - Quick access to 12 default colors
- 🌈 **Custom Colors** - Full color picker with hex input

### Canvas & Viewport
- 🔍 **Zoom In/Out** - 50% to 800% zoom levels
- 📏 **Pixel Grid** - Toggle grid overlay for precision
- ⚡ **Pixel-Perfect Rendering** - Crisp, pixelated output with no anti-aliasing

### Layers System
- 📚 **Multiple Layers** - Stack and organize artwork
- 👁️ **Layer Visibility Toggle** - Show/hide layers
- 🎯 **Layer Selection** - Select active layer for editing
- ➕ **Add/Delete Layers** - Build complex artwork
- Minimum 1 layer required to prevent accidents

### Animation Timeline
- 🎬 **Multiple Frames** - Create frame-by-frame animations
- ▶️ **Playback** - Preview animations with adjustable FPS
- ⏹️ **Playback Controls** - Play, stop, and frame selection
- 📋 **Frame Duplication** - Copy frames for consistency
- ➕ **Add/Delete Frames** - Build animations
- FPS Range: 1-60 frames per second
- Minimum 1 frame required

### History & Undo/Redo
- ↶ **Undo** - Revert last action (Ctrl+Z / Cmd+Z)
- ↷ **Redo** - Restore undone action (Ctrl+Y / Cmd+Y)
- 50-state history buffer

### Project Management
- 💾 **Save Projects** - Store to browser localStorage
- 📂 **Load Projects** - Retrieve saved projects
- 🆕 **New Project** - Start fresh workspace
- 📊 **Project List** - View all saved projects

### Export
- 🖼️ **PNG Export** - Export current frame as high-quality PNG
- 📦 **Downscale Support** - Export at original resolution or scaled up

## Keyboard Shortcuts ⌨️

| Key | Action |
|-----|--------|
| P | Pencil Tool |
| E | Eraser Tool |
| I | Eyedropper (Color Picker) |
| X | Swap Foreground/Background Colors |
| \+ | Zoom In |
| \- | Zoom Out |
| Ctrl+Z / Cmd+Z | Undo |
| Ctrl+Y / Cmd+Y | Redo |

## How to Use 🚀

### Getting Started
1. Open `index.html` in a modern web browser
2. Start drawing on the canvas using the Pencil tool
3. Switch tools using the left sidebar

### Drawing
- Select **Pencil** tool from the Tools panel
- Click on the color box to choose a color or pick from the palette
- Click and drag on the canvas to draw
- Use zoom controls to get a closer view

### Working with Layers
1. Use **+ Layer** button to add new layers
2. Click layer names to select them
3. Click the 👁️ icon to toggle layer visibility
4. Use **Delete** button to remove layers

### Creating Animations
1. Click **+ Frame** to add animation frames
2. Each frame captures the current state of all layers
3. Modify layers and add new frames for animation
4. Use **Duplicate** to copy frames
5. Click **Play** to preview your animation
6. Adjust **FPS** (frames per second) for playback speed

### Saving & Loading
- Click **Save** to store project in browser storage
- Click **Open** to load a saved project
- Click **Export** to download current frame as PNG

### Exporting
- Click **Export** button
- Enter filename (default: project name)
- PNG file downloads to your computer

## Project Structure 📁

```
SoggyBanana/
├── index.html       # Main HTML structure and layout
├── styles.css       # Professional dark theme styling
├── app.js          # Main application controller
├── canvas.js       # Canvas rendering and pixel grid
├── tools.js        # Drawing tools (pencil, eraser, eyedropper)
├── layers.js       # Layer system and pixel storage
├── timeline.js     # Animation frames and playback
├── history.js      # Undo/redo state management
├── storage.js      # Project save/load to localStorage
├── export.js       # PNG export functionality
└── README.md       # This file
```

## Technical Details 🔧

### Architecture
- **Modular Design** - Each system (canvas, tools, layers, timeline) is independent
- **Class-Based** - Uses ES6 classes for clean, organized code
- **No Dependencies** - Pure vanilla JavaScript, HTML, and CSS

### Canvas Management
- 64x64 pixel default canvas
- Pixel-perfect rendering with `image-rendering: crisp-edges`
- Configurable zoom levels
- Optional grid overlay

### Layer Storage
- Each layer stores pixel data as Uint8ClampedArray (RGBA)
- Efficient memory usage with direct pixel manipulation
- Layers can be independently shown/hidden

### Animation System
- Frame-based animation with adjustable playback speed
- Each frame stores independent layer data
- Smooth playback with requestAnimationFrame

### History System
- Stack-based undo/redo with configurable buffer size
- Automatically saves state before drawing
- Prevents infinite history growth

## Browser Compatibility 🌐

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Any modern browser with ES6 and Canvas API support

## Future Features 🚧

- [ ] Selection tools (rectangle, freehand)
- [ ] Fill bucket tool
- [ ] Line and shape drawing
- [ ] Brush size adjustment
- [ ] Onion skin for animation preview
- [ ] Sprite sheet support
- [ ] GIF export
- [ ] Desktop app (Electron)
- [ ] Cloud project sync
- [ ] Collaboration features
- [ ] Plugin system

## License 📄

MIT License - Free to use, modify, and distribute

## Contributing 🤝

Contributions welcome! Help us improve SoggyBanana by:
- Reporting bugs
- Suggesting features
- Submitting pull requests
- Improving documentation

## Version 📌

**v0.1.0** - Foundation Release
- Core drawing tools
- Layer system
- Animation timeline
- Project management
- PNG export

---

**Made with 🍌 by the SoggyBanana team**

*Pixel art should be delicious and easy. That's the SoggyBanana way.*
