import {mockMethodSignatures} from '../mocks/method-signatures.mock';
import {mockTransformedCoreJS, mockTransformedCoreTS} from '../mocks/transfomer.mock';
import {generateService} from './transformer.services';

describe('transformer-services', () => {
  it('should generate TypeScript with core lib', () => {
    const result = generateService({
      signatures: mockMethodSignatures,
      transformerOptions: {
        outputLanguage: 'ts'
      }
    });

    expect(result.trim()).toEqual(mockTransformedCoreTS);
  });

  it('should generate JavaScript with core lib', () => {
    const result = generateService({
      signatures: mockMethodSignatures,
      transformerOptions: {
        outputLanguage: 'js'
      }
    });

    expect(result.trim()).toEqual(mockTransformedCoreJS);
  });

  it('should import from core-peer', () => {
    const result = generateService({
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
