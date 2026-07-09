import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/blogs')
      .then((res) => {
        setBlogs(res.data);
      })
      .catch((err) => {
        console.error('Error fetching blogs:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredBlogs = blogs.filter((blog) => {
    const term = search.toLowerCase();
    return (
      blog.title.toLowerCase().includes(term) ||
      blog.excerpt.toLowerCase().includes(term) ||
      blog.tags.some((tag) => tag.toLowerCase().includes(term))
    );
  });

  return (
    <div className="page blogs-page">
      <h1>Blog</h1>
      <p className="muted">My thoughts, tutorials, and experiences in software development.</p>

      <div className="filters">
        <input
          type="text"
          placeholder="Search blogs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <p className="muted">Loading blogs...</p>
      ) : filteredBlogs.length === 0 ? (
        <p className="muted">No blog posts found.</p>
      ) : (
        <div className="projects-grid">
          {filteredBlogs.map((blog) => (
            <article key={blog._id} className="project-card">
              {blog.coverImage ? (
                <img src={blog.coverImage} alt={blog.title} className="project-card-img" />
              ) : (
                <div className="project-card-img placeholder" style={{
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                  opacity: 0.85
                }} />
              )}
              <div className="project-card-body">
                <span className="muted" style={{ fontSize: '0.8rem' }}>
                  {new Date(blog.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <h3 style={{ margin: '8px 0 10px 0', fontSize: '1.25rem' }}>{blog.title}</h3>
                <p className="muted" style={{ fontSize: '0.9rem', marginBottom: '14px', lineHeights: '1.5' }}>
                  {blog.excerpt || blog.content.replace(/<[^>]*>/g, '').slice(0, 120) + '...'}
                </p>
                <div className="tech-tags">
                  {blog.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
                <div className="project-card-footer" style={{ marginTop: '16px' }}>
                  <Link to={`/blogs/${blog.slug}`} className="btn btn-primary btn-small">
                    Read More
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blogs;
