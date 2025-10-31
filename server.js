import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Assignment from './models/Assignment.js';
import Submission from './models/Submission.js';
import User from './models/User.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// 🔗 Connect to MongoDB
mongoose.connect(
  'mongodb://127.0.0.1:27017/assignmentsDB',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

/* ------------------------------------------------------------------
   📌 ASSIGNMENT ROUTES
------------------------------------------------------------------ */

// ➕ Add new assignment
app.post('/api/assignments', async (req, res) => {
  try {
    const assignment = new Assignment(req.body);
    await assignment.save();
    res.status(201).json(assignment);
  } catch (err) {
    res.status(400).json({ error: 'Error saving assignment' });
  }
});

// 📋 Get all assignments
app.get('/api/assignments', async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching assignments' });
  }
});

// 🔍 Get single assignment by ID
app.get('/api/assignments/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching assignment' });
  }
});

// ✏️ Update assignment
app.put('/api/assignments/:id', async (req, res) => {
  try {
    const updated = await Assignment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: 'Assignment not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating assignment' });
  }
});

// 🗑️ Delete assignment (cascade delete submissions)
app.delete('/api/assignments/:id', async (req, res) => {
  try {
    const assignmentId = req.params.id;
    await Assignment.findByIdAndDelete(assignmentId);
    await Submission.deleteMany({ assignmentId });
    res.json({ message: 'Assignment and its submissions deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting assignment and submissions' });
  }
});

/* ------------------------------------------------------------------
   📌 SUBMISSION ROUTES
------------------------------------------------------------------ */

// 📨 Submit assignment
app.post('/api/submissions', async (req, res) => {
  try {
    const { assignmentId, rollNo, name, answer } = req.body;
    const submission = new Submission({
      assignmentId,
      rollNo,
      name,
      answer,
      submitted: true,
      submittedAt: new Date(),
    });
    await submission.save();
    await Assignment.findByIdAndUpdate(assignmentId, { status: 'Submitted' });
    res.status(201).json(submission);
  } catch (err) {
    console.error('Error saving submission:', err);
    res.status(400).json({ error: 'Error saving submission' });
  }
});

// 📋 Get all submissions with populated assignment data
app.get('/api/submissions', async (req, res) => {
  try {
    const submissions = await Submission.find().populate('assignmentId');
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching submissions' });
  }
});

// 📋 Get submissions for a specific assignment
app.get('/api/submissions/assignment/:assignmentId', async (req, res) => {
  try {
    const submissions = await Submission.find({ assignmentId: req.params.assignmentId }).populate('assignmentId');
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching assignment submissions' });
  }
});

// ✏️ Update a student's submission (Edit)
app.put('/api/submissions/:id', async (req, res) => {
  try {
    const updatedSubmission = await Submission.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedSubmission) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    res.json(updatedSubmission);
  } catch (err) {
    res.status(500).json({ error: 'Error updating submission.' });
  }
});

// 📄 Get single submission by ID (View)
app.get('/api/submissions/:id', async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id).populate('assignmentId');
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    res.json(submission);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching submission.' });
  }
});

// BULK REGISTER USERS
app.post('/api/auth/batch-register', async (req, res) => {
  try {
    const { rollNumbers } = req.body; // Should be array
    if (!Array.isArray(rollNumbers) || rollNumbers.length === 0)
      return res.status(400).json({ error: "Provide array of roll numbers" });

    const results = [];
    for (const roll of rollNumbers) {
      if (typeof roll !== "string" || roll.length < 5) continue;
      const userid = roll;
      const password = roll.slice(0, 5);
      const exists = await User.findOne({ userid });
      if (exists) {
        results.push({ userid, status: "already exists" });
        continue;
      }
      await User.create({ userid, password });
      results.push({ userid, password, status: "created" });
    }
    res.json({ count: results.length, results });
  } catch (err) {
    res.status(500).json({ error: "Batch registration failed" });
  }
});

/* ------------------------------------------------------------------
   ✅ SERVER START
------------------------------------------------------------------ */
app.listen(5000, () => console.log('🚀 Server running on port 5000'));
