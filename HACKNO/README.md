# Assistive Learning Portal + Extension

A complete client-side learning platform with browser extension for text highlighting, note-taking, and accessibility features.

## Features

### Portal (HTML/CSS/JS)
- ✅ **Task 1**: NLP language detection and processing
- ✅ **Task 2**: Display highlights and personal notes from extension
- ✅ **Task 3**: Progress tracking with badges, levels, and scoreboard
- ✅ **Task 4**: Dark mode, high contrast, dyslexia-friendly fonts

### Browser Extension
- ✅ **Task 1**: Real-time NLP processing of selected text
- ✅ **Task 2**: Text highlighting and note-taking functionality
- ✅ **Task 4**: Accessibility settings sync with portal

## Quick Start

### 1. Portal Setup
1. Open `index.html` in your browser
2. Login with demo credentials:
   - Username: `demo`
   - Password: `demo123`
3. Or create a new account

### 2. Extension Installation
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `extension/` folder
4. The extension icon should appear in your toolbar

### 3. Usage
1. Visit any webpage
2. Select text to see highlighting options
3. Use keyboard shortcuts:
   - `Ctrl+H`: Highlight text
   - `Ctrl+N`: Add note
   - `Ctrl+S`: Speak text
4. View progress and badges in the portal

## File Structure

```
├── index.html              # Main portal page
├── style.css              # Portal styles with accessibility themes
├── js/
│   ├── main.js            # Portal application logic
│   ├── localAdapter.js    # Data management (localStorage/JSON)
│   └── aiAdapter.js       # NLP and accessibility features
├── data/                  # Sample JSON data files
│   ├── users.json
│   ├── progress.json
│   ├── badges.json
│   └── levels.json
└── extension/             # Browser extension
    ├── manifest.json      # Extension configuration
    ├── content.js         # Main extension functionality
    ├── content.css        # Extension styles
    ├── popup.html         # Extension popup interface
    ├── popup.js           # Popup functionality
    └── background.js      # Background service worker
```

## Key Features

### Accessibility (Task 4)
- **Dark Mode**: Toggle between light and dark themes
- **High Contrast**: Enhanced contrast for better visibility
- **Dyslexia-Friendly Font**: Alternative font option
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: ARIA labels and announcements
- **Focus Management**: Clear focus indicators

### NLP Processing (Task 1)
- **Language Detection**: Automatic detection of English/Spanish
- **Text Analysis**: Word count, complexity, reading time
- **Keyword Extraction**: Identify important terms
- **Speech Synthesis**: Text-to-speech functionality
- **Translation**: Basic translation capabilities

### Highlighting & Notes (Task 2)
- **Text Selection**: Click and drag to select text
- **Context Menu**: Right-click options for quick actions
- **Personal Notes**: Add private notes to highlights
- **Visual Indicators**: Color-coded highlights with note badges
- **Persistent Storage**: Highlights saved across sessions

### Progress Tracking (Task 3)
- **Points System**: Earn points for activities
- **Level Progression**: Automatic level advancement
- **Badge System**: Achievement badges for milestones
- **Scoreboard**: Compare progress with other users
- **Activity History**: View all highlights and notes

## Data Storage

All data is stored locally using:
- **localStorage**: User preferences and session data
- **Chrome Storage API**: Extension data and highlights
- **JSON Files**: Sample data structure (can be replaced with real backend)

## Synchronization

The extension and portal communicate via:
- **BroadcastChannel**: Real-time updates between tabs
- **localStorage**: Shared data access
- **Chrome Storage**: Extension-specific data

## Admin Features

Admin users can:
- View all user progress and statistics
- Export data as JSON files
- Monitor system usage and activity

## Browser Compatibility

- **Chrome/Edge**: Full support (Manifest V3)
- **Firefox**: Requires manifest adaptation
- **Safari**: Requires WebKit-specific changes

## Development Notes

### Extending the System
1. **Add New Languages**: Update `aiAdapter.js` translations
2. **New Badge Types**: Modify badge rules in `localAdapter.js`
3. **Custom Themes**: Add CSS variables in `style.css`
4. **Additional NLP**: Enhance processing in `aiAdapter.js`

### Security Considerations
- Passwords are base64 encoded (use proper hashing in production)
- No external API calls (fully offline)
- Local data only (no server communication)

## Testing

### Portal Testing
1. Open `index.html` in browser
2. Test login/registration
3. Verify theme toggles work
4. Check responsive design on mobile

### Extension Testing
1. Install extension in Chrome
2. Visit any webpage
3. Test text selection and highlighting
4. Verify popup functionality
5. Check data synchronization with portal

## Troubleshooting

### Common Issues
1. **Extension not loading**: Check manifest.json syntax
2. **Data not syncing**: Verify BroadcastChannel support
3. **Styles not applying**: Check CSS variable support
4. **Speech not working**: Verify Web Speech API support

### Debug Mode
- Open browser DevTools
- Check console for error messages
- Inspect localStorage for data integrity
- Verify extension permissions

## Future Enhancements

- Real backend integration
- Advanced NLP with external APIs
- Collaborative features
- Mobile app companion
- Advanced analytics dashboard
- Export to various formats (PDF, Word, etc.)

## License

MIT License - Feel free to modify and distribute.