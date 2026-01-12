import express from "express";
import { chromium } from "playwright";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const APP_API_KEY = process.env.PLAYWRIGHT_API_KEY || process.env.API_KEY;

function checkKey(req) {
  const key = req.headers["x-api-key"] || req.body?.apiKey;
  return APP_API_KEY && key === APP_API_KEY;
}

app.get("/", (_req, res) => {
  res.send("Playwright scraper is running");
});

app.post("/scrape", async (req, res) => {
  try {
    if (!checkKey(req)) {
      return res.status(401).json({ error: "Invalid API key" });
    }

    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "Missing url" });

    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle" });

    const title = await page.title();
    const content = await page.textContent("body");

    await browser.close();

    return res.json({ url, title, content });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Scrape failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
