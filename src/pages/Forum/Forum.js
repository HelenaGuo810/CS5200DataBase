// Forum.js
import React, { useState } from 'react';
import './Forum.css';
import userLogo from '../../images/userlogo.png';

export default function Forum() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newPostContent, setNewPostContent] = useState('');

  const categories = [
    { id: 'all', name: 'All Topics', count: 0 },
    { id: 'application', name: 'Application', count: 124 },
    { id: 'schools', name: 'Schools', count: 80 },
    { id: 'portfolio', name: 'Portfolio', count: 24 },
    { id: 'resources', name: 'Resources', count: 48 },
    { id: 'tutorials', name: 'Tutorials', count: 67 },
    { id: 'other', name: 'Other', count: 16 },
  ];

  const handleNewPost = (e) => {
    e.preventDefault();
    // TODO: Implement post creation logic
    setNewPostContent('');
  };

  return (
    <div className="forum-container">
      {/* Header Section */}
      <header className="forum-header">
        <div className="header-content">
          <h1>Vertex Studio Forum</h1>
          <div className="header-actions">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="new-post-btn">Create New Post</button>
          </div>
        </div>
      </header>

      <div className="forum-content">
        {/* Sidebar with Categories */}
        <aside className="forum-sidebar">
          <div className="categories-section">
            <h2>Categories</h2>
            <div className="categories-list">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`category-item ${activeCategory === category.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <span className="category-name">{category.name}</span>
                  <span className="category-count">{category.count}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="forum-main">
          {/* New Post Form */}
          <section className="new-post-section">
            <form onSubmit={handleNewPost} className="new-post-form">
              <textarea
                placeholder="Share your thoughts..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows="3"
              />
              <div className="post-actions">
                <div className="post-options">
                  <button type="button" className="option-btn">
                    <span>📷</span> Image
                  </button>
                  <button type="button" className="option-btn">
                    <span>🔗</span> Link
                  </button>
                </div>
                <button type="submit" className="submit-post-btn">
                  Post
                </button>
              </div>
            </form>
          </section>

          {/* Posts List */}
          <section className="posts-section">
            <div className="posts-header">
              <h2>Recent Discussions</h2>
              <div className="sort-options">
                <button className="sort-btn active">Latest</button>
                <button className="sort-btn">Popular</button>
                <button className="sort-btn">Trending</button>
              </div>
            </div>

            {/* Post Items */}
            <div className="posts-list">
              {/* Example Post */}
              <article className="post-card">
                <div className="post-header">
                  <div className="post-author">
                    <img src={userLogo} alt="Author" className="author-avatar" />
                    <div className="author-info">
                      <h3>John Doe</h3>
                      <span className="post-time">2 hours ago</span>
                    </div>
                  </div>
                  <div className="post-category">Urban Design</div>
                </div>
                <div className="post-content">
                  <h2>What are your thoughts on the latest Harvard GSD landscape project?</h2>
                  <p>I've been following the recent market trends and would love to hear your perspectives...</p>
                </div>
                <div className="post-footer">
                  <div className="post-stats">
                    <span>👁️ 1.2k views</span>
                    <span>💬 24 replies</span>
                    <span>❤️ 156 likes</span>
                  </div>
                  <button className="reply-btn">Reply</button>
                </div>
              </article>

              {/* More posts would be rendered here */}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
