import {join} from 'node:path';
import {mockMethodSignatures} from '../mocks/method-signatures.mock';
import {collectMethodSignatures} from './inspector.services';

describe('inspector-services', () => {
  it('should collect method signatures if did file has been formatted with prettier', async () => {
    const result = await collectMethodSignatures({
      inputFile: join(
        process.cwd(),
        'packages',
        'did-tools',
        'src',
        'mocks',
        'satellite.formatted.did.mock.ts'
      )
    });

    expect(result).toEqual(mockMethodSignatures);
  });

  it('should collect method signatures if did file has just been generated with didc', async () => {
    const result = await collectMethodSignatures({
      inputFile: join(
        process.cwd(),
        'packages',
        'did-tools',
        'src',
        'mocks',
        'satellite.raw.did.mock.ts'
      )
    });

    expect(result).toEqual(mockMethodSignatures);
  });
});
