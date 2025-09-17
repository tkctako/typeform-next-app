// src/app/api/swagger.json/route.js
import swaggerJSDoc from 'swagger-jsdoc';
import options from '@/lib/swagger';

export async function GET() {
  try {
    const swaggerSpec = swaggerJSDoc(options);
    return Response.json(swaggerSpec);
  } catch (error) {
    console.error('Error generating Swagger spec:', error);
    return Response.json(
      { error: 'Failed to generate API documentation' },
      { status: 500 }
    );
  }
}
