import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import StatCard from '../components/StatCard.jsx';
import ProjectCard from '../components/ProjectCard.jsx';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [skills, setSkills] = useState([]);
  const [journey, setJourney] = useState([]);
  const [stats, setStats] = useState({ projects: 0, techs: 0, certifications: 3 });
  const [userProfile, setUserProfile] = useState({ displayName: 'MAHALAKSHMI U', profilePicture: '', bio: 'Full Stack Developer · MERN Stack' });

  useEffect(() => {
    // Fetch featured projects
    api.get('/projects').then((res) => {
      setFeatured(res.data.slice(0, 3));
      setStats((s) => ({ ...s, projects: res.data.length }));
    }).catch(() => {});

    // Fetch user profile
    api.get('/auth/public-profile').then((res) => {
      setUserProfile(res.data);
    }).catch(() => {});

    // Fetch skills from API
    api.get('/skills').then((res) => {
      setSkills(res.data);
      setStats((s) => ({ ...s, techs: res.data.length }));
    }).catch(() => {
      // Fallback to hardcoded skills if API fails
      setSkills([
        { name: 'HTML / CSS', level: 90 },
        { name: 'JavaScript', level: 85 },
        { name: 'React.js', level: 80 },
        { name: 'Node.js / Express.js', level: 80 },
        { name: 'MongoDB', level: 75 },
        { name: 'Java', level: 85 },
        { name: 'Python', level: 75 },
        { name: 'SQL', level: 80 },
      ]);
      setStats((s) => ({ ...s, techs: 8 }));
    });

    // Fetch journey from API
    api.get('/journey').then((res) => {
      setJourney(res.data);
    }).catch(() => {
      // Fallback to hardcoded journey if API fails
      setJourney([
        { year: '2023', title: 'Started B.Tech Information Technology', description: 'Began my engineering journey and learned programming fundamentals using C, Java, and Python.' },
        { year: '2024', title: 'Built File Organizer', description: 'Developed a Python-based File Organizer that automatically categorizes files and simplifies file management.' },
        { year: '2025', title: 'Built Event Registration System', description: 'Developed a full-stack MERN application for managing college symposium events with authentication and role-based access.' },
        { year: '2026', title: 'Completed Full Stack Internship', description: 'Worked on real-world full-stack projects using the MERN stack and improved my development and debugging skills.' },
        { year: 'Present', title: 'Building Portfolio CMS & StudentOS', description: 'Currently developing an advanced portfolio with a custom CMS and an AI-powered StudentOS productivity platform.' },
      ]);
    });
  }, []);

  return (
    <div className="page home">
      {/* Hero */}
      <section className="hero">
        {userProfile.profilePicture && (
          <div className="profile-picture">
            <img src={userProfile.profilePicture} alt="Profile" className="profile-img" />
          </div>
        )}
        <h1>Hi, I'm <span className="accent">{userProfile.displayName}</span></h1>
        <p className="subtitle">{userProfile.bio}</p>
        <div className="hero-actions">
          <Link to="/projects" className="btn btn-primary">View Projects</Link>
          <Link to="/contact" className="btn btn-outline">Contact Me</Link>
        </div>
      </section>

      {/* Dashboard-style stat cards */}
      <section className="dashboard-grid">
        <StatCard label="Projects Completed" value={stats.projects} icon="📁" />
        <StatCard label="Technologies" value={stats.techs} icon="🛠️" />
        <StatCard label="Certifications" value={stats.certifications} icon="🎓" />
        <StatCard label="Internship" value={1} icon="💼" />
      </section>

      {/* Skills */}
      <section className="section">
        <h2>Skills</h2>
        <div className="skills">
          {skills.map((s) => (
            <div key={s._id || s.name} className="skill-row">
              <div className="skill-label">
                <span>{s.icon ? `${s.icon} ` : ''}{s.name}</span>
                <span>{s.level}%</span>
              </div>
              <div className="skill-bar">
                <div className="skill-bar-fill" style={{ width: `${s.level}%` }} />
              </div>
            </div>
          ))}
          {skills.length === 0 && <p className="muted">No skills added yet.</p>}
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <h2>My Journey</h2>
        <div className="timeline">
          {journey.map((item) => (
            <div key={item._id || item.year} className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-content">
                <span className="timeline-year">{item.year}</span>
                <h4>{item.title}</h4>
                <p className="muted">{item.description}</p>
              </div>
            </div>
          ))}
          {journey.length === 0 && <p className="muted">No journey items added yet.</p>}
        </div>
      </section>

      {/* Featured projects */}
      <section className="section">
        <div className="section-header">
          <h2>Featured Projects</h2>
          <Link to="/projects">See all →</Link>
        </div>
        <div className="projects-grid">
          {featured.map((p) => (
            <ProjectCard key={p._id} project={p} />
          ))}
          {featured.length === 0 && <p className="muted">No projects yet — add some from the CMS.</p>}
        </div>
      </section>
    </div>
  );
};

export default Home;
