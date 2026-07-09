import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/projects/${id}`)
      .then((res) => setProject(res.data))
      .catch(() => setError('Project not found.'));
  }, [id]);

  if (error) {
    return (
      <div className="page">
        <p>{error}</p>
        <Link to="/projects">← Back to projects</Link>
      </div>
    );
  }

  if (!project) return <div className="page"><p className="muted">Loading...</p></div>;

  return (
    <div className="page project-detail">
      <Link to="/projects" className="back-link">← Back to projects</Link>

      <h1>{project.title}</h1>
      <div className="tech-tags">
        {project.techStack?.map((t) => <span key={t} className="tag">{t}</span>)}
      </div>

      {project.image && <img src={project.image} alt={project.title} className="detail-image" />}

      <div className="detail-meta">
        <span><strong>Difficulty:</strong> {project.difficulty}</span>
        <span><strong>Time Taken:</strong> {project.timeTaken || 'N/A'}</span>
      </div>

      <div className="detail-links">
        {project.githubLink && <a href={project.githubLink} target="_blank" rel="noreferrer" className="btn btn-outline">GitHub Repo</a>}
        {project.liveDemo && <a href={project.liveDemo} target="_blank" rel="noreferrer" className="btn btn-primary">Live Demo</a>}
      </div>

      <section className="section">
        <h3>Description</h3>
        <p>{project.description}</p>
      </section>

      {project.features?.length > 0 && (
        <section className="section">
          <h3>Key Features</h3>
          <ul>
            {project.features.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        </section>
      )}

      {project.challenges && (
        <section className="section">
          <h3>Challenges Faced</h3>
          <p>{project.challenges}</p>
        </section>
      )}

      {project.learnings && (
        <section className="section">
          <h3>What I Learned</h3>
          <p>{project.learnings}</p>
        </section>
      )}
    </div>
  );
};

export default ProjectDetail;
