/**
 * @swagger
 * /api/get-score/{responseId}:
 *   get:
 *     tags:
 *       - Score Calculation
 *     summary: 根據 Typeform Response ID 計算寵物健康分數
 *     description: 透過 Typeform Response ID 獲取問卷回答，並根據預設權重計算九大健康項目分數
 *     parameters:
 *       - in: path
 *         name: responseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Typeform Response ID
 *         example: "ugplskupcpikn8xvlougpl1f2vlqonr1"
 *     responses:
 *       200:
 *         description: 分數計算成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetScoreResponse'
 *       400:
 *         description: 缺少必要參數
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: 找不到對應的問卷資料
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: 伺服器內部錯誤
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   options:
 *     tags:
 *       - Score Calculation
 *     summary: CORS preflight request
 *     description: Handle CORS preflight requests for the get-score endpoint
 *     responses:
 *       200:
 *         description: CORS headers returned successfully
 */

import { NextResponse } from 'next/server';
import { calculateHealthScores } from '@/lib/scoreCalculator';

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
  try {
    console.log('params', params);
    const { responseId } = await params;
    console.log('responseId', responseId);
    if (!responseId) {
      return new Response(JSON.stringify({ error: '缺少 responseId 參數' }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // 調用 Typeform API 獲取問卷資料
    const TYPEFORM_TOKEN = process.env.TYPEFORM_TOKEN;
    const FORM_ID = process.env.FORM_ID;

    if (!TYPEFORM_TOKEN || !FORM_ID) {
      return new Response(JSON.stringify({ error: '缺少必要的環境變數' }), {
        status: 500,
        headers: corsHeaders,
      });
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
      return new Response(JSON.stringify({ error: '無法獲取 Typeform 資料' }), {
        status: res.status,
        headers: corsHeaders,
      });
    }

    const typeformData = await res.json();
    console.log('typeformData', typeformData);
    // 過濾出 responseId 完全符合的那一筆
    const matched = (typeformData.items || []).find(item => 
      item.response_id === responseId
    );

    if (!matched) {
      return new Response(JSON.stringify({ 
        error: '找不到對應的問卷資料',
        responseId: responseId 
      }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    // 提取答案資料
    const answers = matched.answers || [];

    // 使用共用的分數計算功能
    const { scores, topCategories, totalQuestionsProcessed } = await calculateHealthScores(answers);

    // 返回結果
    const result = {
      success: true,
      responseId: responseId,
      scores: scores,
      top_categories: topCategories,
      total_questions_processed: totalQuestionsProcessed,
      message: '分數計算完成',
      raw_data: {
        response_id: matched.response_id,
        submitted_at: matched.submitted_at,
        answers_count: answers.length
      }
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: corsHeaders,
    });

  } catch (error) {
    console.error('分數計算API錯誤:', error);
    return new Response(JSON.stringify({ 
      error: '分數計算失敗', 
      details: error.message 
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
