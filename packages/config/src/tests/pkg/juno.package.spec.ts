import {JunoPackageDependenciesSchema, JunoPackageSchema} from '../../pkg/juno.package';

describe('juno.package', () => {
  describe('JunoPackageDependenciesSchema', () => {
    it('accepts a valid dependencies object', () => {
      const result = JunoPackageDependenciesSchema.safeParse({
        foo: '1.0.0',
        bar: '^2.3.4'
      });

      expect(result.success).toBe(true);
    });

    it('rejects a non-string value', () => {
      const result = JunoPackageDependenciesSchema.safeParse({
        foo: 123
      });

      expect(result.success).toBe(false);
    });
  });

  describe('JunoPackageSchema', () => {
    it('accepts a minimal valid package', () => {
      const result = JunoPackageSchema.safeParse({
        name: 'my-package',
        version: '0.1.0'
      });

      expect(result.success).toBe(true);
    });

    it('accepts a full valid package with dependencies', () => {
      const result = JunoPackageSchema.safeParse({
        name: 'my-package',
        version: '1.2.3',
        dependencies: {
          lodash: '^4.17.21',
          react: '^18.0.0'
        }
      });

      expect(result.success).toBe(true);
    });

    it('rejects missing name', () => {
      const result = JunoPackageSchema.safeParse({
        version: '1.0.0'
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['name']);
      }
    });

    it('rejects dependencies with non-string versions', () => {
      const result = JunoPackageSchema.safeParse({
        name: 'my-package',
        version: '1.0.0',
        dependencies: {
          someDep: 42
        }
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['dependencies', 'someDep']);
      }
    });
  });
});
