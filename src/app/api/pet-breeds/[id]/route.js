import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import PetBreed from '@/models/PetBreed';

/**
 * @swagger
 * components:
 *   schemas:
 *     PetBreedData:
 *       type: object
 *       properties:
 *         petType:
 *           type: string
 *           enum: [cat, dog]
 *           description: 寵物類型
 *         breedName:
 *           type: string
 *           description: 品種名稱
 *         description:
 *           type: string
 *           description: 品種描述
 *         healthItems:
 *           type: object
 *           description: 健康項目說明
 *           additionalProperties:
 *             type: string
 *     PetBreedResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         petBreed:
 *           $ref: '#/components/schemas/PetBreedData'
 *         petBreeds:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PetBreedData'
 */

/**
 * @swagger
 * /api/pet-breeds:
 *   post:
 *     summary: 新增寵物品種
 *     description: 新增一個新的寵物品種資料
 *     tags: [Pet Breeds]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PetBreedData'
 *     responses:
 *       200:
 *         description: 成功新增寵物品種
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PetBreedResponse'
 *       400:
 *         description: 請求參數錯誤
 *       500:
 *         description: 伺服器錯誤
 *   get:
 *     summary: 取得寵物品種列表
 *     description: 取得寵物品種資料，可指定寵物類型或取得全部
 *     tags: [Pet Breeds]
 *     parameters:
 *       - in: query
 *         name: petType
 *         required: false
 *         description: 寵物類型，不提供則取得全部
 *         schema:
 *           type: string
 *           enum: [cat, dog]
 *     responses:
 *       200:
 *         description: 成功取得寵物品種資料
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PetBreedResponse'
 *       500:
 *         description: 伺服器錯誤
 */
export async function POST(request) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const body = await request.json();
    
    // 驗證必要欄位
    if (!body.petType || !body.breedName) {
      return NextResponse.json({ 
        success: false, 
        error: 'petType 和 breedName 為必填欄位' 
      }, { status: 400 });
    }

    // 檢查是否已存在相同類型和品種名稱
    const existingBreed = await PetBreed.findOne({ 
      petType: body.petType, 
      breedName: body.breedName 
    });

    if (existingBreed) {
      return NextResponse.json({ 
        success: false, 
        error: '該品種已存在' 
      }, { status: 400 });
    }

    const petBreed = new PetBreed({
      petType: body.petType,
      breedName: body.breedName,
      description: body.description || '',
      healthItems: body.healthItems || new Map()
    });

    await petBreed.save();

    return NextResponse.json({ success: true, petBreed });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const { searchParams } = new URL(request.url);
    const petType = searchParams.get('petType');

    let query = {};
    if (petType) {
      query.petType = petType;
    }

    const petBreeds = await PetBreed.find(query).sort({ petType: 1, breedName: 1 });
    
    return NextResponse.json({ success: true, petBreeds });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/pet-breeds/{id}:
 *   put:
 *     summary: 更新寵物品種
 *     description: 更新指定 ID 的寵物品種資料
 *     tags: [Pet Breeds]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 寵物品種 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PetBreedData'
 *     responses:
 *       200:
 *         description: 成功更新寵物品種
 *       404:
 *         description: 找不到指定的寵物品種
 *       500:
 *         description: 伺服器錯誤
 *   delete:
 *     summary: 刪除寵物品種
 *     description: 刪除指定 ID 的寵物品種
 *     tags: [Pet Breeds]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 寵物品種 ID
 *     responses:
 *       200:
 *         description: 成功刪除寵物品種
 *       404:
 *         description: 找不到指定的寵物品種
 *       500:
 *         description: 伺服器錯誤
 */
export async function PUT(request, { params }) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const { id } = await params;
    const body = await request.json();

    const petBreed = await PetBreed.findByIdAndUpdate(
      id,
      {
        petType: body.petType,
        breedName: body.breedName,
        description: body.description || '',
        healthItems: body.healthItems || new Map(),
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!petBreed) {
      return NextResponse.json({ 
        success: false, 
        error: '找不到指定的寵物品種' 
      }, { status: 404 });
    }

    return NextResponse.json({ success: true, petBreed });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const { id } = await params;
    const petBreed = await PetBreed.findByIdAndDelete(id);

    if (!petBreed) {
      return NextResponse.json({ 
        success: false, 
        error: '找不到指定的寵物品種' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: '寵物品種刪除成功' 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
