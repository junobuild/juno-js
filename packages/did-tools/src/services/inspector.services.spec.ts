import {join} from 'node:path';
import {mockImports, mockMethodSignatures} from '../mocks/method-signatures.mock';
import {collectApi} from './inspector.services';

describe('inspector-services', () => {
  it('should collect method signatures if did file has been formatted with prettier', async () => {
    const {methods} = await collectApi({
      inputFile: join(
        process.cwd(),
        'packages',
        'did-tools',
        'src',
        'mocks',
        'satellite.formatted.did.mock.ts'
      )
    });

    expect(methods).toEqual(mockMethodSignatures);
  });

  it('should collect method signatures if did file has just been generated with didc', async () => {
    const {methods} = await collectApi({
      inputFile: join(
        process.cwd(),
        'packages',
        'did-tools',
        'src',
        'mocks',
        'satellite.raw.did.mock.ts'
      )
    });

    expect(methods).toEqual(mockMethodSignatures);
  });

  it('should collect imports if did file has been formatted with prettier', async () => {
    const {imports} = await collectApi({
      inputFile: join(
        process.cwd(),
        'packages',
        'did-tools',
        'src',
        'mocks',
        'satellite.formatted.did.mock.ts'
      )
    });

    expect(imports).toEqual(mockImports);
  });

  it('should collect imports if did file has just been generated with didc', async () => {
    const {imports} = await collectApi({
      inputFile: join(
        process.cwd(),
        'packages',
        'did-tools',
        'src',
        'mocks',
        'satellite.raw.did.mock.ts'
      )
    });

    expect(imports).toEqual(mockImports);
  });
});
