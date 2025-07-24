const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Feedback = require('./models/Feedback');

const app = express();

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/feedbackDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// EJS as template engine
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => res.redirect('/submit'));

app.get('/submit', (req, res) => {
  res.render('submit', { error: null });
});

app.post('/submit', async (req, res) => {
  const { name, message } = req.body;

  if (!name || !message) {
    return res.render('submit', { error: 'Please fill all fields.' });
  }

  const newFeedback = new Feedback({ name, message });
  await newFeedback.save();
  res.redirect('/testimonials');
});

app.get('/testimonials', async (req, res) => {
  const feedbacks = await Feedback.find().sort({ createdAt: -1 });
  res.render('testimonials', { feedbacks });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
