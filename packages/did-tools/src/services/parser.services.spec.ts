import {mockImports, mockMethodSignatures} from '../mocks/method-signatures.mock';
import {mockTransformedCoreJS, mockTransformedCoreTS} from '../mocks/transfomer.mock';
import {parseApi} from './parser.services';

describe('parser-services', () => {
  it('should parse TypeScript with core lib', () => {
    const result = parseApi({
      methods: mockMethodSignatures,
      imports: [],
      transformerOptions: {
        outputLanguage: 'ts'
      }
    });

    expect(result.trim()).toEqual(mockTransformedCoreTS);
  });

  it('should parse JavaScript with core lib', () => {
    const result = parseApi({
      methods: mockMethodSignatures,
      imports: [],
      transformerOptions: {
        outputLanguage: 'js'
      }
    });

    expect(result.trim()).toEqual(mockTransformedCoreJS);
  });

  it('should import from core-peer', () => {
    const result = parseApi({
      methods: mockMethodSignatures,
      imports: [],
      transformerOptions: {
        outputLanguage: 'ts',
        coreLib: 'core-peer'
      }
    });

    expect(result.trim()).toContain(
      "import {getSatelliteExtendedActor} from '@junobuild/core-peer';"
    );
  });

  it('should add did imports', () => {
    const result = parseApi({
      methods: mockMethodSignatures,
      imports: mockImports,
      transformerOptions: {
        outputLanguage: 'ts'
      }
    });

    expect(result.trim()).toContain(
      "import type {_SERVICE as SatelliteActor, Hello, Result} from './satellite.did';"
    );
  });

  it('should not add any did imports', () => {
    const result = parseApi({
      methods: mockMethodSignatures,
      imports: [],
      transformerOptions: {
        outputLanguage: 'js'
      }
    });

    expect(result.trim()).not.toContain(
      "import type {_SERVICE as SatelliteActor} from './satellite.did';"
    );
  });
});
