import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/get-response/{responseId}:
 *   get:
 *     summary: 取得特定回應資料
 *     description: 根據回應ID從 Typeform API 取得特定回應的詳細資料
 *     tags: [Typeform Responses]
 *     parameters:
 *       - in: path
 *         name: responseId
 *         required: true
 *         description: 回應ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 成功取得回應資料
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   $ref: '#/components/schemas/Response'
 *       400:
 *         description: 缺少必要參數
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: 找不到指定的回應
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: 伺服器錯誤
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   options:
 *     summary: CORS 預檢請求
 *     description: 處理 CORS 預檢請求
 *     tags: [CORS]
 *     responses:
 *       200:
 *         description: CORS 預檢請求成功
 */
const TYPEFORM_TOKEN = process.env.TYPEFORM_TOKEN;
const FORM_ID = process.env.FORM_ID;

// 添加CORS配置
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// 处理OPTIONS请求（预检请求）
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request, { params }) {
  try {
    const { responseId } = params;

    if (!responseId) {
      return NextResponse.json(
        { error: '缺少必要的 response_id 参数' },
        { 
          status: 400,
          headers: corsHeaders 
        }
      );
    }
    const res = await fetch(
      `https://api.typeform.com/forms/${FORM_ID}/responses?included_response_ids=${responseId}`,
      {
        headers: {
          Authorization: `Bearer ${TYPEFORM_TOKEN}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Typeform API 錯誤: ${res.status}`);
    }

    const data = await res.json();
    
    if (!data.items || data.items.length === 0) {
      return NextResponse.json(
        { error: '找不到指定的問卷回應' },
        { 
          status: 404,
          headers: corsHeaders 
        }
      );
    }

    return NextResponse.json(
      { response: data.items[0] },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('API 錯誤:', error);
    return NextResponse.json(
      { error: error.message },
      { 
        status: 500,
        headers: corsHeaders 
      }
    );
  }
}