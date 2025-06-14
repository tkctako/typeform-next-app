// src/app/api/get-responses/route.js

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function GET() {
  const TYPEFORM_TOKEN = process.env.TYPEFORM_TOKEN;
  const FORM_ID = process.env.FORM_ID;

  const res = await fetch(`https://api.typeform.com/forms/${FORM_ID}/responses`, {
    headers: {
      Authorization: `Bearer ${TYPEFORM_TOKEN}`,
    },
  });

  const data = await res.json();

  return new Response(JSON.stringify(data), {
    status: res.ok ? 200 : res.status,
    headers: corsHeaders,
  });
}
