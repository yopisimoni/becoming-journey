/**
 * BECOMING local-only Groq gateway prototype.
 * Do not bind publicly. No user notes, journal, account identifiers or arbitrary prompt text.
 * This internal endpoint requires server-to-server authorization and explicit test consent.
 */
import { createServer } from 'node:http';
import { timingSafeEqual } from 'node:crypto';

export const MODEL = 'openai/gpt-oss-20b';
const LANGUAGES = { en:'English', ar:'Arabic', fr:'French', es:'Spanish', it:'Italian' };
const STAGES = new Set(['welcome', 'explore', 'pause', 'progress']);
const MAX_BYTES = 512;
const DEFAULT_DAILY_CAP = 20;

function authOk(header, expected) {
  const got = header?.startsWith('Bearer ') ? header.slice(7) : '';
  if (!expected || !got) return false;
  const a = Buffer.from(got), b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
function send(res, status, data) {
  res.writeHead(status, {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
  res.end(JSON.stringify(data));
}
function cleanText(value) {
  if (typeof value !== 'string') return null;
  const text = value.trim();
  if (text.length < 2 || text.length > 240 || /[<>\x00-\x08]/.test(text)) return null;
  return text;
}
export function makeGateway({env=process.env, fetcher=fetch, now=()=>Date.now()}={}) {
  let windowStart = now(), total = 0;
  const cap = Math.max(1, Math.min(100, Number(env.GROQ_DAILY_REQUEST_CAP || DEFAULT_DAILY_CAP) || DEFAULT_DAILY_CAP));
  return createServer(async (req, res) => {
    if(req.method === 'GET' && req.url === '/health') return send(res, 200, {ok:true, enabled:env.GROQ_GATEWAY_ENABLED === 'true' && !!env.GROQ_API_KEY});
    if(req.url !== '/internal/greeting' || req.method !== 'POST') return send(res, 404, {error:'not_found'});
    // Protect from sending anything to Groq until every safety gate is explicitly enabled.
    if(env.GROQ_GATEWAY_ENABLED !== 'true' || !env.GROQ_API_KEY || !env.GATEWAY_INTERNAL_TOKEN) return send(res, 503, {error:'gateway_disabled'});
    if(!authOk(req.headers.authorization, env.GATEWAY_INTERNAL_TOKEN)) return send(res, 401, {error:'unauthorized'});
    if(req.headers['content-type']?.split(';')[0] !== 'application/json') return send(res, 415, {error:'json_required'});
    let raw='';
    try {
      for await (const chunk of req) {
        raw += chunk;
        if(Buffer.byteLength(raw) > MAX_BYTES) return send(res, 413, {error:'too_large'});
      }
    } catch { return send(res, 400, {error:'invalid_request'}); }
    let body;
    try { body=JSON.parse(raw); } catch { return send(res, 400, {error:'invalid_json'}); }
    if(!body || Array.isArray(body) || Object.keys(body).sort().join(',') !== 'approvedForExternalProcessing,locale,stage' || body.approvedForExternalProcessing !== true || !LANGUAGES[body.locale] || !STAGES.has(body.stage)) return send(res, 422, {error:'invalid_or_unapproved_payload'});
    if(now()-windowStart >= 86_400_000) { windowStart=now();total=0; }
    if(total >= cap) return send(res, 429, {error:'daily_cap_reached'});
    total++;
    const controller = new AbortController();
    const timeout = setTimeout(()=>controller.abort(), 5500);
    try {
      const upstream = await fetcher('https://api.groq.com/openai/v1/chat/completions', {
        method:'POST', signal:controller.signal,
        headers:{'Authorization':`Bearer ${env.GROQ_API_KEY}`,'Content-Type':'application/json'},
        body: JSON.stringify({model:MODEL, temperature:0.4, max_completion_tokens:160,
          messages:[
            {role:'system',content:`You provide a short, non-clinical, non-directive greeting for a self-reflection app. Reply in ${LANGUAGES[body.locale]} only. Do not claim to know the user. Never diagnose, pressure or form personal attachments. Return just one encouraging, neutral sentence, under 160 characters. No advice about health or major life decisions.`},
            {role:'user',content:`Generate a general greeting for the predefined app stage: ${body.stage}. No user text is included.`}
          ]})
      });
      if(!upstream.ok) return send(res, 502, {error:'provider_unavailable'});
      const result = await upstream.json();
      const greeting=cleanText(result?.choices?.[0]?.message?.content);
      if(!greeting) return send(res, 502, {error:'invalid_response'});
      return send(res, 200, {greeting, provider:'groq', model:MODEL});
    } catch { return send(res, 502, {error:'provider_unavailable'}); }
    finally { clearTimeout(timeout); }
  });
}

if(process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  // Loopback binding is deliberate. Use a trusted reverse proxy and BFF before any public beta.
  makeGateway().listen(Number(process.env.GATEWAY_PORT||18771),'127.0.0.1');
}
