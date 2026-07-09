import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/blogs/${slug}`)
      .then((res) => {
        setBlog(res.data);
      })
      .catch((err) => {
        console.error('Error fetching blog details:', err);
        setError('Blog post not found.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="page">
        <p className="muted">Loading blog post...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="page">
        <p>{error || 'Something went wrong.'}</p>
        <Link to="/blogs">← Back to blogs</Link>
      </div>
    );
  }

  return (
    <div className="page blog-detail">
      <Link to="/blogs" className="back-link">← Back to blogs</Link>

      <article style={{ marginTop: '20px' }}>
        <span className="muted" style={{ fontSize: '0.9rem' }}>
          Published on {new Date(blog.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </span>
        <h1 style={{ marginTop: '8px', marginBottom: '16px' }}>{blog.title}</h1>

        <div className="tech-tags" style={{ marginBottom: '24px' }}>
          {blog.tags?.map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>

        {blog.coverImage && (
          <img src={blog.coverImage} alt={blog.title} className="detail-image" style={{ width: '100%', borderRadius: '12px', marginBottom: '30px' }} />
        )}

        <div
          className="blog-content"
          style={{
            lineHeight: '1.8',
            fontSize: '1.1rem',
            color: 'var(--text)',
          }}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </article>
    </div>
  );
};

export default BlogDetail;
