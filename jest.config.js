module.exports = {
    // Корневая директория, где Jest должен искать файлы
    rootDir: '.',

    // Пути, где Jest будет искать тестовые файлы
    testMatch: ['<rootDir>/tests/**/*.test.js'],

    // Игнорируемые пути
    testPathIgnorePatterns: ['/node_modules/'],

    // Настройка окружения (jsdom для эмуляции браузерного окружения)
    testEnvironment: 'jsdom',

    // Файлы, которые нужно преобразовать перед запуском
    transform: {
        '^.+\\.js$': 'babel-jest',
    },

    // Модули, которые нужно преобразовать в CommonJS
    transformIgnorePatterns: [
        '/node_modules/',
        '\\.pnp\\.[^\\/]+$'
    ],

    // Настройка покрытия кода
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],

    // Настройка для работы с модулями ES6
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js'
    },

    // Файлы для запуска перед тестами
    // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};