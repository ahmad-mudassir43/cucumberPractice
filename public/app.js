// DOM elements
const postContentTextarea = document.getElementById('postContent');
const postButton = document.getElementById('postButton');
const postsContainer = document.getElementById('postsContainer');
const loadingPosts = document.getElementById('loadingPosts');
const toast = document.getElementById('toast');
const userFullName = document.getElementById('userFullName');
const userUsername = document.getElementById('userUsername');
const userDropdown = document.getElementById('userDropdown');

// Global state
let currentUser = null;
let posts = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadCurrentUser();
        await loadPosts();
        initializeEventListeners();
    } catch (error) {
        console.error('Initialization error:', error);
        window.location.href = '/';
    }
});

// Load current user information
async function loadCurrentUser() {
    try {
        const response = await fetch('/api/user');
        if (response.ok) {
            currentUser = await response.json();
            updateUserInfo();
        } else {
            throw new Error('User not authenticated');
        }
    } catch (error) {
        console.error('Error loading user:', error);
        throw error;
    }
}

// Update user info in the UI
function updateUserInfo() {
    if (currentUser) {
        userFullName.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
        userUsername.textContent = `@${currentUser.username}`;
    }
}

// Initialize event listeners
function initializeEventListeners() {
    // Post content textarea auto-resize and button state
    postContentTextarea.addEventListener('input', (e) => {
        // Auto-resize textarea
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
        
        // Enable/disable post button
        const content = e.target.value.trim();
        postButton.disabled = content.length === 0;
    });
    
    // Post content textarea enter key handling
    postContentTextarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!postButton.disabled) {
                createPost();
            }
        }
    });
    
    // Close user dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-menu')) {
            userDropdown.classList.remove('show');
        }
    });
}

// Toggle user dropdown menu
function toggleUserMenu() {
    userDropdown.classList.toggle('show');
}

// Show toast notification
function showToast(message, type = 'info') {
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Create a new post
async function createPost() {
    const content = postContentTextarea.value.trim();
    
    if (!content) {
        showToast('Please enter some content for your post', 'error');
        return;
    }
    
    postButton.disabled = true;
    const originalText = postButton.innerHTML;
    postButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Posting...';
    
    try {
        const response = await fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showToast('Post created successfully!', 'success');
            postContentTextarea.value = '';
            postContentTextarea.style.height = 'auto';
            
            // Add new post to the beginning of the posts array
            posts.unshift(result.post);
            renderPosts();
        } else {
            showToast(result.error || 'Failed to create post', 'error');
        }
    } catch (error) {
        console.error('Error creating post:', error);
        showToast('Network error. Please try again.', 'error');
    } finally {
        postButton.innerHTML = originalText;
        postButton.disabled = true; // Keep disabled until new content is entered
    }
}

// Load posts from the server
async function loadPosts() {
    try {
        loadingPosts.style.display = 'block';
        
        const response = await fetch('/api/posts');
        if (response.ok) {
            posts = await response.json();
            renderPosts();
        } else {
            showToast('Failed to load posts', 'error');
        }
    } catch (error) {
        console.error('Error loading posts:', error);
        showToast('Network error. Could not load posts.', 'error');
    } finally {
        loadingPosts.style.display = 'none';
    }
}

// Render posts in the UI
function renderPosts() {
    if (posts.length === 0) {
        postsContainer.innerHTML = `
            <div class="no-posts">
                <i class="fas fa-comments" style="font-size: 3rem; color: #65676b; margin-bottom: 20px;"></i>
                <h3 style="color: #65676b; margin-bottom: 10px;">No posts yet</h3>
                <p style="color: #8a8d91;">Be the first to share something!</p>
            </div>
        `;
        return;
    }
    
    postsContainer.innerHTML = posts.map(post => createPostHTML(post)).join('');
}

