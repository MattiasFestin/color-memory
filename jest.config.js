export default {
    globals: {
        "ts-jest": {
            tsconfig: "tsconfig.json"
        }
    },
    moduleFileExtensions: [
        "ts",
        "js"
    ],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
        "^.+\\.svelte$": ["svelte-jester", { preprocess: true }],
    },
    testMatch: [
        "**/*.test.(ts|svelte)"
    ],
    testEnvironment: "node"
};