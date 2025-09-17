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
