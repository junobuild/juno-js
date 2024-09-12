import { defineWorkspace } from "vitest/config";

export default defineWorkspace(['packages/**/*.spec.ts',{
    test: {
        globals: true
    },
}]);