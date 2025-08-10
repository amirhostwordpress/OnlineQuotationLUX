import React, { useState } from 'react';
import { TestTube } from 'lucide-react';

const ApiTest: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  const API_BASE = 'http://localhost:5000/api';

  const runTests = async () => {
    setIsTesting(true);
    setTestResults([]);
    
    const tests = [
      {
        name: 'Server Health Check',
        url: `${API_BASE.replace('/api', '')}`,
        method: 'GET'
      },
      {
        name: 'API Health Check',
        url: `${API_BASE.replace('/api', '')}/health`,
        method: 'GET'
      },
      {
        name: 'Users API Test',
        url: `${API_BASE}/users/test`,
        method: 'GET'
      },
      {
        name: 'Database Connection Test',
        url: `${API_BASE}/users/db-test`,
        method: 'GET'
      },
      {
        name: 'Users List',
        url: `${API_BASE}/users`,
        method: 'GET'
      }
    ];

    for (const test of tests) {
      try {
        console.log(`Testing: ${test.name}`);
        const response = await fetch(test.url, { method: test.method });
        const status = response.status;
        const data = await response.text();
        
        const result = `${test.name}: ${status} - ${data.substring(0, 100)}`;
        setTestResults(prev => [...prev, result]);
        console.log(result);
      } catch (error) {
        const result = `${test.name}: ERROR - ${error instanceof Error ? error.message : 'Unknown error'}`;
        setTestResults(prev => [...prev, result]);
        console.error(result);
      }
    }
    
    setIsTesting(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">API Connectivity Test</h2>
        <button
          onClick={runTests}
          disabled={isTesting}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          <TestTube size={16} />
          <span>{isTesting ? 'Testing...' : 'Run Tests'}</span>
        </button>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm text-gray-600">API Base URL: {API_BASE}</p>
        
        {testResults.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold text-gray-900 mb-2">Test Results:</h3>
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div key={index} className="p-2 bg-gray-50 rounded text-sm font-mono">
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiTest;
