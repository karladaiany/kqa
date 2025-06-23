#!/usr/bin/env node

import fs from 'fs';
import { execSync } from 'child_process';

/**
 * Script para verificar e documentar versão durante deploy
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

function getGitInfo() {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', {
      encoding: 'utf8',
    }).trim();
    const commit = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    const shortCommit = execSync('git rev-parse --short HEAD', {
      encoding: 'utf8',
    }).trim();

    return { branch, commit, shortCommit };
  } catch (error) {
    console.warn('⚠️ Informações do Git não disponíveis:', error.message);
    return { branch: 'unknown', commit: 'unknown', shortCommit: 'unknown' };
  }
}

function generateVersionInfo() {
  const version = getPackageVersion();
  const gitInfo = getGitInfo();
  const timestamp = new Date().toISOString();

  const versionInfo = {
    version,
    timestamp,
    git: gitInfo,
    environment: process.env.NODE_ENV || 'development',
    buildNumber:
      process.env.VERCEL_BUILD_ID || process.env.BUILD_NUMBER || 'local',
  };

  // Criar arquivo de versão para runtime
  fs.writeFileSync(
    './public/version.json',
    JSON.stringify(versionInfo, null, 2)
  );

  console.log('🚀 Informações de Deploy');
  console.log('========================');
  console.log(`📦 Versão: ${version}`);
  console.log(`🌿 Branch: ${gitInfo.branch}`);
  console.log(`📝 Commit: ${gitInfo.shortCommit}`);
  console.log(`⏰ Timestamp: ${timestamp}`);
  console.log(`🌍 Environment: ${versionInfo.environment}`);
  console.log(`🔨 Build: ${versionInfo.buildNumber}`);
  console.log('\n✅ Arquivo version.json criado em public/');

  return versionInfo;
}

generateVersionInfo();
