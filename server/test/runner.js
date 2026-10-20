import assert from 'node:assert';
import request from 'supertest';
import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { calculateCO2e } from '../src/services/carbonService.js';

let passed = 0;
let failed = 0;

const runTest = async (title, fn) => {
  try {
    process.stdout.write(`  ⏳ ${title}... `);
    await fn();
    console.log(`\x1b[32m✔ PASS\x1b[0m`);
    passed++;
  } catch (err) {
    console.log(`\x1b[31m✖ FAIL\x1b[0m`);
    console.error(`     Error: ${err.message}`);
    failed++;
  }
};

async function executeTests() {
  console.log('\n=============================================');
  console.log('🧪 Running TerraTrack Automated Test Suite');
  console.log('=============================================\n');

  try {
    await connectDB();

    console.log('\n--- 1. GHG Protocol Carbon Engine Unit Tests ---');

    await runTest('Calculates Electricity Scope 2 emissions correctly (1000 kWh = 385 kg CO2e)', () => {
      const res = calculateCO2e('electricity', 1000, 'kWh');
      assert.strictEqual(res.estimatedCO2e, 385);
      assert.strictEqual(res.scope, 'Scope 2');
      assert.strictEqual(res.standardUnit, 'kWh');
    });

    await runTest('Calculates Diesel Scope 1 emissions correctly (100 L = 268 kg CO2e)', () => {
      const res = calculateCO2e('fuel_diesel', 100, 'L');
      assert.strictEqual(res.estimatedCO2e, 268);
      assert.strictEqual(res.scope, 'Scope 1');
    });

    await runTest('Calculates Natural Gas emissions correctly (50 m3 = 101.5 kg CO2e)', () => {
      const res = calculateCO2e('natural_gas', 50, 'm3');
      assert.strictEqual(res.estimatedCO2e, 101.5);
      assert.strictEqual(res.scope, 'Scope 1');
    });

    await runTest('Converts imperial gallon to liter correctly for diesel', () => {
      const res = calculateCO2e('fuel_diesel', 10, 'gal');
      // 10 gal * 3.78541 L/gal * 2.68 kg/L = 101.45 kg CO2e
      assert.ok(res.estimatedCO2e > 100 && res.estimatedCO2e < 103);
    });

    console.log('\n--- 2. REST API & Authentication Integration Tests ---');

    await runTest('Health Check returns 200 and OK status', async () => {
      const res = await request(app).get('/api/health');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.status, 'ok');
    });

    let demoToken = '';
    await runTest('Instant Demo Login succeeds and returns JWT token & user', async () => {
      const res = await request(app).post('/api/auth/demo-login');
      assert.strictEqual(res.status, 200);
      assert.ok(res.body.token);
      assert.strictEqual(res.body.user.email, 'sustainability.demo@TerraTrack.io');
      demoToken = res.body.token;
    });

    await runTest('Protected /api/auth/me returns authenticated user', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${demoToken}`);
      assert.strictEqual(res.status, 200);
      assert.ok(res.body.user);
    });

    console.log('\n--- 3. Resource Logging & Emission Aggregation Tests ---');

    let createdLogId = '';
    await runTest('Creates a new resource log and calculates CO2e automatically', async () => {
      const res = await request(app)
        .post('/api/resources')
        .set('Authorization', `Bearer ${demoToken}`)
        .send({
          resourceType: 'electricity',
          quantity: 2000,
          unit: 'kWh',
          cost: 320,
          periodStart: new Date().toISOString(),
          periodEnd: new Date().toISOString(),
          location: 'Test Substation',
          notes: 'Integration test log',
        });
      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.log.estimatedCO2e, 770);
      assert.strictEqual(res.body.log.scope, 'Scope 2');
      createdLogId = res.body.log._id;
    });

    await runTest('Retrieves emission summary with Scope breakdown and intensity', async () => {
      const res = await request(app)
        .get('/api/resources/summary')
        .set('Authorization', `Bearer ${demoToken}`);
      assert.strictEqual(res.status, 200);
      assert.ok(res.body.summary.totalCO2eKg > 0);
      assert.ok(res.body.summary.scope2Kg > 0);
      assert.ok(res.body.summary.intensity);
    });

    console.log('\n--- 4. AI Advisor, Goals & Reporting Tests ---');

    await runTest('AI Advisor returns actionable recommendations', async () => {
      const res = await request(app)
        .get('/api/advisor/recommendations')
        .set('Authorization', `Bearer ${demoToken}`);
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.body.data.recommendations));
      assert.ok(res.body.data.recommendations.length > 0);
      const first = res.body.data.recommendations[0];
      assert.ok(first.title);
      assert.ok(first.observation);
      assert.ok(first.recommendation);
      assert.ok(first.priority);
    });

    await runTest('CSV Export downloads valid comma-separated text', async () => {
      const res = await request(app)
        .get('/api/reports/export-csv')
        .set('Authorization', `Bearer ${demoToken}`);
      assert.strictEqual(res.status, 200);
      assert.ok(res.text.includes('Log ID,Resource Type,Scope'));
    });

  } finally {
    await disconnectDB();
  }

  console.log('\n=============================================');
  console.log(`Results: \x1b[32m${passed} Passed\x1b[0m, \x1b[${failed > 0 ? '31' : '32'}m${failed} Failed\x1b[0m`);
  console.log('=============================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

executeTests();
