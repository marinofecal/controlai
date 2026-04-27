#!/usr/bin/env node

/**
 * TEST SCRIPT para ControlAI Hybrid AI
 * 
 * Uso:
 *   node test-hybrid.js
 * 
 * Valida:
 * - Conexión a Groq API
 * - Conexión a OpenAI API
 * - Análisis de casos simples y complejos
 * - Formato de respuesta JSON
 */

import { analyzeCompliance, analyzeBatch, validateAnalysisResponse } from './lib/ai-hybrid.js';

// Colores para output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(color, label, message) {
  console.log(`${colors[color]}[${label}]${colors.reset} ${message}`);
}

// Casos de prueba
const testCases = [
  {
    name: 'GDPR Simple (Bajo riesgo)',
    data: {
      case_type: 'GDPR_COMPLIANCE',
      industry: 'Technology',
      description:
        'Nuestra empresa es un startup de software que procesa datos de usuarios europeos. ' +
        'Tenemos un formulario de registro donde pedimos nombre, email y ubicación. ' +
        'Los datos se almacenan en una base de datos en AWS EU-West-1. ' +
        '¿Estamos en compliance con GDPR?',
      jurisdictions: ['EU'],
    },
  },
  {
    name: 'Financial Crime Complex (Alto riesgo)',
    data: {
      case_type: 'FINANCIAL_CRIME',
      industry: 'Banking',
      description:
        'Un cliente corporativo grande quiere transferir EUR 5 millones a una cuenta en un país de alto riesgo. ' +
        'El cliente no es nuevo pero sus patrones de transferencia han cambiado radicalmente en los últimos días. ' +
        'Nuestro sistema de AML ha flagged varias transacciones sospechosas. ' +
        'Necesitamos evaluar compliance con AML-CFT, FATF recommendations, y regulaciones nacionales de anti-lavado. ' +
        'Qué acciones debe tomar nuestro equipo de compliance inmediatamente?',
      jurisdictions: ['EU', 'Spain'],
      additional_context: 'Cliente nuevo hace 6 meses, origen de fondos no completamente documentado',
    },
  },
  {
    name: 'Data Breach Notification (Alto riesgo)',
    data: {
      case_type: 'DATA_BREACH',
      industry: 'Healthcare',
      description:
        'Hemos descubierto una brecha de seguridad en nuestro sistema de gestión de pacientes. ' +
        'Aproximadamente 50,000 registros de pacientes fueron expuestos, incluyendo nombres, números de identidad, ' +
        'y números de afiliación de seguros. ' +
        'La brecha fue detectada hace 2 días pero probablemente ocurrió hace 1 semana. ' +
        'Necesitamos saber qué regulaciones se aplican, qué notificaciones son obligatorias, ' +
        'y qué penalizaciones podríamos enfrentar.',
      jurisdictions: ['EU', 'Spain'],
    },
  },
];

async function runTest() {
  log('blue', 'START', 'ControlAI Hybrid AI Test Suite\n');

  // Verificar variables de entorno
  log('cyan', 'CHECK', 'Validando variables de entorno...');
  if (!process.env.GROQ_API_KEY) {
    log('red', 'ERROR', 'GROQ_API_KEY no está definida en .env.local');
    process.exit(1);
  }
  if (!process.env.OPENAI_API_KEY) {
    log('red', 'ERROR', 'OPENAI_API_KEY no está definida en .env.local');
    process.exit(1);
  }
  log('green', 'OK', 'Variables de entorno encontradas\n');

  let passedTests = 0;
  let failedTests = 0;

  // Test 1: Casos individuales
  log('blue', 'TEST', 'Ejecutando 3 casos de prueba individuales...\n');

  for (const testCase of testCases) {
    try {
      log('cyan', 'CASE', `${testCase.name}`);
      console.time(`  ⏱ Tiempo`);

      const result = await analyzeCompliance(testCase.data);

      console.timeEnd(`  ⏱ Tiempo`);

      // Validar respuesta
      validateAnalysisResponse(result);

      log('green', 'PASS', `${testCase.name}`);
      console.log(`  📊 Risk Score: ${result.risk_score}/100`);
      console.log(`  ✅ Compliance: ${result.compliance_probability}%`);
      console.log(`  🤖 AI Provider: ${result.metadata.ai_provider}`);
      console.log(`  📋 Gaps Found: ${result.identified_gaps.length}`);
      console.log(`  🎯 Actions: ${result.action_plan.length}\n`);

      passedTests++;
    } catch (error) {
      log('red', 'FAIL', `${testCase.name}`);
      console.log(`  ❌ Error: ${error.message}\n`);
      failedTests++;
    }
  }

  // Test 2: Batch analysis
  log('blue', 'TEST', 'Ejecutando análisis batch (múltiples casos)...\n');
  try {
    log('cyan', 'BATCH', 'Analizando 2 casos en paralelo...');
    console.time('  ⏱ Tiempo batch');

    const batchResult = await analyzeBatch(testCases.slice(0, 2).map(t => t.data));

    console.timeEnd('  ⏱ Tiempo batch');

    log('green', 'PASS', 'Batch analysis');
    console.log(`  📦 Total cases: ${batchResult.total_cases}`);
    console.log(`  ✅ Analyzed: ${batchResult.analyzed}`);
    console.log(`  🔴 High Risk: ${batchResult.summary.high_risk}`);
    console.log(`  🟡 Medium Risk: ${batchResult.summary.medium_risk}`);
    console.log(`  🟢 Low Risk: ${batchResult.summary.low_risk}\n`);

    passedTests++;
  } catch (error) {
    log('red', 'FAIL', 'Batch analysis');
    console.log(`  ❌ Error: ${error.message}\n`);
    failedTests++;
  }

  // Test 3: Error handling
  log('blue', 'TEST', 'Validando manejo de errores...\n');
  try {
    log('cyan', 'ERROR', 'Intentando análisis con input inválido...');
    await analyzeCompliance({
      description: 'Muy corto',
    });
    log('red', 'FAIL', 'Error handling - debería haber lanzado excepción');
    failedTests++;
  } catch (error) {
    log('green', 'PASS', 'Error handling');
    console.log(`  ✅ Error capturado correctamente: ${error.message}\n`);
    passedTests++;
  }

  // Resumen final
  log('blue', 'SUMMARY', 'Resultados del test');
  console.log(`  ✅ Passed: ${passedTests}`);
  console.log(`  ❌ Failed: ${failedTests}`);
  console.log(`  📊 Total: ${passedTests + failedTests}\n`);

  if (failedTests === 0) {
    log('green', 'SUCCESS', '¡Todos los tests pasaron! 🎉\n');
    process.exit(0);
  } else {
    log('red', 'FAILED', `${failedTests} test(s) fallaron`);
    process.exit(1);
  }
}

// Ejecutar
runTest().catch(error => {
  log('red', 'FATAL', error.message);
  process.exit(1);
});