// Create HTML for a single post
function createPostHTML(post) {
    const timeAgo = getTimeAgo(post.createdAt);
    const isLiked = post.likes.includes(currentUser.id);
    const likesCount = post.likes.length;
    
    return `
        <div class="post-card" data-post-id="${post.id}">
            <div class="post-header">
                <div class="user-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="post-user-info">
                    <h4>${post.firstName} ${post.lastName}</h4>
                    <small>@${post.username} • ${timeAgo}</small>
                </div>
            </div>
            
            <div class="post-content">
                ${post.content.replace(/\n/g, '<br>')}
            </div>
            
            <div class="post-actions">
                <button class="post-action ${isLiked ? 'liked' : ''}" onclick="toggleLike('${post.id}')">
                    <i class="fas fa-heart"></i>
                    <span>${likesCount} ${likesCount === 1 ? 'Like' : 'Likes'}</span>
                </button>
                
                <button class="post-action" onclick="showComments('${post.id}')">
                    <i class="fas fa-comment"></i>
                    <span>Comment</span>
                </button>
                
                <button class="post-action" onclick="sharePost('${post.id}')">
                    <i class="fas fa-share"></i>
                    <span>Share</span>
                </button>
            </div>
        </div>
    `;
}

// Toggle like on a post
async function toggleLike(postId) {
    try {
        const response = await fetch(`/api/posts/${postId}/like`, {
            method: 'POST'
        });
        
        const result = await response.json();
        
        if (response.ok) {
            // Update the post in the local array
            const postIndex = posts.findIndex(p => p.id === postId);
            if (postIndex !== -1) {
                if (result.liked) {
                    posts[postIndex].likes.push(currentUser.id);
                } else {
                    posts[postIndex].likes = posts[postIndex].likes.filter(id => id !== currentUser.id);
                }
                
                // Update the UI for this specific post
                const postCard = document.querySelector(`[data-post-id="${postId}"]`);
                const likeButton = postCard.querySelector('.post-action');
                const likesCount = posts[postIndex].likes.length;
                
                likeButton.className = `post-action ${result.liked ? 'liked' : ''}`;
                likeButton.innerHTML = `
                    <i class="fas fa-heart"></i>
                    <span>${likesCount} ${likesCount === 1 ? 'Like' : 'Likes'}</span>
                `;
            }
        } else {
            showToast(result.error || 'Failed to update like', 'error');
        }
    } catch (error) {
        console.error('Error toggling like:', error);
        showToast('Network error. Please try again.', 'error');
    }
}

// Show comments (placeholder function)
function showComments(postId) {
    showToast('Comments feature coming soon!', 'info');
}

// Share post (placeholder function)
function sharePost(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        if (navigator.share) {
            navigator.share({
                title: 'Check out this post on SocialConnect',
                text: post.content,
                url: window.location.href
            });
        } else {
            // Fallback to copying to clipboard
            navigator.clipboard.writeText(`${post.content}\n\n- ${post.firstName} ${post.lastName} on SocialConnect`);
            showToast('Post copied to clipboard!', 'success');
        }
    }
}

// Get time ago string
function getTimeAgo(dateString) {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - postDate) / 1000);
    
    if (diffInSeconds < 60) {
        return 'Just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes}m ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours}h ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays}d ago`;
    }
    
    // For older posts, show the actual date
    return postDate.toLocaleDateString();
}

// Logout function
async function logout() {
    try {
        const response = await fetch('/api/logout', {
            method: 'POST'
        });
        
        if (response.ok) {
            showToast('Logged out successfully', 'success');
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        } else {
            showToast('Error logging out', 'error');
        }
    } catch (error) {
        console.error('Logout error:', error);
        showToast('Network error. Please try again.', 'error');
    }
}

// Close toast on click
toast.addEventListener('click', () => {
    toast.classList.remove('show');
});

// Refresh posts periodically (every 30 seconds)
setInterval(async () => {
    try {
        const response = await fetch('/api/posts');
        if (response.ok) {
            const newPosts = await response.json();
            if (newPosts.length !== posts.length) {
                posts = newPosts;
                renderPosts();
            }
        }
    } catch (error) {
        // Silently fail for background updates
        console.log('Background refresh failed:', error);
    }
}, 30000);