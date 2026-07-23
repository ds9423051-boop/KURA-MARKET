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
    ...
  </style>
</head>
<body>
  <h2>
    Access Log — ${logs.length} entries
  </h2>
  <table>
    ...
  </table>
</body>
</html>
`);
});
