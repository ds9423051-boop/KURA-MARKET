export default function handler(req, res) {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = forwarded
    ? forwarded.split(",")[0].trim()
    : req.socket.remoteAddress;

  console.log("=== IP CLOAKING TEST ===");
  console.log("IP:", ip);
  console.log("User-Agent:", req.headers["user-agent"]);
  console.log("Path:", req.url);

  const targetIP = "IP: 108.177.69.39";

  if (ip === targetIP) {
    return res.status(200).send(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>IP TEST - TARGET</title>
</head>
<body>
  <h1>TEST-A</h1>
  <p>Target IP: ${targetIP}</p>
  <p>This page is shown only to the target IP.</p>
</body>
</html>
    `);
  }

  return res.status(200).send(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>IP TEST - NORMAL</title>
</head>
<body>
  <h1>TEST-B</h1>
  <p>Normal visitor</p>
</body>
</html>
  `);
}
