const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'social-media-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Data file paths
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const POSTS_FILE = path.join(__dirname, 'data', 'posts.json');

// Initialize data files if they don't exist
function initializeDataFiles() {
  if (!fs.existsSync('data')) {
    fs.mkdirSync('data');
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
  }
  if (!fs.existsSync(POSTS_FILE)) {
    fs.writeFileSync(POSTS_FILE, JSON.stringify([]));
  }
}

// Helper functions
function readUsers() {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  } catch (error) {
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function readPosts() {
  try {
    return JSON.parse(fs.readFileSync(POSTS_FILE, 'utf8'));
  } catch (error) {
    return [];
  }
}

function writePosts(posts) {
  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
}

// Authentication middleware
function requireAuth(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ error: 'Authentication required' });
  }
}

// Routes

// Serve login page
app.get('/', (req, res) => {
  if (req.session.userId) {
    res.redirect('/feed');
  } else {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

// Serve feed page
app.get('/feed', (req, res) => {
  if (req.session.userId) {
    res.sendFile(path.join(__dirname, 'public', 'feed.html'));
  } else {
    res.redirect('/');
  }
});

// User registration
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;
    
    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const users = readUsers();
    
    // Check if user already exists
    if (users.find(user => user.username === username || user.email === email)) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      firstName,
      lastName,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeUsers(users);

    // Create session
    req.session.userId = newUser.id;
    req.session.username = newUser.username;

    res.json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const users = readUsers();
    const user = users.find(u => u.username === username || u.email === username);

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Create session
    req.session.userId = user.id;
    req.session.username = user.username;

    res.json({ success: true, message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User logout
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Could not log out' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// Get current user info
app.get('/api/user', requireAuth, (req, res) => {
  const users = readUsers();
  const user = users.find(u => u.id === req.session.userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// Create a new post
app.post('/api/posts', requireAuth, (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Post content is required' });
    }

    const posts = readPosts();
    const users = readUsers();
    const user = users.find(u => u.id === req.session.userId);

    const newPost = {
      id: Date.now().toString(),
      userId: req.session.userId,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      likes: [],
      comments: []
    };

    posts.unshift(newPost); // Add to beginning of array
    writePosts(posts);

    res.json({ success: true, post: newPost });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all posts
app.get('/api/posts', requireAuth, (req, res) => {
  try {
    const posts = readPosts();
    res.json(posts);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Like/unlike a post
app.post('/api/posts/:postId/like', requireAuth, (req, res) => {
  try {
    const { postId } = req.params;
    const posts = readPosts();
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex === -1) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const post = posts[postIndex];
    const userLikeIndex = post.likes.indexOf(req.session.userId);

    if (userLikeIndex === -1) {
      // Like the post
      post.likes.push(req.session.userId);
    } else {
      // Unlike the post
      post.likes.splice(userLikeIndex, 1);
    }

    posts[postIndex] = post;
    writePosts(posts);

    res.json({ success: true, likesCount: post.likes.length, liked: userLikeIndex === -1 });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Initialize data files
initializeDataFiles();

// Start server
app.listen(PORT, () => {
  console.log(`Social Media App running on http://localhost:${PORT}`);
});