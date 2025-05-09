// src/app/api/get-questions/route.js

export async function GET() {
    const TYPEFORM_TOKEN = process.env.TYPEFORM_TOKEN;
    const FORM_ID = process.env.FORM_ID;
  
    const res = await fetch(`https://api.typeform.com/forms/${FORM_ID}`, {
      headers: {
        Authorization: `Bearer ${TYPEFORM_TOKEN}`,
      },
    });
  
    const data = await res.json();
  
    if (!res.ok) {
      return new Response(JSON.stringify(data), { status: res.status });
    }
  
    return new Response(JSON.stringify(data), { status: 200 });
  }
  