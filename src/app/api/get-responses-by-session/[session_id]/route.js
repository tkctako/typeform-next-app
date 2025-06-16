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
  const session_id = params.session_id;

  if (!session_id) {
    return new Response(JSON.stringify({ message: 'Session ID is required' }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  const TYPEFORM_TOKEN = process.env.TYPEFORM_TOKEN;
  const FORM_ID = process.env.FORM_ID;

  const url = new URL(`https://api.typeform.com/forms/${FORM_ID}/responses`);
  // 這裡直接用 query 搜尋 session_id
  url.searchParams.append('query', session_id);

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${TYPEFORM_TOKEN}`,
    },
  });

  const data = await res.json();

  // 過濾出 session_id 完全符合的那一筆
  const matched = (data.items || []).find(item => item.hidden && item.hidden.session_id === session_id);

  if (!matched) {
    return new Response(JSON.stringify({ message: 'No response found for this session_id' }), {
      status: 404,
      headers: corsHeaders,
    });
  }

  return new Response(JSON.stringify(matched), {
    status: 200,
    headers: corsHeaders,
  });
} 