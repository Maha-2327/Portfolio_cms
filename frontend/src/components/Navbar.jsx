import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTheme, THEMES } from '../context/ThemeContext.jsx';

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          &lt;MAHALAKSHMI U &gt;
        </Link>

        <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          ☰
        </button>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          <NavLink to="/" end onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/projects" onClick={() => setOpen(false)}>Projects</NavLink>
          <NavLink to="/blogs" onClick={() => setOpen(false)}>Blog</NavLink>
          <NavLink to="/contact" onClick={() => setOpen(false)}>Contact</NavLink>
          <NavLink to="/admin/login" onClick={() => setOpen(false)}>Admin</NavLink>

          <select
            className="theme-select"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            aria-label="Select theme"
          >
            {THEMES.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
