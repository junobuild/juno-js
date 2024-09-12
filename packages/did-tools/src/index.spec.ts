import {join} from 'node:path';
import {generate} from './index';

describe("did-tools", () => {
    it('should generate service for TypeScript', () => {
        generate({
            inputFile: join(process.cwd(), 'packages', 'did-tools', 'src', 'mocks', 'satellite.mock.ts'),
            outputLanguage: 'ts',
            outputFile: ''
        });
    });
})
