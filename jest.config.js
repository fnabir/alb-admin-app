/** @type {import('jest').Config} */
const config = {
  projects: [
    {
      displayName: 'app',
      preset: 'ts-jest',
      testEnvironment: 'node',
      roots: ['<rootDir>/packages/app/src'],
      testMatch: ['**/*.test.ts'],
      transform: {
        '^.+\\.tsx?$': [
          'ts-jest',
          {
            tsconfig: '<rootDir>/packages/app/tsconfig.jest.json',
          },
        ],
      },
    },
    {
      displayName: 'ui',
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      roots: ['<rootDir>/packages/ui/src'],
      testMatch: ['**/*.test.tsx', '**/*.test.ts'],
      transform: {
        '^.+\\.tsx?$': [
          'ts-jest',
          {
            tsconfig: '<rootDir>/packages/ui/tsconfig.jest.json',
          },
        ],
      },
    },
    {
      displayName: 'web',
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      roots: ['<rootDir>/apps/web/src'],
      testMatch: ['**/*.test.tsx', '**/*.test.ts'],
      transform: {
        '^.+\\.tsx?$': [
          'ts-jest',
          {
            tsconfig: '<rootDir>/apps/web/tsconfig.jest.json',
          },
        ],
      },
    },
    {
      displayName: 'mobile',
      preset: 'ts-jest',
      testEnvironment: 'node',
      roots: ['<rootDir>/apps/mobile/src'],
      testMatch: ['**/*.test.tsx', '**/*.test.ts'],
      transform: {
        '^.+\\.tsx?$': [
          'ts-jest',
          {
            tsconfig: '<rootDir>/apps/mobile/tsconfig.jest.json',
          },
        ],
      },
    },
  ],
};

module.exports = config;
