const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const projectRoot = __dirname; // C:\dev_git\alb-admin-app\apps\mobile
const monorepoRoot = path.resolve(projectRoot, '../..'); // C:\dev_git\alb-admin-app

const config = getDefaultConfig(projectRoot);

// Watch monorepo root so Metro can see shared packages
config.watchFolders = [monorepoRoot];

// Resolve modules from both mobile and monorepo node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// pnpm uses symlinks — this prevents resolution failures
config.resolver.unstable_enablePackageExports = false;

module.exports = withNativeWind(config, { input: './global.css' });
