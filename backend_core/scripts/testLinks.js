
/**
 * Noor Official V3 - API Connectivity Audit
 * Verifies that all modular plugins are correctly listening.
 */

const http = require('http');

const CONFIG = {
  host: 'localhost',
  port: 5000,
  timeout: 5000
};

const routesToTest = [
  { name: 'Public SEO Node', path: '/api/system/public/seo', method: 'GET', expect: [200] },
  { name: 'Auth Login Node', path: '/api/auth/login', method: 'POST', expect: [400, 401] },
  { name: 'Finance Deposit Node', path: '/api/finance/deposit', method: 'POST', expect: [401] },
  { name: 'Work Tasks Node', path: '/api/work/tasks', method: 'GET', expect: [401] },
  { name: 'System Settings Node', path: '/api/system/settings', method: 'GET', expect: [200, 401] }
];

function probeRoute(route) {
  return new Promise((resolve) => {
    const options = {
      hostname: CONFIG.host,
      port: CONFIG.port,
      path: route.path,
      method: route.method,
      headers: { 'Content-Type': 'application/json' }
    };

    const req = http.request(options, (res) => {
      const isAlive = route.expect.includes(res.statusCode);
      resolve({
        name: route.name,
        status: res.statusCode,
        result: isAlive ? '✅ ALIVE' : '❌ DEAD'
      });
    });

    req.on('error', () => {
      resolve({
        name: route.name,
        status: 'OFFLINE',
        result: '❌ CRITICAL'
      });
    });

    req.setTimeout(CONFIG.timeout, () => {
      req.destroy();
      resolve({ name: route.name, status: 'TIMEOUT', result: '❌ DEAD' });
    });

    if (route.method === 'POST') req.write(JSON.stringify({}));
    req.end();
  });
}

async function runAudit() {
  console.log('\n🔍 NOOR CORE V3: LINK CONNECTIVITY AUDIT');
  console.log('------------------------------------------------------------');
  console.log('ROUTE NAME           | STATUS  | RESULT');
  console.log('------------------------------------------------------------');

  for (const route of routesToTest) {
    const report = await probeRoute(route);
    const namePadded = report.name.padEnd(20);
    const statusPadded = report.status.toString().padEnd(7);
    console.log(`${namePadded} | ${statusPadded} | ${report.result}`);
  }

  console.log('------------------------------------------------------------\n');
}

runAudit();
