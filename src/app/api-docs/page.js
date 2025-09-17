// src/app/api-docs/page.js
'use client';

import { useState, useEffect } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function ApiDocs() {
  const [spec, setSpec] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/swagger.json')
      .then(response => response.json())
      .then(data => {
        setSpec(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to load API spec:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">載入 API 文檔中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            API 文檔
          </h1>
          <p className="text-lg text-gray-600">
            Typeform Next App API 完整文檔
          </p>
        </div>
        {spec && (
          <div className="border border-gray-200 rounded-lg shadow-sm">
            <SwaggerUI 
              spec={spec}
              docExpansion="list"
              defaultModelsExpandDepth={2}
              defaultModelExpandDepth={2}
            />
          </div>
        )}
      </div>
    </div>
  );
}
