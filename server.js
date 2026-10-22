// Minimal test app — no dependencies, just Node's built-in http module.
import http from "node:http";
import { readFile } from "node:fs/promises";

const PORT = process.env.PORT || 3000;
const started = new Date().toISOString();

const server = http.createServer(async (req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ status: "ok", started }));
  }
  try {
    const html = await readFile(new URL("./public/index.html", import.meta.url), "utf8");
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html.replace("{{STARTED}}", started));
  } catch {
    res.writeHead(500);
    res.end("Error");
  }
});

server.listen(PORT, () => console.log(`Test app listening on ${PORT}`));
