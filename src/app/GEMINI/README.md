# Prodense AI Chat

A modern, feature-rich chat interface powered by Prodense Prodense AI model.

## Features

### 🤖 AI Capabilities
- **Prodense Integration**: Powered by Prodense advanced Prodense model
- **Intelligent Responses**: Natural language understanding and generation
- **Context Awareness**: Maintains conversation context throughout sessions
- **Error Handling**: Graceful error handling with user-friendly messages

### 💬 Chat Interface
- **Real-time Messaging**: Instant message sending and receiving
- **Message History**: Persistent chat history with local storage
- **Multiple Sessions**: Create and manage multiple chat sessions
- **Session Management**: Switch between sessions, rename, and delete
- **Auto-scroll**: Automatic scrolling to latest messages

### 🎨 User Experience
- **Dark/Light Mode**: Toggle between dark and light themes
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Typing Indicators**: Visual feedback when AI is generating responses
- **Welcome Screen**: Guided onboarding with suggested prompts
- **Keyboard Shortcuts**: Quick actions with keyboard shortcuts

### 🔧 Technical Features
- **TypeScript**: Full type safety throughout the application
- **Local Storage**: Persistent data storage in browser
- **Component Architecture**: Modular, reusable components
- **Custom Hooks**: Centralized state management with custom hooks
- **Animations**: Smooth animations with Framer Motion

## File Structure

```
src/app/GEMINI/
├── page.tsx              # Main chat page component
├── layout.tsx            # Layout wrapper with metadata
└── README.md            # This documentation

src/components/GEMINI/
├── ChatMessage.tsx       # Individual message component
├── ChatSidebar.tsx       # Sidebar with session management
├── TypingIndicator.tsx   # Loading animation component
└── WelcomeScreen.tsx     # Welcome screen with suggestions

src/hooks/
└── useGeminiChat.ts      # Custom hook for chat functionality

src/lib/
├── gemini.ts            # Prodense AI API configuration
└── storage.ts           # Local storage utilities

src/types/
└── gemini.ts            # TypeScript type definitions
```

## Usage

### Basic Chat
1. Navigate to `/GEMINI`
2. Type your message in the input field
3. Press Enter or click the send button
4. View AI responses in real-time

### Session Management
- **New Session**: Click "New Chat" or use Ctrl/Cmd + N
- **Switch Sessions**: Click on any session in the sidebar
- **Delete Session**: Hover over a session and click the trash icon
- **Clear Chat**: Click "Clear Chat" to remove all messages from current session

### Keyboard Shortcuts
- `Ctrl/Cmd + N`: Create new chat session
- `Ctrl/Cmd + K`: Focus on input field
- `Enter`: Send message
- `Shift + Enter`: New line in message

### Suggested Prompts
The welcome screen provides suggested prompts in categories:
- **Creative Ideas**: Brainstorming and creative assistance
- **Code Help**: Programming and technical questions
- **Writing Assistant**: Content creation and editing
- **Learning**: Educational questions and explanations

## Configuration

### API Key
The Gemini API key is configured in `src/lib/gemini.ts`:
```typescript
const GEMINI_API_KEY = 'AIzaSyAaNVQW0KuVwtUE6vQmwvTLtkKsfWdIXGQ'
```

### Model Settings
- **Model**: gemini-pro
- **Temperature**: 0.7 (creativity level)
- **Max Tokens**: 8192
- **Safety Settings**: Medium and above blocking

### Storage Settings
- **Max Sessions**: 50 (configurable)
- **Auto-save**: Enabled by default
- **Data Persistence**: Browser localStorage

## Customization

### Themes
The interface supports both dark and light modes with:
- Automatic theme persistence
- Smooth transitions between modes
- Consistent color scheme throughout

### Styling
- **Primary Color**: #D35C2F (Prodense brand color)
- **Typography**: System fonts with proper hierarchy
- **Animations**: Framer Motion for smooth interactions
- **Responsive**: Mobile-first design approach

## Error Handling

The application includes comprehensive error handling:
- **Network Errors**: Graceful handling of connection issues
- **API Errors**: User-friendly error messages
- **Storage Errors**: Fallback when localStorage is unavailable
- **Input Validation**: Prevents empty or invalid messages

## Performance

### Optimizations
- **Lazy Loading**: Components loaded on demand
- **Memoization**: Optimized re-renders with React hooks
- **Efficient Storage**: Minimal localStorage usage
- **Debounced Actions**: Prevents excessive API calls

### Monitoring
- **Error Logging**: Console logging for debugging
- **Performance Metrics**: Built-in performance tracking
- **User Analytics**: Ready for analytics integration

## Security

### Data Protection
- **Local Storage**: All data stored locally in browser
- **No Server Storage**: No chat data sent to external servers
- **API Key Security**: Consider environment variables for production
- **Content Filtering**: Gemini's built-in safety filters

### Privacy
- **No Tracking**: No user tracking or analytics by default
- **Data Control**: Users can clear all data anytime
- **Offline Capable**: Works without internet for stored sessions

## Development

### Getting Started
1. Ensure the Gemini API dependency is installed:
   ```bash
   npm install @google/generative-ai
   ```

2. Navigate to the GEMINI page:
   ```
   http://localhost:3000/GEMINI
   ```

### Adding Features
- **New Components**: Add to `src/components/GEMINI/`
- **New Hooks**: Add to `src/hooks/`
- **New Types**: Add to `src/types/gemini.ts`
- **New Utilities**: Add to `src/lib/`

### Testing
- Test all chat functionality
- Verify session management
- Check responsive design
- Test keyboard shortcuts
- Validate error handling

## Future Enhancements

### Planned Features
- **File Upload**: Support for image and document uploads
- **Voice Input**: Speech-to-text functionality
- **Export Chat**: Export conversations to various formats
- **Search**: Search through chat history
- **Themes**: Additional theme options
- **Plugins**: Extensible plugin system

### Technical Improvements
- **Streaming**: Real-time response streaming
- **Caching**: Intelligent response caching
- **Offline Mode**: Full offline functionality
- **PWA**: Progressive Web App features
- **Analytics**: Usage analytics and insights

## Support

For issues or questions:
1. Check the console for error messages
2. Verify API key configuration
3. Clear browser storage if needed
4. Check network connectivity

## License

This implementation is part of the Prodense project and follows the project's licensing terms.