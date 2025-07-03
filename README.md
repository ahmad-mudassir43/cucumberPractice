# SocialConnect - Facebook-like Social Media Application

A modern, responsive social media web application built with Node.js, Express.js, and vanilla JavaScript. Features user authentication, post creation, feed functionality, and real-time interactions.

## Features

- **User Authentication**
  - User registration with email validation
  - Secure login with password hashing (bcrypt)
  - Session management
  - Form validation and real-time feedback

- **Social Feed**
  - Create and share posts
  - View chronological feed of all posts
  - Like/unlike posts with real-time updates
  - Auto-refreshing feed (every 30 seconds)
  - Character limit (500 characters per post)

- **User Interface**
  - Modern, responsive design
  - Facebook-inspired UI/UX
  - Mobile-friendly layout
  - Toast notifications for user feedback
  - Loading states and animations

- **User Management**
  - User profiles with first name, last name, username
  - Secure logout functionality
  - User dropdown menu

## Technology Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Authentication**: Express-session, bcrypt
- **Storage**: JSON files (users.json, posts.json)
- **Styling**: Modern CSS with gradients, animations, and responsive design
- **Icons**: Font Awesome 6

## Project Structure

```
social-media-app/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── data/                  # JSON storage files
│   ├── users.json        # User data
│   └── posts.json        # Posts data
└── public/               # Frontend files
    ├── index.html        # Login/registration page
    ├── feed.html         # Main feed page
    ├── styles.css        # Application styles
    ├── auth.js          # Authentication JavaScript
    └── app.js           # Main application JavaScript
```

## Installation and Setup

1. **Clone or create the project**
   ```bash
   git clone <repository-url>
   cd social-media-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   
   Or for production:
   ```bash
   npm start
   ```

4. **Access the application**
   - Open your browser and go to `http://localhost:3000`
   - Create a new account or login with existing credentials

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user
- `GET /api/user` - Get current user info

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create a new post
- `POST /api/posts/:postId/like` - Like/unlike a post

### Pages
- `GET /` - Login/registration page
- `GET /feed` - Main feed page (requires authentication)

## Features in Detail

### Authentication System
- Secure password hashing using bcrypt
- Session-based authentication
- Real-time form validation
- Automatic redirect based on authentication status

### Post System
- Create posts with up to 500 characters
- Auto-expanding textarea
- Real-time character count
- Chronological feed display
- Like/unlike functionality with immediate UI updates

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interface
- Optimized for various screen sizes

## Security Features

- Password hashing with bcrypt (salt rounds: 10)
- Session management with secure cookies
- Input validation and sanitization
- XSS protection through proper HTML escaping
- CSRF protection through session tokens

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Development

### Running in Development Mode
```bash
npm run dev
```
This uses nodemon for automatic server restarts on file changes.

### Project Structure Decisions
- **JSON File Storage**: Simple file-based storage for easy setup and demonstration
- **Vanilla JavaScript**: No frontend frameworks for simplicity and learning
- **Session-based Auth**: Traditional session management for web applications
- **Modular CSS**: Organized styles with clear component separation

## Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] File upload for images/videos
- [ ] Comments system
- [ ] Real-time notifications
- [ ] Friend/follow system
- [ ] Advanced user profiles
- [ ] Search functionality
- [ ] Private messaging
- [ ] Post editing and deletion

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for learning and development.

---

**Note**: This is a demonstration application. For production use, consider implementing a proper database, additional security measures, and error handling.
