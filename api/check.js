export default function handler(req, res) {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = forwarded
    ? forwarded.split(",")[0].trim()
    : req.socket.remoteAddress;

  // User-Agentの取得（存在しない場合は空文字）
  const userAgent = req.headers["user-agent"] || "";

  console.log("=== USER-AGENT CLOAKING TEST ===");
  console.log("IP:", ip);
  console.log("User-Agent:", userAgent);
  console.log("Path:", req.url);

  // 判定キーワード（小文字で比較するためにtoLowerCaseを使用）
  const isGoogleBot = userAgent.toLowerCase().includes("chatgpt");

  if (isGoogleBot) {
    return res.status(200).send(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>UA TEST - TARGET (GOOGLE)</title>
</head>
<body>
  <h1>TEST-A</h1>
  <p>Detected User-Agent: ${userAgent}</p>
  <p>This page is shown only to Google User-Agent requests.</p>
</body>
</html>
    `);
  }

  return res.status(200).send(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>UA TEST - NORMAL</title>
</head>
<body>
  <h1>TEST-B</h1>
  <p>Normal visitor</p>
  <p>Your User-Agent: ${userAgent}</p>
</body>
</html>
  `);
}
