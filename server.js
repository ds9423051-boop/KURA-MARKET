const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(__dirname));

// メモリ上だけでログ保持（Vercel対応）
const logs = [];

app.use((req, res, next) => {
    const ip =
        (req.headers['x-forwarded-for'] || '')
            .split(',')[0]
            .trim() || req.socket.remoteAddress;
    const entry = {
        time: new Date().toISOString(),
        ip,
        userAgent: req.headers['user-agent'] || 'N/A',
        path: req.path,
        method: req.method,
        referer: req.headers['referer'] || '-',
    };
    logs.push(entry);
    console.log(
        `[${entry.time}] ${entry.ip} ${entry.method} ${entry.path}`
    );
    next();
});

// トップページ
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Bページ
app.get('/b', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>B site</title>
</head>
<body style="font-family:sans-serif; padding:40px;">
  <h1>遷移先ページ（B）</h1>
  <p>ここはリダイレクト後のページです。</p>
</body>
</html>
  `);
});

// ログ表示
app.get('/logs', (req, res) => {
    const rows = [...logs]
        .reverse()
        .map(
            (l, i) => `
<tr>
    <td>${logs.length - i}</td>
    <td>${l.time}</td>
    <td><strong>${l.ip}</strong></td>
    <td>${l.method}</td>
    <td>${l.path}</td>
    <td style="font-size:11px;max-width:360px;word-break:break-all">
        ${l.userAgent}
    </td>
    <td>${l.referer}</td>
</tr>`
        )
        .join('');
    res.send(`
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>Access Logs</title>
  <style>
    body {
      font-family: monospace;
      padding: 24px;
      background: #0d0d0d;
      color: #e0e0e0;
    }
    h2 {
      color: #00ff88;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin-top: 16px;
    }
    th {
      background: #1a1a1a;
      color: #aaa;
      padding: 8px 12px;
      text-align: left;
      border-bottom: 1px solid #333;
    }
    td {
      padding: 7px 12px;
      border-bottom: 1px solid #1e1e1e;
    }
    tr:hover td {
      background: #111;
    }
    strong {
      color: #00ff88;
    }
  </style>
</head>
<body>
  <h2>
    Access Log — ${logs.length} entries
  </h2>
  <table>
    <tr>
      <th>#</th>
      <th>Time (UTC)</th>
      <th>IP</th>
      <th>Method</th>
      <th>Path</th>
      <th>User-Agent</th>
      <th>Referer</th>
    </tr>
    ${rows}
  </table>
</body>
</html>
`);
});

// JSON形式ログ
app.get('/logs.json', (req, res) => {
    res.json(logs);
});

// Vercel用
module.exports = app;
