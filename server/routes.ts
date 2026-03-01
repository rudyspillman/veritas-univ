import express from 'express';
import { analyzeContentBackend } from './gemini.js';

const router = express.Router();

router.post('/analyze', async (req, res) => {
  try {
    const { text, fileData } = req.body;

    if (!text && !fileData) {
      return res.status(400).json({ error: "No content provided for analysis." });
    }

    const result = await analyzeContentBackend(text, fileData);
    res.json(result);
  } catch (error: any) {
    console.error("API Error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

export default router;
