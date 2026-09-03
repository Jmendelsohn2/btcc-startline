// Sends an incident report as an email with the photo(s) attached.
// Reads GMAIL_USER and GMAIL_APP_PASSWORD from Netlify environment variables.
const nodemailer = require('nodemailer');

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function reply(statusCode, obj) {
  return { statusCode, headers: { 'Content-Type': 'application/json', ...CORS }, body: JSON.stringify(obj) };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return reply(405, { error: 'Method not allowed' });

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return reply(500, { error: 'Email not configured on the server' });

  let data;
  try { data = JSON.parse(event.body || '{}'); } catch { return reply(400, { error: 'Bad request' }); }

  const to = String(data.to || '').trim();
  const subject = String(data.subject || 'Incident report').trim();
  const text = String(data.text || '');
  const photos = Array.isArray(data.photos) ? data.photos : [];

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) return reply(400, { error: 'Bad recipient address' });
  if (photos.length === 0) return reply(400, { error: 'No photo attached' });
  if (photos.length > 8) return reply(400, { error: 'Too many photos' });

  const attachments = photos.map((p, i) => ({
    filename: `incident-${i + 1}.jpg`,
    content: String(p).replace(/^data:image\/[a-z]+;base64,/i, ''),
    encoding: 'base64',
  }));

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  try {
    const info = await transporter.sendMail({
      from: `BTCC Startline <${user}>`,
      to,
      subject,
      text,
      attachments,
    });
    return reply(200, { ok: true, id: info.messageId });
  } catch (e) {
    return reply(502, { error: 'The email did not send', detail: String((e && e.message) || e) });
  }
};
