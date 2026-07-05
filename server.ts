import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import connectDB from "./src/lib/mongodb.ts";
import { About, Skill, Project, Feedback, Visit } from "./src/models/index.ts";

async function startServer() {
  // Connect to MongoDB
  await connectDB();

  const app = express();
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  const PORT = 3000;

  // Logging middleware
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // About/Hero API
  app.get("/api/about", async (req, res) => {
    try {
      const about = await About.findOne();
      res.json(about || {});
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch about data" });
    }
  });

  app.post("/api/about", async (req, res) => {
    try {
      let about = await About.findOne();
      if (about) {
        Object.assign(about, req.body);
        await about.save();
      } else {
        about = await About.create(req.body);
      }
      res.json(about);
    } catch (err) {
      res.status(500).json({ error: "Failed to update about data" });
    }
  });

  // Skills API
  app.get("/api/skills", async (req, res) => {
    try {
      const skills = await Skill.find().sort({ order: 1 });
      res.json(skills);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch skills" });
    }
  });

  app.post("/api/skills", async (req, res) => {
    try {
      const skill = await Skill.create(req.body);
      res.json(skill);
    } catch (err) {
      res.status(500).json({ error: "Failed to create skill" });
    }
  });

  app.put("/api/skills/:id", async (req, res) => {
    try {
      const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(skill);
    } catch (err) {
      res.status(500).json({ error: "Failed to update skill" });
    }
  });

  app.delete("/api/skills/:id", async (req, res) => {
    try {
      await Skill.findByIdAndDelete(req.params.id);
      res.json({ message: "Skill deleted" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete skill" });
    }
  });

  // Projects API
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await Project.find().sort({ order: 1 });
      res.json(projects);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const project = await Project.create(req.body);
      res.json(project);
    } catch (err) {
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(project);
    } catch (err) {
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      await Project.findByIdAndDelete(req.params.id);
      res.json({ message: "Project deleted" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // Feedback API
  app.get("/api/feedback", async (req, res) => {
    try {
      const feedbacks = await Feedback.find({ isApproved: true }).sort({ createdAt: -1 });
      res.json(feedbacks);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch feedbacks" });
    }
  });

  app.get("/api/admin/feedback", async (req, res) => {
    try {
      const feedbacks = await Feedback.find().sort({ createdAt: -1 });
      res.json(feedbacks);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch feedbacks" });
    }
  });

  app.post("/api/feedback", async (req, res) => {
    try {
      const feedback = await Feedback.create(req.body);
      res.json(feedback);
    } catch (err) {
      res.status(500).json({ error: "Failed to create feedback" });
    }
  });

  app.put("/api/feedback/:id/approve", async (req, res) => {
    try {
      const feedback = await Feedback.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
      res.json(feedback);
    } catch (err) {
      res.status(500).json({ error: "Failed to approve feedback" });
    }
  });

  app.delete("/api/feedback/:id", async (req, res) => {
    try {
      await Feedback.findByIdAndDelete(req.params.id);
      res.json({ message: "Feedback deleted" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete feedback" });
    }
  });

  // Visit Count API
  app.get("/api/visits", async (req, res) => {
    try {
      let visit = await Visit.findOne();
      if (!visit) {
        visit = await Visit.create({ count: 0 });
      }
      res.json({ count: visit.count });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch visits" });
    }
  });

  app.post("/api/visits/increment", async (req, res) => {
    try {
      let visit = await Visit.findOne();
      if (!visit) {
        visit = await Visit.create({ count: 1 });
      } else {
        visit.count += 1;
        await visit.save();
      }
      res.json({ count: visit.count });
    } catch (err) {
      res.status(500).json({ error: "Failed to increment visit" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    
    // SPA fallback
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Handle process-level errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

startServer().catch(err => {
  console.error("Critical server startup error:", err);
});
