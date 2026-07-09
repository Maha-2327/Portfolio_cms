import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  return (
    <div className="project-card">
      {project.image ? (
        <img src={project.image} alt={project.title} className="project-card-img" />
      ) : (
        <div className="project-card-img placeholder">No Image</div>
      )}

      <div className="project-card-body">
        <div className="project-card-header">
          <h3>{project.title}</h3>
          <span className={`badge difficulty-${project.difficulty?.toLowerCase()}`}>
            {project.difficulty}
          </span>
        </div>

        <p className="muted">{project.shortDescription}</p>

        <div className="tech-tags">
          {project.techStack?.slice(0, 4).map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>

        <div className="project-card-footer">
          <Link to={`/projects/${project._id}`} className="btn btn-small">
            View Details
          </Link>
          <div className="card-links">
            {project.githubLink && (
              <a href={project.githubLink} target="_blank" rel="noreferrer" title="GitHub">GitHub</a>
            )}
            {project.liveDemo && (
              <a href={project.liveDemo} target="_blank" rel="noreferrer" title="Live Demo">Demo</a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
