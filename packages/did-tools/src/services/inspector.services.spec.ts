import {join} from 'node:path';
import {collectMethodSignatures} from './inspector.services';

describe('inspector-services', () => {
  it('should collect method signatures', () => {
    const result = collectMethodSignatures({
      inputFile: join(process.cwd(), 'packages', 'did-tools', 'src', 'mocks', 'satellite.mock.ts')
    });

    expect(result).toEqual([
      {name: 'build_version', paramType: [], returnType: 'string'},
      {
        name: 'world',
        paramType: ['Hello', 'string'],
        returnType: 'string'
      },
      {name: 'yolo', paramType: ['Hello'], returnType: 'string'}
    ]);
  });
});
