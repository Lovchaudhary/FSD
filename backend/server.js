require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/admin',   require('./routes/admin'));
app.use('/api/teacher', require('./routes/teacher'));
app.use('/api/student', require('./routes/student'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// 404
app.use((req, res) => res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@examcell.com' });
    if (!adminExists) {
      await User.create({
        name: 'System Administrator',
        email: 'admin@examcell.com',
        password: 'Password123',
        role: 'admin',
        isActive: true
      });
      console.log('🛡️  Default Admin account created! (admin@examcell.com / Password123)');
    }
  } catch (err) {
    console.error('Failed to seed admin:', err.message);
  }
};

seedAdmin().then(() => {
  app.listen(PORT, () => console.log(`🚀 ExamCell backend running on http://localhost:${PORT}`));
});
