
/**
 * Noor Official V3 - API Health & Integrity Check
 * Runs automated requests against core nodes to verify connectivity.
 */

const http = require('http');

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5000';

const tests = [
  {
    name: 'Auth Node (Login Probe)',
    path: '/api/auth/login',
    method: 'POST',
    body: JSON.stringify({ email: 'test@noor.com', password: '123' }),
    expectedStatuses: [401, 200] // Either is fine, just NOT 404
  },
  {
    name: 'Finance Node (Ledger Probe)',
    path: '/api/finance/history',
    method: 'GET',
    expectedStatuses: [401] // Should be blocked, NOT 404
  },
  {
    name: 'System Node (SEO Probe)',
    path: '/api/system/public/seo',
    method: 'GET',
    expectedStatuses: [200]
  }
];

async function runCheck(test) {
  return new Promise((resolve) => {
    const options = {
      method: test.method,
      headers: { 'Content-Type': 'application/json' }
    };

    const req = http.request(`${SERVER_URL}${test.path}`, options, (res) => {
      const isHealthy = test.expectedStatuses.includes(res.statusCode);
      if (isHealthy) {
        console.log(`✅ [${test.name}]: Connected (Status: ${res.statusCode})`);
        resolve(true);
      } else {
        console.log(`❌ [${test.name}]: FAILURE (Status: ${res.statusCode} - Expected: ${test.expectedStatuses.join('/')})`);
        resolve(false);
      }
    });

    req.on('error', (e) => {
      console.log(`❌ [${test.name}]: Node Offline (${e.message})`);
      resolve(false);
    });

    if (test.body) req.write(test.body);
    req.end();
  });
}

async function startAudit() {
  console.log('🔍 Starting Noor Core V3 Financial & Security Audit...\n');
  let failures = 0;

  for (const test of tests) {
    const success = await runCheck(test);
    if (!success) failures++;
  }

  console.log('\n---------------------------------------');
  if (failures === 0) {
    console.log('🌟 ALL NODES OPERATIONAL - SYSTEM IS GREEN');
  } else {
    console.log(`⚠️  AUDIT COMPLETE: ${failures} Node Failures Detected.`);
  }
  console.log('---------------------------------------\n');
}

startAudit();
