import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Temporary in-memory database
let users = [];
let profiles = [];

// Simple routes for testing
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 CafeMeetups Backend is running!',
    version: '1.0.0'
  });
});

app.post('/api/auth/signup', (req, res) => {
  const user = { 
    id: Date.now(), 
    ...req.body,
    createdAt: new Date()
  };
  users.push(user);
  res.json({ 
    message: 'User created successfully', 
    user: { 
      id: user.id, 
      name: user.name, 
      email: user.email,
      community: user.community 
    } 
  });
});

app.get('/api/profiles', (req, res) => {
  res.json({ 
    message: 'Profiles fetched successfully',
    profiles: users 
  });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    message: '✅ Backend is working perfectly!',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend: ${process.env.FRONTEND_URL}`);
});
