// Run with: npm run seed
// Creates an admin user (from .env) and sample data.

import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Project from "./models/Project.js";
import Blog from "./models/Blog.js";
import Skill from "./models/Skill.js";
import Journey from "./models/Journey.js";

const run = async () => {
  try {
    await connectDB();

    // Validate required environment variables
    const { ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_USERNAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error(
        "Missing ADMIN_USERNAME, ADMIN_EMAIL, or ADMIN_PASSWORD in .env file."
      );
    }

    // =======================
    // Create Admin User
    // =======================
    const existingAdmin = await User.findOne({
      username: ADMIN_USERNAME,
    });

    if (!existingAdmin) {
      await User.create({
        username: ADMIN_USERNAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: "admin",
      });

      console.log("✅ Admin user created successfully.");
    } else {
      console.log("ℹ️ Admin user already exists. Skipping...");
    }

    // =======================
    // Sample Projects
    // =======================
    const projectCount = await Project.countDocuments();

    if (projectCount === 0) {
      await Project.insertMany([
        {
          title: "Portfolio Website with CMS",
          shortDescription:
            "A MERN stack portfolio with a custom content management system.",
          description:
            "A full-stack portfolio website that lets me manage my projects, blogs, and messages through a private admin dashboard without editing code.",
          techStack: [
            "React",
            "Node.js",
            "Express",
            "MongoDB",
            "JWT",
          ],
          difficulty: "Intermediate",
          timeTaken: "1 week",
          githubLink: "https://github.com/your-username/portfolio-cms",
          liveDemo: "https://your-live-demo-link.com",
          features: [
            "Admin dashboard",
            "Project CRUD",
            "Blog management",
            "Contact form",
            "Dark/Light theme",
          ],
          challenges:
            "Designed secure authentication and a scalable REST API.",
          learnings:
            "Learned JWT authentication, CRUD operations, and full-stack deployment.",
          featured: true,
          status: "published",
        },
        {
          title: "Event Registration System",
          shortDescription:
            "A full-stack MERN application for creating, managing, and registering for college and community events.",
          description:
            "A comprehensive event management platform where organizers can create and manage events while participants can browse upcoming events, register online, and receive confirmation. The system includes secure authentication, role-based access, an admin dashboard, registration tracking, and real-time event management.",
           techStack: [
            "React",
            "Node.js",
            "Express",
            "MongoDB",
            "JWT",
          ],
          difficulty: "Intermediate",
          timeTaken: "3 weeks",
          githubLink: "",
          liveDemo: "",
          features: [
            "Responsive Design",
            "Interactive UI",
          ],
          challenges: "Describe your challenge.",
          learnings: "Describe your learning.",
          featured: false,
          status: "published",
        },
      ]);

      console.log("✅ Sample projects created.");
    } else {
      console.log("ℹ️ Projects already exist. Skipping...");
    }

    // =======================
    // Sample Blog
    // =======================
    const blogCount = await Blog.countDocuments();

    if (blogCount === 0) {
      await Blog.create({
        title: "Getting Started with the MERN Stack",
        slug: "getting-started-mern-stack",
        excerpt:
          "Learn the fundamentals of MongoDB, Express, React, and Node.js.",
        content: `
          <p>The MERN stack is one of the most popular full-stack JavaScript technologies.</p>

          <h3>MongoDB</h3>
          <p>A NoSQL database for storing application data.</p>

          <h3>Express.js</h3>
          <p>A lightweight backend framework for Node.js.</p>

          <h3>React</h3>
          <p>A frontend library for building user interfaces.</p>

          <h3>Node.js</h3>
          <p>A JavaScript runtime that powers the backend.</p>
        `,
        status: "published",
        tags: ["MERN", "React", "Node.js", "MongoDB"],
      });

      console.log("✅ Sample blog created.");
    } else {
      console.log("ℹ️ Blogs already exist. Skipping...");
    }

    // =======================
    // Sample Skills
    // =======================
    const skillCount = await Skill.countDocuments();

    if (skillCount === 0) {
      await Skill.insertMany([
        { name: "HTML / CSS", level: 90, category: "Frontend", icon: "🎨", order: 1 },
        { name: "JavaScript", level: 85, category: "Frontend", icon: "⚡", order: 2 },
        { name: "React.js", level: 80, category: "Frontend", icon: "⚛️", order: 3 },
        { name: "Node.js / Express.js", level: 80, category: "Backend", icon: "🚀", order: 4 },
        { name: "MongoDB", level: 75, category: "Database", icon: "🍃", order: 5 },
        { name: "Java", level: 85, category: "Languages", icon: "☕", order: 6 },
        { name: "Python", level: 75, category: "Languages", icon: "🐍", order: 7 },
        { name: "SQL", level: 80, category: "Database", icon: "🗄️", order: 8 },
      ]);

      console.log("✅ Sample skills created.");
    } else {
      console.log("ℹ️ Skills already exist. Skipping...");
    }

    // =======================
    // Sample Journey
    // =======================
    const journeyCount = await Journey.countDocuments();

    if (journeyCount === 0) {
      await Journey.insertMany([
        {
          year: "2023",
          title: "Started B.Tech Information Technology",
          description: "Began my engineering journey and learned programming fundamentals using C, Java, and Python.",
          type: "education",
          order: 1,
        },
        {
          year: "2024",
          title: "Built File Organizer",
          description: "Developed a Python-based File Organizer that automatically categorizes files and simplifies file management.",
          type: "project",
          order: 2,
        },
        {
          year: "2025",
          title: "Built Event Registration System",
          description: "Developed a full-stack MERN application for managing college symposium events with authentication and role-based access.",
          type: "project",
          order: 3,
        },
        {
          year: "2026",
          title: "Completed Full Stack Internship",
          description: "Worked on real-world full-stack projects using the MERN stack and improved my development and debugging skills.",
          type: "work",
          order: 4,
        },
        {
          year: "Present",
          title: "Building Portfolio CMS & StudentOS",
          description: "Currently developing an advanced portfolio with a custom CMS and an AI-powered StudentOS productivity platform.",
          type: "milestone",
          order: 5,
        },
      ]);

      console.log("✅ Sample journey items created.");
    } else {
      console.log("ℹ️ Journey items already exist. Skipping...");
    }

    console.log("\n🎉 Database seeded successfully!");

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:");
    console.error(err);
    await mongoose.connection.close();
    process.exit(1);
  }
};

run();