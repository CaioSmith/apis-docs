const http = require('http');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const filePath = path.join(__dirname, 'redocly-docs-manual.yaml');
console.log(filePath);
const outputDir = path.join(__dirname, 'docs');
const PORT = process.env.PORT || 3000;

console.log(`Gerando documentação para o arquivo: ${filePath}`);

exec(`npx redocly preview-docs ${filePath} --port $PORT`, (err, stdout, stderr) => {
  if (err) {
    console.error(`Erro ao gerar a documentação: ${stderr}`);
    process.exit(1);
  }

  console.log(stdout);
  
  const server = http.createServer((req, res) => {
    const indexPath = path.join(outputDir, 'index.html');
    fs.readFile(indexPath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('404 Not Found');
        res.end();
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(data);
      res.end();
    });
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
});
