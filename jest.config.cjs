module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setupTests.js'],
  testMatch: ['<rootDir>/src/**/*.test.jsx', '<rootDir>/src/**/*.test.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/src/test/styleMock.js',
    '\\.(png|jpg|jpeg|gif|svg|webp|ico)$': '<rootDir>/src/test/fileMock.js',
  },
}
