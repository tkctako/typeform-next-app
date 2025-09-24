// src/lib/swagger.js (完整更新版本)
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Typeform Next App API',
    version: '1.0.0',
    description: 'A comprehensive API for managing typeform responses, products, and recommendations',
    contact: {
      name: 'API Support',
      email: 'support@example.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server'
    },
    {
      url: 'https://your-production-domain.com',
      description: 'Production server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      },
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'token'
      }
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            description: 'Error message'
          },
          message: {
            type: 'string',
            description: 'Error message'
          }
        }
      },
      Product: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Product ID'
          },
          name: {
            type: 'string',
            description: 'Product name'
          },
          price: {
            type: 'number',
            description: 'Product price'
          }
        }
      },
      Customer: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Customer ID'
          },
          name: {
            type: 'string',
            description: 'Customer name'
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'Customer email'
          }
        }
      },
      Response: {
        type: 'object',
        properties: {
          response_id: {
            type: 'string',
            description: 'Response ID'
          },
          user_name: {
            type: 'string',
            description: 'User name'
          },
          submitted_at: {
            type: 'string',
            format: 'date-time',
            description: 'Submission timestamp'
          },
          answers: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string'
                    }
                  }
                },
                type: {
                  type: 'string',
                  enum: ['text', 'boolean', 'choice', 'choices']
                },
                text: {
                  type: 'string'
                },
                boolean: {
                  type: 'boolean'
                },
                choice: {
                  type: 'object'
                },
                choices: {
                  type: 'object'
                }
              }
            }
          }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address'
          },
          password: {
            type: 'string',
            description: 'User password'
          }
        }
      },
      LoginResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'Response message'
          },
          user: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
                format: 'email'
              },
              name: {
                type: 'string'
              }
            }
          }
        }
      },
      SubmitRequest: {
        type: 'object',
        required: ['userId', 'responseId', 'answers'],
        properties: {
          userId: {
            type: 'string',
            description: '會員ID'
          },
          responseId: {
            type: 'string',
            description: '回覆ID'
          },
          answers: {
            type: 'array',
            description: '回答列表',
            items: {
              type: 'object',
              properties: {
                field: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string'
                    },
                    title: {
                      type: 'string'
                    }
                  }
                },
                type: {
                  type: 'string',
                  enum: ['text', 'boolean', 'choice', 'choices']
                },
                text: {
                  type: 'string'
                },
                boolean: {
                  type: 'boolean'
                },
                choice: {
                  type: 'object'
                },
                choices: {
                  type: 'object'
                }
              }
            }
          }
        }
      },
      SubmitResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: '回應訊息'
          }
        }
      },
      RecommendData: {
        type: 'object',
        properties: {
          item: {
            type: 'string',
            description: '九大項英文代碼',
            enum: ['digestive', 'joint', 'urinary', 'skin', 'emotion', 'weight', 'cardiovascular', 'eye', 'immune']
          },
          scores: {
            type: 'object',
            description: '各分數等級的推薦資料',
            additionalProperties: {
              type: 'object',
              properties: {
                products: {
                  type: 'array',
                  items: {
                    type: 'string'
                  }
                },
                note: {
                  type: 'string'
                },
                productInput: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                ingredients: {
                  type: 'string'
                },
                formula: {
                  type: 'string'
                }
              }
            }
          }
        }
      },
      RecommendResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean'
          },
          recommend: {
            $ref: '#/components/schemas/RecommendData'
          },
          recommends: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/RecommendData'
            }
          }
        }
      },
      TestResponse: {
        type: 'object',
        properties: {
          ok: {
            type: 'boolean',
            example: true
          },
          message: {
            type: 'string',
            example: 'Hello from API'
          }
        }
      },
      // 新增 get-score API 相關的 schema
      HealthScores: {
        type: 'object',
        properties: {
          腸胃: {
            type: 'number',
            description: '腸胃健康分數',
            example: 2.5
          },
          關節: {
            type: 'number',
            description: '關節健康分數',
            example: 1.5
          },
          泌尿: {
            type: 'number',
            description: '泌尿健康分數',
            example: 0
          },
          皮毛: {
            type: 'number',
            description: '皮毛健康分數',
            example: 1
          },
          情緒: {
            type: 'number',
            description: '情緒健康分數',
            example: 0.5
          },
          體重: {
            type: 'number',
            description: '體重管理分數',
            example: 2
          },
          心血管: {
            type: 'number',
            description: '心血管健康分數',
            example: 1
          },
          眼睛: {
            type: 'number',
            description: '眼睛健康分數',
            example: 0
          },
          免疫: {
            type: 'number',
            description: '免疫系統分數',
            example: 1.5
          }
        },
        required: ['腸胃', '關節', '泌尿', '皮毛', '情緒', '體重', '心血管', '眼睛', '免疫']
      },
      TopCategory: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            description: '健康項目名稱',
            example: '腸胃'
          },
          score: {
            type: 'number',
            description: '分數',
            example: 2.5
          }
        },
        required: ['category', 'score']
      },
      ScoreRawData: {
        type: 'object',
        properties: {
          response_id: {
            type: 'string',
            description: 'Typeform Response ID',
            example: 'ugplskupcpikn8xvlougpl1f2vlqonr1'
          },
          submitted_at: {
            type: 'string',
            format: 'date-time',
            description: '提交時間',
            example: '2025-07-25T03:50:29Z'
          },
          answers_count: {
            type: 'integer',
            description: '答案總數',
            example: 25
          }
        },
        required: ['response_id', 'submitted_at', 'answers_count']
      },
      GetScoreResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            description: '是否成功',
            example: true
          },
          responseId: {
            type: 'string',
            description: 'Typeform Response ID',
            example: 'ugplskupcpikn8xvlougpl1f2vlqonr1'
          },
          scores: {
            $ref: '#/components/schemas/HealthScores'
          },
          top_categories: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/TopCategory'
            },
            description: '最高分數的前三個健康項目',
            example: [
              { category: '腸胃', score: 2.5 },
              { category: '體重', score: 2 },
              { category: '關節', score: 1.5 }
            ]
          },
          total_questions_processed: {
            type: 'integer',
            description: '處理的問題總數',
            example: 25
          },
          message: {
            type: 'string',
            description: '回應訊息',
            example: '分數計算完成'
          },
          raw_data: {
            $ref: '#/components/schemas/ScoreRawData'
          }
        },
        required: ['success', 'responseId', 'scores', 'top_categories', 'total_questions_processed', 'message', 'raw_data']
      },
      // 新增 PetInfo schema
      PetInfo: {
        type: 'object',
        properties: {
          type: { type: 'string', description: '寵物類型', example: 'dog', enum: ['cat', 'dog'] },
          breed: { type: 'string', description: '寵物品種名稱', example: '英國古代牧羊犬' },
          details: {
            type: 'object',
            nullable: true,
            description: '寵物詳細資料',
            properties: {
              description: { type: 'string', description: '品種描述', example: '英國古代牧羊犬是一種大型犬種，擁有濃密的長毛...' },
              healthItems: {
                type: 'object',
                description: '健康項目說明',
                additionalProperties: { type: 'string' },
                example: {
                  '關節與肢體結構發展': '大型犬種需要注意關節健康...',
                  '皮毛與皮膚狀況': '長毛需要定期梳理...'
                }
              }
            }
          }
        },
        required: ['type', 'breed', 'details']
      },
      // 更新 GetResultResponse schema
      GetResultResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', description: '是否成功', example: true },
          session_id: { type: 'string', description: 'Typeform Session ID', example: 'ugplskupcpikn8xvlougpl1f2vlqonr1' },
          pet_info: { $ref: '#/components/schemas/PetInfo' },
          scores: { $ref: '#/components/schemas/HealthScores' },
          top_categories: {
            type: 'array',
            items: { $ref: '#/components/schemas/TopCategory' },
            description: '最高分數的前三個健康項目',
            example: [ { category: '腸胃', score: 2.5 }, { category: '體重', score: 2 }, { category: '關節', score: 1.5 } ]
          },
          recommendations: {
            type: 'object',
            description: '推薦商品資料',
            additionalProperties: { $ref: '#/components/schemas/RecommendationItem' },
            example: {
              '腸胃': {
                score: 2.5,
                targetScore: 3,
                data: {
                  products: ['PROD001', 'PROD002'],
                  note: '高關注',
                  description: '針對腸胃問題的專業配方...',
                  ingredients: '益生菌、消化酵素...',
                  formula: '腸胃保健配方'
                }
              }
            }
          },
          total_questions_processed: { type: 'integer', description: '處理的問題總數', example: 25 },
          message: { type: 'string', description: '回應訊息', example: '分數計算完成' },
          raw_data: { $ref: '#/components/schemas/ScoreRawData' }
        },
        required: ['success', 'session_id', 'pet_info', 'scores', 'top_categories', 'recommendations', 'total_questions_processed', 'message', 'raw_data']
      }
    }
  },
  security: [
    {
      bearerAuth: []
    },
    {
      cookieAuth: []
    }
  ]
};

const options = {
  definition: swaggerDefinition,
  apis: ['./src/app/api/**/route.js'], // 指定 API 路由文件路徑
};

export default options;
