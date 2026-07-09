import React, { useEffect, useState } from 'react';
import api from '../api/api';
import ProjectCard from '../components/ProjectCard.jsx';

const TECH_FILTERS = ['All', 'React', 'Node.js', 'MongoDB', 'JavaScript', 'Express'];

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tech, setTech] = useState('All');

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (tech !== 'All') params.tech = tech;
      const { data } = await api.get('/projects', { params });
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(fetchProjects, 300); // debounce search
    return () => clearTimeout(delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, tech]);

  return (
    <div className="page">
      <h1>Projects</h1>
      <p className="muted">A collection of things I've built.</p>

      <div className="filters">
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <div className="filter-chips">
          {TECH_FILTERS.map((t) => (
            <button
              key={t}
              className={`chip ${tech === t ? 'active' : ''}`}
              onClick={() => setTech(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="muted">Loading projects...</p>
      ) : projects.length === 0 ? (
        <p className="muted">No projects match your search.</p>
      ) : (
        <div className="projects-grid">
          {projects.map((p) => (
            <ProjectCard key={p._id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
