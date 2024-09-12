import {mockMethodSignatures} from '../mocks/method-signatures.mock';
import {mockTransformedCoreJS, mockTransformedCoreTS} from '../mocks/transfomer.mock';
import {parseApi} from './parser.services';

describe('parser-services', () => {
  it('should parse TypeScript with core lib', () => {
    const result = parseApi({
      signatures: mockMethodSignatures,
      transformerOptions: {
        outputLanguage: 'ts'
      }
    });

    expect(result.trim()).toEqual(mockTransformedCoreTS);
  });

  it('should parse JavaScript with core lib', () => {
    const result = parseApi({
      signatures: mockMethodSignatures,
      transformerOptions: {
        outputLanguage: 'js'
      }
    });

    expect(result.trim()).toEqual(mockTransformedCoreJS);
  });

  it('should import from core-peer', () => {
    const result = parseApi({
      signatures: mockMethodSignatures,
      transformerOptions: {
        outputLanguage: 'ts',
        coreLib: 'core-peer'
      }
    });

    expect(result.trim()).toContain(
      "import { getSatelliteExtendedActor } from '@junobuild/core-peer';"
    );
  });
});
