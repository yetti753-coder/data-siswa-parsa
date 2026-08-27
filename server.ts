import express from 'express';
import path from 'path';
import https from 'https';
import { createServer as createViteServer } from 'vite';

async function fetchGoogleSheetCsv(sheetId: string, gid: string = '0'): Promise<string> {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
  
  const fetchWithRedirect = (targetUrl: string, maxRedirects = 5): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (maxRedirects <= 0) {
        return reject(new Error('Too many redirects'));
      }
      https.get(targetUrl, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return fetchWithRedirect(res.headers.location, maxRedirects - 1).then(resolve, reject);
        }
        if (res.statusCode && res.statusCode >= 400) {
          return reject(new Error(`Failed with status code: ${res.statusCode}`));
        }
        let data = '';
        res.on('data', chunk => (data += chunk));
        res.on('end', () => resolve(data));
      }).on('error', reject);
    });
  };

  return fetchWithRedirect(url);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route to fetch Google Sheet CSV with caching & fallback
  app.get('/api/sheets-data', async (req, res) => {
    try {
      const sheetId = (req.query.sheetId as string) || '1w3s2CpJd8ENjZ-lFI-ndVeMjYXZZdqczWyOKc2G0VNg';
      const gid = (req.query.gid as string) || '732261769';

      const csvData = await fetchGoogleSheetCsv(sheetId, gid);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.send(csvData);
    } catch (error: any) {
      console.error('Error fetching sheet data:', error);
      res.status(500).json({
        error: 'Failed to fetch spreadsheet data',
        message: error?.message || 'Unknown error',
      });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
