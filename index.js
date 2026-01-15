import express from "express";
import fetch from "node-fetch";
import path from "path";

const app = express();
const PORT = 3000;

// Serve static files (our HTML/JS)
app.use(express.static(path.join(process.cwd(), "public")));

// API endpoint to look up ISBN
app.get("/api/book/:isbn", async (req, res) => {
  const { isbn } = req.params;

  // simple ISBN check: 10 or 13 digits
  if (!/^\d{10}(\d{3})?$/.test(isbn)) {
    return res.status(400).json({ error: "Invalid ISBN format" });
  }

  try {
    const resp = await fetch(`https://openlibrary.org/isbn/${isbn}.json`);
    if (!resp.ok) throw new Error("Not found");
    const data = await resp.json();
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: "Book not found" });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
