// src/app/api/get-responses-by-email/[email]/route.js

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function GET(request, { params }) {
  const email = params.email;

  if (!email) {
    return new Response(JSON.stringify({ message: 'Email is required' }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  const TYPEFORM_TOKEN = process.env.TYPEFORM_TOKEN;
  const FORM_ID = process.env.FORM_ID;

  const url = new URL(`https://api.typeform.com/forms/${FORM_ID}/responses`);
  url.searchParams.append('query', email);

  const res = await fetch(url.toString(), {
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