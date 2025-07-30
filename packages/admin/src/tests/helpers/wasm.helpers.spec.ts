import {JUNO_PACKAGE_SATELLITE_ID} from '@junobuild/config';
import {extractBuildType, readCustomSectionJunoPackage} from '../../helpers/wasm.helpers';

const encodeTextSection = (str: string): Uint8Array => new TextEncoder().encode(str);

const mockWasmWithCustomSection = (sectionName: string, content: string): WebAssembly.Module => {
  vi.spyOn(WebAssembly, 'compile').mockResolvedValue({} as WebAssembly.Module);
  // @ts-ignore
  vi.spyOn(WebAssembly.Module, 'customSections').mockImplementation((_, name) => {
    return name === sectionName ? [encodeTextSection(content)] : [];
  });
  return {} as WebAssembly.Module;
};

describe('wasm.helpers', () => {
  describe('extractBuildType', () => {
    it('returns "stock" when junoPackage name matches JUNO_PACKAGE_SATELLITE_ID', async () => {
      const result = await extractBuildType({
        junoPackage: {
          name: JUNO_PACKAGE_SATELLITE_ID,
          version: '0.0.3',
          dependencies: {}
        },
        wasm: new Uint8Array()
      });

      expect(result).toBe('stock');
    });

    it('returns "extended" when dependency includes JUNO_PACKAGE_SATELLITE_ID', async () => {
      const result = await extractBuildType({
        junoPackage: {
          name: 'custom-package',
          version: '0.0.4',
          dependencies: {
            [JUNO_PACKAGE_SATELLITE_ID]: '1.0.0'
          }
        },
        wasm: new Uint8Array()
      });

      expect(result).toBe('extended');
    });

    it('returns undefined when no relevant dependency found', async () => {
      const result = await extractBuildType({
        junoPackage: {
          name: 'custom-package',
          version: '0.0.6',
          dependencies: {}
        },
        wasm: new Uint8Array()
      });

      expect(result).toBeUndefined();
    });

    it('falls back to readDeprecatedBuildType if junoPackage is undefined', async () => {
      mockWasmWithCustomSection('icp:public juno:build', 'stock');

      const result = await extractBuildType({
        junoPackage: undefined,
        wasm: new Uint8Array()
      });

      expect(result).toBe('stock');
    });
  });

  describe('readCustomSectionJunoPackage', () => {
    it('returns parsed JunoPackage if section is valid JSON and schema-valid', async () => {
      const validPackage = {
        name: JUNO_PACKAGE_SATELLITE_ID,
        version: '0.0.11',
        dependencies: {}
      };

      mockWasmWithCustomSection('icp:public juno:package', JSON.stringify(validPackage));

      const result = await readCustomSectionJunoPackage({wasm: new Uint8Array()});

      expect(result).toEqual(validPackage);
    });

    it('returns undefined if custom section is missing', async () => {
      mockWasmWithCustomSection('nonexistent-section', '');

      const result = await readCustomSectionJunoPackage({wasm: new Uint8Array()});

      expect(result).toBeUndefined();
    });

    it('returns undefined if section is not valid JSON', async () => {
      mockWasmWithCustomSection('icp:public juno:package', '{invalid json');

      await expect(readCustomSectionJunoPackage({wasm: new Uint8Array()})).rejects.toThrow();
    });

    it('returns undefined if parsed JSON is invalid according to schema', async () => {
      const invalidData = {foo: 'bar'};

      mockWasmWithCustomSection('icp:public juno:package', JSON.stringify(invalidData));

      const result = await readCustomSectionJunoPackage({wasm: new Uint8Array()});

      expect(result).toBeUndefined();
    });
  });
});
