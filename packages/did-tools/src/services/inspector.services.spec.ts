import {join} from 'node:path';
import {mockMethodSignatures} from '../mocks/method-signatures.mock';
import {collectMethodSignatures} from './inspector.services';

describe('inspector-services', () => {
  it('should collect method signatures', () => {
    const result = collectMethodSignatures({
      inputFile: join(
        process.cwd(),
        'packages',
        'did-tools',
        'src',
        'mocks',
        'satellite.did.mock.ts'
      )
    });

    expect(result).toEqual(mockMethodSignatures);
  });
});
