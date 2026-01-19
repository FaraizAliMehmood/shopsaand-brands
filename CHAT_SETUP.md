# Chat Setup Instructions

## Overview
This guide will help you set up the one-to-one chat functionality with Socket.io integration.

## Features
- ✅ Real-time messaging with Socket.io
- ✅ Responsive design for mobile and desktop
- ✅ Typing indicators
- ✅ Online/offline status
- ✅ Message timestamps
- ✅ Clean, modern UI with Tailwind CSS

## Installation

### 1. Install Socket.io Client
```bash
npm install socket.io-client
```

### 2. Install Server Dependencies
```bash
# Copy server-package.json to package.json for the server
cp server-package.json package.json

# Install server dependencies
npm install
```

### 3. Environment Variables
Create a `.env` file in your React app root:
```env
REACT_APP_SOCKET_URL=http://localhost:3001
```

## Usage

### 1. Start the Chat Server
```bash
node chat-server.js
```

### 2. Use the Chat Component
```tsx
import Chat from './pages/Chat';

function App() {
  return (
    <Chat
      currentUserId="user1"
      otherUserId="user2"
      otherUserName="John Doe"
      otherUserAvatar="https://example.com/avatar.jpg" // optional
    />
  );
}
```

## Chat Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `currentUserId` | string | ✅ | ID of the current user |
| `otherUserId` | string | ✅ | ID of the other user in the chat |
| `otherUserName` | string | ✅ | Display name of the other user |
| `otherUserAvatar` | string | ❌ | Avatar URL of the other user |

## Server Features

- **Room Management**: Automatically creates rooms for user pairs
- **Message Broadcasting**: Real-time message delivery
- **Typing Indicators**: Shows when users are typing
- **Connection Management**: Tracks online/offline status
- **Health Check**: `/health` endpoint for monitoring

## Customization

### Styling
The chat component uses Tailwind CSS classes. You can customize:
- Colors: Change `bg-blue-500` to your brand colors
- Spacing: Modify padding and margins
- Typography: Update font sizes and weights

### Socket Events
The component handles these Socket.io events:
- `join-chat`: Join a chat room
- `message`: Send/receive messages
- `typing`: Typing indicators
- `user-typing`: Receive typing status
- `previous-messages`: Load chat history

## Mobile Responsiveness

The chat is fully responsive with:
- Flexible message bubbles
- Touch-friendly input areas
- Optimized spacing for mobile screens
- Responsive header with user info

## Troubleshooting

### Connection Issues
1. Check if the server is running on the correct port
2. Verify the `REACT_APP_SOCKET_URL` environment variable
3. Check browser console for connection errors

### Message Not Sending
1. Ensure both users are connected to the same room
2. Check server logs for errors
3. Verify message format matches the interface

## Production Considerations

1. **Database Integration**: Store messages in a database
2. **Authentication**: Add user authentication
3. **Message Persistence**: Implement message history
4. **Rate Limiting**: Prevent message spam
5. **SSL/HTTPS**: Use secure connections in production

## Example Integration

```tsx
// In your main app or routing
import Chat from './pages/Chat';

const ChatPage = () => {
  const currentUser = { id: 'user123', name: 'Current User' };
  const otherUser = { id: 'user456', name: 'Other User' };

  return (
    <Chat
      currentUserId={currentUser.id}
      otherUserId={otherUser.id}
      otherUserName={otherUser.name}
      otherUserAvatar={otherUser.avatar}
    />
  );
};
```

## Support

For issues or questions, check the Socket.io documentation or create an issue in the project repository.
