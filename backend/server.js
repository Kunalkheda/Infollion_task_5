const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

let submissions = [];

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/questions', (req, res) => {
  try {
    const { questions } = req.body;

    if (!questions || !Array.isArray(questions)) {
      return res.status(400).json({ error: 'Invalid questions array' });
    }

    const submission = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      questions,
    };

    submissions.push(submission);
    res.status(201).json({ message: 'Submitted', submission });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/submissions', (req, res) => {
  res.json({ count: submissions.length, submissions });
});

app.get('/api/submissions/:id', (req, res) => {
  try {
    const sub = submissions.find((s) => s.id === req.params.id);
    if (!sub) return res.status(404).json({ error: 'Not found' });
    res.json(sub);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error' });
  }
});

app.delete('/api/submissions/:id', (req, res) => {
  try {
    const idx = submissions.findIndex((s) => s.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    const [deleted] = submissions.splice(idx, 1);
    res.json({ message: 'Deleted', deleted });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error' });
  }
});

app.delete('/api/submissions', (req, res) => {
  const cnt = submissions.length;
  submissions = [];
  res.json({ message: `${cnt} deleted`, count: cnt });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
