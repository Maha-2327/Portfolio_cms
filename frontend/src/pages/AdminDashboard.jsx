import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext.jsx';
import StatCard from '../components/StatCard.jsx';

const emptyProject = {
  title: '',
  shortDescription: '',
  description: '',
  techStack: '',
  difficulty: 'Intermediate',
  timeTaken: '',
  githubLink: '',
  liveDemo: '',
  image: '',
  features: '',
  challenges: '',
  learnings: '',
  status: 'published',
};

const emptyBlog = {
  title: '',
  slug: '',
  excerpt: '',
  coverImage: '',
  tags: '',
  content: '',
  status: 'draft',
};

const emptySkill = {
  name: '',
  level: 80,
  category: 'General',
  icon: '',
  order: 0,
};

const emptyJourney = {
  year: '',
  title: '',
  description: '',
  type: 'milestone',
  order: 0,
};

const emptyProfile = {
  displayName: '',
  bio: '',
  profilePicture: '',
};

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState(emptyProject);
  const [blogForm, setBlogForm] = useState(emptyBlog);
  const [skillForm, setSkillForm] = useState(emptySkill);
  const [journeyForm, setJourneyForm] = useState(emptyJourney);
  const [profileForm, setProfileForm] = useState(emptyProfile);
  const [editingId, setEditingId] = useState(null);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [editingJourneyId, setEditingJourneyId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmDeleteBlogId, setConfirmDeleteBlogId] = useState(null);
  const [confirmDeleteSkillId, setConfirmDeleteSkillId] = useState(null);
  const [confirmDeleteJourneyId, setConfirmDeleteJourneyId] = useState(null);
  const [notice, setNotice] = useState('');
  const [skills, setSkills] = useState([]);
  const [journey, setJourney] = useState([]);

  const loadStats = () => api.get('/stats').then((res) => setStats(res.data));
  const loadProjects = () => api.get('/projects/admin/all').then((res) => setProjects(res.data));
  const loadMessages = () => api.get('/contact').then((res) => setMessages(res.data));
  const loadBlogs = () => api.get('/blogs/admin/all').then((res) => setBlogs(res.data));
  const loadSkills = () => api.get('/skills/admin/all').then((res) => setSkills(res.data));
  const loadJourney = () => api.get('/journey/admin/all').then((res) => setJourney(res.data));
  const loadProfile = () => {
    api.get('/auth/me').then((res) => {
      setProfileForm({
        displayName: res.data.displayName || '',
        bio: res.data.bio || '',
        profilePicture: res.data.profilePicture || '',
      });
    }).catch(() => {});
  };

  useEffect(() => {
    loadStats();
    loadProjects();
    loadMessages();
    loadBlogs();
    loadSkills();
    loadJourney();
    loadProfile();
  }, []);

  const resetForm = () => {
    setForm(emptyProject);
    setEditingId(null);
  };

  const resetBlogForm = () => {
    setBlogForm(emptyBlog);
    setEditingBlogId(null);
  };

  const resetSkillForm = () => {
    setSkillForm(emptySkill);
    setEditingSkillId(null);
  };

  const resetJourneyForm = () => {
    setJourneyForm(emptyJourney);
    setEditingJourneyId(null);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleBlogChange = (e) => {
    const { name, value } = e.target;
    if (name === 'title' && !editingBlogId) {
      const slugValue = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      setBlogForm({ ...blogForm, title: value, slug: slugValue });
    } else {
      setBlogForm({ ...blogForm, [name]: value });
    }
  };

  const handleSkillChange = (e) => {
    const { name, value } = e.target;
    const val = name === 'level' || name === 'order' ? Number(value) : value;
    setSkillForm({ ...skillForm, [name]: val });
  };

  const handleJourneyChange = (e) => {
    const { name, value } = e.target;
    const val = name === 'order' ? Number(value) : value;
    setJourneyForm({ ...journeyForm, [name]: val });
  };

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/profile', profileForm);
      setNotice('Profile updated successfully.');
      setTimeout(() => setNotice(''), 3000);
    } catch (err) {
      setNotice(err.response?.data?.message || 'Something went wrong.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      techStack: form.techStack.split(',').map((s) => s.trim()).filter(Boolean),
      features: form.features.split(',').map((s) => s.trim()).filter(Boolean),
    };

    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, payload);
        setNotice('Project updated successfully.');
      } else {
        await api.post('/projects', payload);
        setNotice('Project created successfully.');
      }
      resetForm();
      loadProjects();
      loadStats();
      setTimeout(() => setNotice(''), 3000);
    } catch (err) {
      setNotice(err.response?.data?.message || 'Something went wrong.');
    }
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...blogForm,
      tags: blogForm.tags.split(',').map((s) => s.trim()).filter(Boolean),
    };

    try {
      if (editingBlogId) {
        await api.put(`/blogs/${editingBlogId}`, payload);
        setNotice('Blog post updated successfully.');
      } else {
        await api.post('/blogs', payload);
        setNotice('Blog post created successfully.');
      }
      resetBlogForm();
      loadBlogs();
      loadStats();
      setTimeout(() => setNotice(''), 3000);
    } catch (err) {
      setNotice(err.response?.data?.message || 'Something went wrong.');
    }
  };

  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSkillId) {
        await api.put(`/skills/${editingSkillId}`, skillForm);
        setNotice('Skill updated successfully.');
      } else {
        await api.post('/skills', skillForm);
        setNotice('Skill created successfully.');
      }
      resetSkillForm();
      loadSkills();
      setTimeout(() => setNotice(''), 3000);
    } catch (err) {
      setNotice(err.response?.data?.message || 'Something went wrong.');
    }
  };

  const handleJourneySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingJourneyId) {
        await api.put(`/journey/${editingJourneyId}`, journeyForm);
        setNotice('Journey item updated successfully.');
      } else {
        await api.post('/journey', journeyForm);
        setNotice('Journey item created successfully.');
      }
      resetJourneyForm();
      loadJourney();
      setTimeout(() => setNotice(''), 3000);
    } catch (err) {
      setNotice(err.response?.data?.message || 'Something went wrong.');
    }
  };

  const handleEdit = (p) => {
    setEditingId(p._id);
    setForm({
      ...emptyProject,
      ...p,
      techStack: (p.techStack || []).join(', '),
      features: (p.features || []).join(', '),
    });
    setTab('projects');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBlogEdit = (b) => {
    setEditingBlogId(b._id);
    setBlogForm({
      ...emptyBlog,
      ...b,
      tags: (b.tags || []).join(', '),
    });
    setTab('blogs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSkillEdit = (s) => {
    setEditingSkillId(s._id);
    setSkillForm({ ...emptySkill, ...s });
    setTab('skills');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJourneyEdit = (j) => {
    setEditingJourneyId(j._id);
    setJourneyForm({ ...emptyJourney, ...j });
    setTab('journey');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    await api.delete(`/projects/${id}`);
    setConfirmDeleteId(null);
    loadProjects();
    loadStats();
  };

  const handleBlogDelete = async (id) => {
    await api.delete(`/blogs/${id}`);
    setConfirmDeleteBlogId(null);
    loadBlogs();
    loadStats();
  };

  const handleSkillDelete = async (id) => {
    await api.delete(`/skills/${id}`);
    setConfirmDeleteSkillId(null);
    loadSkills();
  };

  const handleJourneyDelete = async (id) => {
    await api.delete(`/journey/${id}`);
    setConfirmDeleteJourneyId(null);
    loadJourney();
  };

  const markMessageRead = async (id) => {
    await api.patch(`/contact/${id}/read`);
    loadMessages();
    loadStats();
  };

  const deleteMessage = async (id) => {
    await api.delete(`/contact/${id}`);
    loadMessages();
    loadStats();
  };

  return (
    <div className="page admin-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>CMS Dashboard</h1>
          <p className="muted">Welcome back, {user?.username}</p>
        </div>
        <button className="btn btn-outline" onClick={logout}>Logout</button>
      </div>

      <div className="tabs">
        <button className={tab === 'overview' ? 'active' : ''} onClick={() => setTab('overview')}>Overview</button>
        <button className={tab === 'projects' ? 'active' : ''} onClick={() => setTab('projects')}>Projects</button>
        <button className={tab === 'blogs' ? 'active' : ''} onClick={() => setTab('blogs')}>Blogs</button>
        <button className={tab === 'skills' ? 'active' : ''} onClick={() => setTab('skills')}>Skills</button>
        <button className={tab === 'journey' ? 'active' : ''} onClick={() => setTab('journey')}>Journey</button>
        <button className={tab === 'profile' ? 'active' : ''} onClick={() => setTab('profile')}>Profile</button>
        <button className={tab === 'messages' ? 'active' : ''} onClick={() => setTab('messages')}>
          Messages {stats?.unreadMessages > 0 && <span className="badge-count">{stats.unreadMessages}</span>}
        </button>
      </div>

      {notice && <div className="toast toast-success">{notice}</div>}

      {/* OVERVIEW TAB */}
      {tab === 'overview' && stats && (
        <div className="section">
          <div className="dashboard-grid">
            <StatCard label="Total Projects" value={stats.totalProjects} icon="📁" />
            <StatCard label="Published Projects" value={stats.publishedProjects} icon="✅" />
            <StatCard label="Total Blogs" value={stats.totalBlogs} icon="📝" />
            <StatCard label="Messages Received" value={stats.totalMessages} icon="✉️" />
          </div>

          <h3>Recent Messages</h3>
          {stats.recentMessages.length === 0 && <p className="muted">No messages yet.</p>}
          <ul className="recent-list">
            {stats.recentMessages.map((m) => (
              <li key={m._id}>
                <strong>{m.name}</strong> — {m.message.slice(0, 60)}{m.message.length > 60 ? '...' : ''}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* PROJECTS TAB */}
      {tab === 'projects' && (
        <div className="section">
          <form onSubmit={handleSubmit} className="cms-form">
            <h3>{editingId ? 'Edit Project' : 'Add New Project'}</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Title</label>
                <input name="title" value={form.title} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Difficulty</label>
                <select name="difficulty" value={form.difficulty} onChange={handleChange}>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Short Description</label>
              <input name="shortDescription" value={form.shortDescription} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Full Description</label>
              <textarea name="description" rows="3" value={form.description} onChange={handleChange} required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Tech Stack (comma separated)</label>
                <input name="techStack" value={form.techStack} onChange={handleChange} placeholder="React, Node.js, MongoDB" />
              </div>
              <div className="form-group">
                <label>Time Taken</label>
                <input name="timeTaken" value={form.timeTaken} onChange={handleChange} placeholder="e.g. 2 weeks" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>GitHub Link</label>
                <input name="githubLink" value={form.githubLink} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Live Demo Link</label>
                <input name="liveDemo" value={form.liveDemo} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label>Image URL</label>
              <input name="image" value={form.image} onChange={handleChange} placeholder="https://... (or Cloudinary URL)" />
            </div>

            <div className="form-group">
              <label>Key Features (comma separated)</label>
              <input name="features" value={form.features} onChange={handleChange} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Challenges Faced</label>
                <textarea name="challenges" rows="2" value={form.challenges} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>What I Learned</label>
                <textarea name="learnings" rows="2" value={form.learnings} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update Project' : 'Add Project'}
              </button>
              {editingId && (
                <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel</button>
              )}
            </div>
          </form>

          <h3>All Projects</h3>
          <div className="admin-table">
            {projects.map((p) => (
              <div key={p._id} className="admin-row">
                <div>
                  <strong>{p.title}</strong>
                  <span className={`badge status-${p.status}`}>{p.status}</span>
                </div>
                <div className="admin-row-actions">
                  <button className="btn btn-small" onClick={() => handleEdit(p)}>Edit</button>
                  {confirmDeleteId === p._id ? (
                    <>
                      <button className="btn btn-small btn-danger" onClick={() => handleDelete(p._id)}>Confirm Delete</button>
                      <button className="btn btn-small" onClick={() => setConfirmDeleteId(null)}>Cancel</button>
                    </>
                  ) : (
                    <button className="btn btn-small btn-danger-outline" onClick={() => setConfirmDeleteId(p._id)}>Delete</button>
                  )}
                </div>
              </div>
            ))}
            {projects.length === 0 && <p className="muted">No projects yet.</p>}
          </div>
        </div>
      )}

      {/* BLOGS TAB */}
      {tab === 'blogs' && (
        <div className="section">
          <form onSubmit={handleBlogSubmit} className="cms-form">
            <h3>{editingBlogId ? 'Edit Blog Post' : 'Add New Blog Post'}</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Title</label>
                <input name="title" value={blogForm.title} onChange={handleBlogChange} required />
              </div>
              <div className="form-group">
                <label>Slug</label>
                <input name="slug" value={blogForm.slug} onChange={handleBlogChange} required />
              </div>
            </div>

            <div className="form-group">
              <label>Excerpt / Short Summary</label>
              <input name="excerpt" value={blogForm.excerpt} onChange={handleBlogChange} placeholder="Brief summary of the article..." />
            </div>

            <div className="form-group">
              <label>Cover Image URL</label>
              <input name="coverImage" value={blogForm.coverImage} onChange={handleBlogChange} placeholder="https://... (or Cover Image URL)" />
            </div>

            <div className="form-group">
              <label>Tags (comma separated)</label>
              <input name="tags" value={blogForm.tags} onChange={handleBlogChange} placeholder="React, JavaScript, WebDev" />
            </div>

            <div className="form-group">
              <label>Content (HTML/Rich-Text supported)</label>
              <textarea name="content" rows="10" value={blogForm.content} onChange={handleBlogChange} required placeholder="&lt;p&gt;Write your article content here...&lt;/p&gt;" />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select name="status" value={blogForm.status} onChange={handleBlogChange}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingBlogId ? 'Update Blog Post' : 'Add Blog Post'}
              </button>
              {editingBlogId && (
                <button type="button" className="btn btn-outline" onClick={resetBlogForm}>Cancel</button>
              )}
            </div>
          </form>

          <h3>All Blog Posts</h3>
          <div className="admin-table">
            {blogs.map((b) => (
              <div key={b._id} className="admin-row">
                <div>
                  <strong>{b.title}</strong>
                  <span className={`badge status-${b.status}`}>{b.status}</span>
                </div>
                <div className="admin-row-actions">
                  <button className="btn btn-small" onClick={() => handleBlogEdit(b)}>Edit</button>
                  {confirmDeleteBlogId === b._id ? (
                    <>
                      <button className="btn btn-small btn-danger" onClick={() => handleBlogDelete(b._id)}>Confirm Delete</button>
                      <button className="btn btn-small" onClick={() => setConfirmDeleteBlogId(null)}>Cancel</button>
                    </>
                  ) : (
                    <button className="btn btn-small btn-danger-outline" onClick={() => setConfirmDeleteBlogId(b._id)}>Delete</button>
                  )}
                </div>
              </div>
            ))}
            {blogs.length === 0 && <p className="muted">No blog posts yet.</p>}
          </div>
        </div>
      )}

      {/* SKILLS TAB */}
      {tab === 'skills' && (
        <div className="section">
          <form onSubmit={handleSkillSubmit} className="cms-form">
            <h3>{editingSkillId ? 'Edit Skill' : 'Add New Skill'}</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Skill Name</label>
                <input name="name" value={skillForm.name} onChange={handleSkillChange} required />
              </div>
              <div className="form-group">
                <label>Proficiency Level (0-100)</label>
                <input name="level" type="number" min="0" max="100" value={skillForm.level} onChange={handleSkillChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={skillForm.category} onChange={handleSkillChange}>
                  <option value="General">General</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="Tools">Tools</option>
                  <option value="Languages">Languages</option>
                </select>
              </div>
              <div className="form-group">
                <label>Icon (emoji)</label>
                <input name="icon" value={skillForm.icon} onChange={handleSkillChange} placeholder="e.g. ⚛️" />
              </div>
            </div>

            <div className="form-group">
              <label>Display Order</label>
              <input name="order" type="number" value={skillForm.order} onChange={handleSkillChange} />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingSkillId ? 'Update Skill' : 'Add Skill'}
              </button>
              {editingSkillId && (
                <button type="button" className="btn btn-outline" onClick={resetSkillForm}>Cancel</button>
              )}
            </div>
          </form>

          <h3>All Skills</h3>
          <div className="admin-table">
            {skills.map((s) => (
              <div key={s._id} className="admin-row">
                <div>
                  <strong>{s.icon} {s.name}</strong>
                  <span className="muted"> - {s.category} ({s.level}%)</span>
                </div>
                <div className="admin-row-actions">
                  <button className="btn btn-small" onClick={() => handleSkillEdit(s)}>Edit</button>
                  {confirmDeleteSkillId === s._id ? (
                    <>
                      <button className="btn btn-small btn-danger" onClick={() => handleSkillDelete(s._id)}>Confirm Delete</button>
                      <button className="btn btn-small" onClick={() => setConfirmDeleteSkillId(null)}>Cancel</button>
                    </>
                  ) : (
                    <button className="btn btn-small btn-danger-outline" onClick={() => setConfirmDeleteSkillId(s._id)}>Delete</button>
                  )}
                </div>
              </div>
            ))}
            {skills.length === 0 && <p className="muted">No skills yet.</p>}
          </div>
        </div>
      )}

      {/* JOURNEY TAB */}
      {tab === 'journey' && (
        <div className="section">
          <form onSubmit={handleJourneySubmit} className="cms-form">
            <h3>{editingJourneyId ? 'Edit Journey Item' : 'Add New Journey Item'}</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Year/Period</label>
                <input name="year" value={journeyForm.year} onChange={handleJourneyChange} required placeholder="e.g. 2024 or Present" />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select name="type" value={journeyForm.type} onChange={handleJourneyChange}>
                  <option value="milestone">Milestone</option>
                  <option value="education">Education</option>
                  <option value="work">Work</option>
                  <option value="project">Project</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Title</label>
              <input name="title" value={journeyForm.title} onChange={handleJourneyChange} required />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea name="description" rows="3" value={journeyForm.description} onChange={handleJourneyChange} required />
            </div>

            <div className="form-group">
              <label>Display Order</label>
              <input name="order" type="number" value={journeyForm.order} onChange={handleJourneyChange} />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingJourneyId ? 'Update Journey Item' : 'Add Journey Item'}
              </button>
              {editingJourneyId && (
                <button type="button" className="btn btn-outline" onClick={resetJourneyForm}>Cancel</button>
              )}
            </div>
          </form>

          <h3>All Journey Items</h3>
          <div className="admin-table">
            {journey.map((j) => (
              <div key={j._id} className="admin-row">
                <div>
                  <strong>{j.year}</strong> - {j.title}
                  <span className="muted"> ({j.type})</span>
                </div>
                <div className="admin-row-actions">
                  <button className="btn btn-small" onClick={() => handleJourneyEdit(j)}>Edit</button>
                  {confirmDeleteJourneyId === j._id ? (
                    <>
                      <button className="btn btn-small btn-danger" onClick={() => handleJourneyDelete(j._id)}>Confirm Delete</button>
                      <button className="btn btn-small" onClick={() => setConfirmDeleteJourneyId(null)}>Cancel</button>
                    </>
                  ) : (
                    <button className="btn btn-small btn-danger-outline" onClick={() => setConfirmDeleteJourneyId(j._id)}>Delete</button>
                  )}
                </div>
              </div>
            ))}
            {journey.length === 0 && <p className="muted">No journey items yet.</p>}
          </div>
        </div>
      )}

      {/* PROFILE TAB */}
      {tab === 'profile' && (
        <div className="section">
          <form onSubmit={handleProfileSubmit} className="cms-form">
            <h3>Edit Profile Settings</h3>

            <div className="form-group">
              <label>Display Name (shown on portfolio)</label>
              <input name="displayName" value={profileForm.displayName} onChange={handleProfileChange} placeholder="e.g. MAHALAKSHMI U" />
            </div>

            <div className="form-group">
              <label>Bio / Tagline</label>
              <input name="bio" value={profileForm.bio} onChange={handleProfileChange} placeholder="e.g. Full Stack Developer · MERN Stack" />
            </div>

            <div className="form-group">
              <label>Profile Picture URL</label>
              <input name="profilePicture" value={profileForm.profilePicture} onChange={handleProfileChange} placeholder="https://... (optimized image URL)" />
              <small className="muted">Use a square image (recommended: 200x200px or larger). For best performance, use WebP format with compression.</small>
            </div>

            {profileForm.profilePicture && (
              <div className="profile-preview">
                <img src={profileForm.profilePicture} alt="Profile Preview" className="profile-preview-img" />
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Update Profile</button>
            </div>
          </form>
        </div>
      )}

      {/* MESSAGES TAB */}
      {tab === 'messages' && (
        <div className="section">
          <h3>Contact Messages</h3>
          {messages.length === 0 && <p className="muted">No messages yet.</p>}
          <div className="admin-table">
            {messages.map((m) => (
              <div key={m._id} className={`admin-row message-row ${!m.read ? 'unread' : ''}`}>
                <div>
                  <strong>{m.name}</strong> <span className="muted">({m.email})</span>
                  <p>{m.message}</p>
                  <small className="muted">{new Date(m.createdAt).toLocaleString()}</small>
                </div>
                <div className="admin-row-actions">
                  {!m.read && <button className="btn btn-small" onClick={() => markMessageRead(m._id)}>Mark Read</button>}
                  <button className="btn btn-small btn-danger-outline" onClick={() => deleteMessage(m._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
