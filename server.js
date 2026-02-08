const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from root directory (must come before API CORS)
app.use(express.static(path.join(__dirname)));

// CORS for API routes only
app.use('/api', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Helper function to read and parse JSON files
function loadJsonFile(filename) {
  try {
    const filePath = path.join(__dirname, 'data', filename);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading ${filename}:`, error.message);
    return null;
  }
}

// API Routes

// Get all domain statistics
app.get('/api/domains', (req, res) => {
  const data = loadJsonFile('domain_stats.json');
  if (data) {
    res.json(data);
  } else {
    res.status(500).json({ error: 'Failed to load domain statistics' });
  }
});

// Get all vignettes by domain
app.get('/api/vignettes', (req, res) => {
  const data = loadJsonFile('vignettes_by_domain.json');
  if (data) {
    res.json(data);
  } else {
    res.status(500).json({ error: 'Failed to load vignettes' });
  }
});

// Get vignettes for a specific domain
app.get('/api/vignettes/:domain', (req, res) => {
  const domain = req.params.domain;
  const data = loadJsonFile('vignettes_by_domain.json');

  if (data && data[domain]) {
    res.json({ domain, vignettes: data[domain] });
  } else if (data) {
    res.status(404).json({ error: `Domain '${domain}' not found` });
  } else {
    res.status(500).json({ error: 'Failed to load vignettes' });
  }
});

// Get all concepts
app.get('/api/concepts', (req, res) => {
  const data = loadJsonFile('concepts.json');
  if (data) {
    res.json(data);
  } else {
    res.status(500).json({ error: 'Failed to load concepts' });
  }
});

// Get all mnemonics
app.get('/api/mnemonics', (req, res) => {
  const data = loadJsonFile('mnemonics.json');
  if (data) {
    res.json(data);
  } else {
    res.status(500).json({ error: 'Failed to load mnemonics' });
  }
});

// Get all pearls
app.get('/api/pearls', (req, res) => {
  const data = loadJsonFile('pearls.json');
  if (data) {
    res.json(data);
  } else {
    res.status(500).json({ error: 'Failed to load pearls' });
  }
});

// Get NBME playbook
app.get('/api/playbook', (req, res) => {
  const data = loadJsonFile('nbme_playbook.json');
  if (data) {
    res.json(data);
  } else {
    res.status(500).json({ error: 'Failed to load playbook' });
  }
});

// Get concept frequency data
app.get('/api/frequency', (req, res) => {
  const data = loadJsonFile('concept_frequency.json');
  if (data) {
    res.json(data);
  } else {
    res.status(500).json({ error: 'Failed to load frequency data' });
  }
});

// Get Cardiology deep-dive data
app.get('/api/cardiology', (req, res) => {
  const data = loadJsonFile('peds_cardiology.json');
  if (data) {
    res.json(data);
  } else {
    res.status(500).json({ error: 'Failed to load cardiology data' });
  }
});

// Get Infectious Disease & Antibiotics deep-dive data
app.get('/api/id-antibiotics', (req, res) => {
  const data = loadJsonFile('peds_id_antibiotics.json');
  if (data) {
    res.json(data);
  } else {
    res.status(500).json({ error: 'Failed to load ID/antibiotics data' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Start server (only when run directly, not when imported by Vercel)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║     Pediatrics Shelf Exam Study App                       ║
║     Server running at: http://localhost:${PORT}                  ║
║     Press Ctrl+C to stop the server                        ║
╚════════════════════════════════════════════════════════════╝
    `);
  });
}

// Export for Vercel serverless
module.exports = app;
