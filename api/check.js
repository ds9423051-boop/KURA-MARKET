export default function handler(req, res) {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = forwarded
    ? forwarded.split(",")[0].trim()
    : req.socket.remoteAddress;

  const userAgent = req.headers["user-agent"] || "";
  const lowerUA = userAgent.toLowerCase();
  const isChatGPT = lowerUA.includes("chatgpt");

  console.log("=== USER-AGENT CLOAKING TEST ===");
  console.log("IP:", ip);
  console.log("User-Agent:", userAgent);
  console.log("Lower UA:", lowerUA);
  console.log("Contains chatgpt:", isChatGPT);
  console.log("Path:", req.url);
  console.log("Timestamp:", new Date().toISOString());

  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, max-age=0"
  );
  res.setHeader("CDN-Cache-Control", "no-store");
  res.setHeader("Vercel-CDN-Cache-Control", "no-store");

  res.status(200).send(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>UA TEST</title>
</head>
<body>
  <h1>${isChatGPT ? "TEST-A" : "TEST-B"}</h1>

  <p>Detected User-Agent:</p>
  <pre>${userAgent}</pre>

  <p>Lowercase User-Agent:</p>
  <pre>${lowerUA}</pre>

  <p>Contains "chatgpt": ${isChatGPT}</p>

  <p>Timestamp: ${new Date().toISOString()}</p>

  <p>IP: ${ip}</p>
</body>
</html>
  `);
}
