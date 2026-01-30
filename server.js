const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pmo-tracker', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Database Schemas
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['PMO', 'PM', 'Team', 'Stakeholder'], default: 'PM' },
  initials: { type: String },
  phone: String,
  createdAt: { type: Date, default: Date.now }
});

const ProjectManagerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  initials: String,
  assignedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

const ResourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  email: { type: String, required: true },
  plannedCapacity: { type: Number, default: 40 },
  skills: [String],
  createdAt: { type: Date, default: Date.now }
});

const ProjectSchema = new mongoose.Schema({
  caseId: { type: String, unique: true },
  name: { type: String, required: true },
  pmId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProjectManager', required: true },
  status: { type: String, enum: ['Planning', 'In Progress', 'Completed', 'Cancelled'], default: 'Planning' },
  health: { type: String, enum: ['On Track', 'At Risk', 'Delayed'], default: 'On Track' },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  type: { type: String, required: true },
  branch: { type: String, required: true },
  startDate: Date,
  endDate: Date,
  budget: { type: Number, default: 0 },
  spent: { type: Number, default: 0 },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  tat: String,
  dependencies: [{
    upstreamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    type: String,
    critical: Boolean
  }],
  resources: [{
    resourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource' },
    allocation: Number,
    actualEffort: Number,
    role: String
  }],
  milestones: [{
    name: String,
    date: Date,
    status: String
  }],
  createdBy: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Models
const User = mongoose.model('User', UserSchema);
const ProjectManager = mongoose.model('ProjectManager', ProjectManagerSchema);
const Resource = mongoose.model('Resource', ResourceSchema);
const Project = mongoose.model('Project', ProjectSchema);

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-this', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// ============ AUTHENTICATION ROUTES ============

// Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create initials
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'PM',
      initials
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully', userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key-change-this',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        initials: user.initials
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ============ PROJECT MANAGER ROUTES ============

// Get all PMs
app.get('/api/pms', authenticateToken, async (req, res) => {
  try {
    const pms = await ProjectManager.find().populate('assignedProjects');
    res.json(pms);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create PM (PMO only)
app.post('/api/pms', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'PMO') {
      return res.status(403).json({ message: 'Access denied. PMO role required.' });
    }

    const { name, email, phone } = req.body;
    
    // Check if PM exists
    const existingPM = await ProjectManager.findOne({ email });
    if (existingPM) {
      return res.status(400).json({ message: 'Project Manager already exists' });
    }

    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();

    const pm = new ProjectManager({
      name,
      email,
      phone,
      initials,
      createdBy: req.user.id
    });

    await pm.save();
    res.status(201).json(pm);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update PM
app.put('/api/pms/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'PMO') {
      return res.status(403).json({ message: 'Access denied. PMO role required.' });
    }

    const pm = await ProjectManager.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!pm) {
      return res.status(404).json({ message: 'Project Manager not found' });
    }

    res.json(pm);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete PM
app.delete('/api/pms/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'PMO') {
      return res.status(403).json({ message: 'Access denied. PMO role required.' });
    }

    await ProjectManager.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project Manager deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ============ RESOURCE ROUTES ============

// Get all resources
app.get('/api/resources', authenticateToken, async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create resource
app.post('/api/resources', authenticateToken, async (req, res) => {
  try {
    const resource = new Resource(req.body);
    await resource.save();
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update resource
app.put('/api/resources/:id', authenticateToken, async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete resource
app.delete('/api/resources/:id', authenticateToken, async (req, res) => {
  try {
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ============ PROJECT ROUTES ============

// Get all projects
app.get('/api/projects', authenticateToken, async (req, res) => {
  try {
    let query = {};
    
    // If PM role, only show their projects
    if (req.user.role === 'PM') {
      const pm = await ProjectManager.findOne({ email: req.user.email });
      if (pm) {
        query._id = { $in: pm.assignedProjects };
      }
    }

    const projects = await Project.find(query)
      .populate('pmId')
      .populate('resources.resourceId')
      .populate('dependencies.upstreamId');
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single project
app.get('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('pmId')
      .populate('resources.resourceId')
      .populate('dependencies.upstreamId');
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create project
app.post('/api/projects', authenticateToken, async (req, res) => {
  try {
    // Generate case ID
    const projectCount = await Project.countDocuments();
    const caseId = `PRJ-2026-${String(projectCount + 1).padStart(3, '0')}`;

    const project = new Project({
      ...req.body,
      caseId,
      createdBy: req.user.name || req.user.email
    });

    await project.save();

    // Add to PM's assigned projects
    await ProjectManager.findByIdAndUpdate(
      req.body.pmId,
      { $push: { assignedProjects: project._id } }
    );

    const populatedProject = await Project.findById(project._id)
      .populate('pmId')
      .populate('resources.resourceId');

    res.status(201).json(populatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update project
app.put('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    )
    .populate('pmId')
    .populate('resources.resourceId');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete project
app.delete('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Remove from PM's assigned projects
    await ProjectManager.findByIdAndUpdate(
      project.pmId,
      { $pull: { assignedProjects: project._id } }
    );

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ============ DASHBOARD STATS ============

app.get('/api/stats/dashboard', authenticateToken, async (req, res) => {
  try {
    const total = await Project.countDocuments();
    const approved = await Project.countDocuments({ status: 'Completed' });
    const pending = await Project.countDocuments({ status: 'Planning' });
    const rejected = await Project.countDocuments({ status: 'Cancelled' });
    const actual = await Project.countDocuments({ status: 'In Progress' });
    const breach = await Project.countDocuments({ health: 'At Risk' });

    res.json({
      total,
      approved,
      pending,
      rejected,
      actual,
      breach
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ============ SEED DATA (FOR INITIAL SETUP) ============

app.post('/api/seed', async (req, res) => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await ProjectManager.deleteMany({});
    await Resource.deleteMany({});
    await Project.deleteMany({});

    // Create default admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = new User({
      name: 'Neelesh Yadav',
      email: 'admin@pmo.com',
      password: hashedPassword,
      role: 'PMO',
      initials: 'NY'
    });
    await adminUser.save();

    // Create sample PMs
    const pm1 = await ProjectManager.create({
      name: 'John Smith',
      email: 'john.smith@company.com',
      phone: '+1-234-567-8901',
      initials: 'JS',
      createdBy: adminUser._id
    });

    const pm2 = await ProjectManager.create({
      name: 'Jane Doe',
      email: 'jane.doe@company.com',
      phone: '+1-234-567-8902',
      initials: 'JD',
      createdBy: adminUser._id
    });

    // Create sample resources
    await Resource.create([
      { name: 'Sarah Chen', role: 'Senior Developer', email: 'sarah.chen@company.com', plannedCapacity: 40, skills: ['React', 'Node.js', 'AWS'] },
      { name: 'Marcus Johnson', role: 'Full Stack Developer', email: 'marcus.j@company.com', plannedCapacity: 40, skills: ['Python', 'Django'] },
      { name: 'Priya Sharma', role: 'UI/UX Designer', email: 'priya.sharma@company.com', plannedCapacity: 40, skills: ['Figma'] }
    ]);

    // Create sample projects
    const project1 = await Project.create({
      caseId: 'PRJ-2026-001',
      name: 'Customer Portal Redesign',
      pmId: pm1._id,
      status: 'In Progress',
      health: 'On Track',
      priority: 'High',
      type: 'Internal',
      branch: 'Technology',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-04-30'),
      budget: 250000,
      spent: 125000,
      progress: 55,
      tat: '<1d',
      createdBy: 'Neelesh Yadav'
    });

    pm1.assignedProjects.push(project1._id);
    await pm1.save();

    res.json({
      message: 'Database seeded successfully',
      adminCredentials: {
        email: 'admin@pmo.com',
        password: 'admin123'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Seed error', error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'PMO Tracker API is running' });
});

// Root route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}`);
    console.log(`🔧 API: http://localhost:${PORT}/api`);
  });
};

startServer();
