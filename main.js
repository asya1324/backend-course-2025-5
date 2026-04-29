const { program } = require('commander');
const fs = require('fs');
const path = require('path');
const http = require('http');
const superagent = require('superagent');

program
  .requiredOption('-H, --host <address>')
  .requiredOption('-p, --port <number>')
  .requiredOption('-c, --cache <directory>');

program.parse();
const options = program.opts();

const cachePath = path.join(__dirname, options.cache);

if (!fs.existsSync(cachePath)) {
  fs.mkdirSync(cachePath, { recursive: true });
}

const server = http.createServer(async (req, res) => {
  const code = req.url.slice(1);
  const filePath = path.join(cachePath, `${code}.jpg`);

  if (!code) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('Not Found');
  }

  try {

    if (req.method === 'GET') {
    let data;

    if (fs.existsSync(filePath)) {
      data = await fs.promises.readFile(filePath);
  } else {
    
    try {
      const response = await superagent
        .get(`https://http.cat/${code}.jpg`)
        .buffer(true);

      data = response.body;

      await fs.promises.writeFile(filePath, data);

    } catch (error) {
      res.writeHead(404, {
        'Content-Type': 'text/plain'
      });

      return res.end('Not Found');
    }
  }

  res.writeHead(200, {
    'Content-Type': 'image/jpeg'
  });

  return res.end(data);
}

    if (req.method === 'PUT') {
      const chunks = [];

      req.on('data', (chunk) => {
        chunks.push(chunk);
      });

      req.on('end', async () => {
        const data = Buffer.concat(chunks);

        await fs.promises.writeFile(filePath, data);

        res.writeHead(201, {
          'Content-Type': 'text/plain'
        });

        res.end('Created');
      });

      return;
    }

        if (req.method === 'DELETE') {
      await fs.promises.unlink(filePath);

      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });

      return res.end('Deleted');
    }

    res.writeHead(405, {
      'Content-Type': 'text/plain'
    });

    res.end('Method Not Allowed');


  } catch (error) {
    res.writeHead(404, {
      'Content-Type': 'text/plain'
    });

    res.end('Not Found');
  }
});

server.listen(options.port, options.host, () => {
  console.log(`Server listening on http://${options.host}:${options.port}`);
});


