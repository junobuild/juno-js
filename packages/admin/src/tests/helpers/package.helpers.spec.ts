import type {JunoPackageDependencies} from '@junobuild/config';
import {findJunoPackageDependency} from '../../helpers/package.helpers';

describe('findJunoPackageDependency', () => {
  it('should return the dependency if it exists', () => {
    const dependencies: JunoPackageDependencies = {
      'dependency-1': '1.0.0',
      'dependency-2': '2.0.0'
    };
    const result = findJunoPackageDependency({
      dependencyId: 'dependency-1',
      dependencies
    });
    expect(result).toEqual(['dependency-1', '1.0.0']);
  });

  it('should return undefined if the dependency does not exist', () => {
    const dependencies: JunoPackageDependencies = {
      'dependency-1': '1.0.0',
      'dependency-2': '2.0.0'
    };
    const result = findJunoPackageDependency({
      dependencyId: 'dependency-3',
      dependencies
    });
    expect(result).toBeUndefined();
  });

  it('should return undefined if dependencies are undefined', () => {
    const result = findJunoPackageDependency({
      dependencyId: 'dependency-1',
      dependencies: undefined
    });
    expect(result).toBeUndefined();
  });

  it('should return undefined if dependencies are an empty object', () => {
    const dependencies: JunoPackageDependencies = {};
    const result = findJunoPackageDependency({
      dependencyId: 'dependency-1',
      dependencies
    });
    expect(result).toBeUndefined();
  });
});
