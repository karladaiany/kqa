#!/usr/bin/env node

import fs from 'fs';
import semver from 'semver';

/**
 * Script para verificar e validar informações de versão
 */

function getPackageVersion() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    return packageJson.version;
  } catch (error) {
    console.error('❌ Erro ao ler package.json:', error.message);
    process.exit(1);
  }
}

function validateVersion(version) {
  if (!semver.valid(version)) {
    console.error(`❌ Versão inválida: ${version}`);
    console.error('💡 Use o formato Semantic Versioning (ex: 1.2.3)');
    process.exit(1);
  }
  return true;
}

function checkVersionInfo() {
  const currentVersion = getPackageVersion();

  console.log('🔍 Verificação de Versão do KQA');
  console.log('================================');
  console.log(`📦 Versão atual: ${currentVersion}`);

  validateVersion(currentVersion);

  const parsed = semver.parse(currentVersion);
  console.log(`🔢 MAJOR: ${parsed.major}`);
  console.log(`🔢 MINOR: ${parsed.minor}`);
  console.log(`🔢 PATCH: ${parsed.patch}`);

  if (parsed.prerelease.length > 0) {
    console.log(`🧪 Pre-release: ${parsed.prerelease.join('.')}`);
  }

  console.log('\n📋 Próximas versões possíveis:');
  console.log(
    `   PATCH: ${semver.inc(currentVersion, 'patch')} (correções de bugs)`
  );
  console.log(
    `   MINOR: ${semver.inc(currentVersion, 'minor')} (novas funcionalidades)`
  );
  console.log(
    `   MAJOR: ${semver.inc(currentVersion, 'major')} (mudanças incompatíveis)`
  );

  console.log('\n✅ Versão válida e conforme Semantic Versioning!');
}

checkVersionInfo();
