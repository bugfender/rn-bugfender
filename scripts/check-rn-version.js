#!/usr/bin/env node

/**
 * Script to check React Native version compatibility
 * Compares the current React Native version in devDependencies with the latest available version
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const packageJsonPath = path.join(rootDir, 'package.json');

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const currentRNVersion = packageJson.devDependencies['react-native'];

if (!currentRNVersion) {
  console.error('❌ React Native version not found in devDependencies');
  process.exit(1);
}

// Extract version number (remove ^, ~, etc.)
const currentVersion = currentRNVersion.replace(/^[\^~]/, '');

console.log('📱 React Native Version Check\n');
console.log(`Current version in devDependencies: ${currentRNVersion}`);
console.log(`Parsed version: ${currentVersion}\n`);

// Get latest version from npm
try {
  console.log('🔍 Checking latest version on npm...');
  const latestVersion = execSync('npm view react-native version', {
    encoding: 'utf8',
  }).trim();
  console.log(`Latest available version: ${latestVersion}\n`);

  // Compare versions
  const currentParts = currentVersion.split('.').map(Number);
  const latestParts = latestVersion.split('.').map(Number);

  let needsUpgrade = false;
  let upgradeType = '';

  // Compare major, minor, patch
  if (latestParts[0] > currentParts[0]) {
    needsUpgrade = true;
    upgradeType = 'MAJOR';
  } else if (
    latestParts[0] === currentParts[0] &&
    latestParts[1] > currentParts[1]
  ) {
    needsUpgrade = true;
    upgradeType = 'MINOR';
  } else if (
    latestParts[0] === currentParts[0] &&
    latestParts[1] === currentParts[1] &&
    latestParts[2] > currentParts[2]
  ) {
    needsUpgrade = true;
    upgradeType = 'PATCH';
  }

  if (needsUpgrade) {
    console.log(`⚠️  Upgrade available: ${upgradeType} version update`);
    console.log(`   Current: ${currentVersion}`);
    console.log(`   Latest:  ${latestVersion}\n`);
    console.log('💡 To upgrade, you can:');
    console.log('   1. Run: npx react-native upgrade');
    console.log(
      '   2. Or manually update package.json and follow the upgrade guide'
    );
    console.log(
      '   3. Check breaking changes: https://react-native.dev/docs/upgrading\n'
    );
    console.log('📚 Resources:');
    console.log(
      '   - Upgrade Helper: https://react-native-community.github.io/upgrade-helper/'
    );
    console.log(
      '   - Release Notes: https://github.com/facebook/react-native/releases'
    );
    process.exit(1);
  } else {
    console.log('✅ You are using the latest React Native version!\n');
    process.exit(0);
  }
} catch (error) {
  console.error('❌ Error checking npm registry:', error.message);
  console.log('\n💡 You can manually check:');
  console.log('   - npm view react-native versions');
  console.log('   - https://github.com/facebook/react-native/releases');
  process.exit(1);
}
