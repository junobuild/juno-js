import {mockMethodSignatures} from '../mocks/method-signatures.mock';
import {generateService} from './transformer.services';
import {mockTransformedCoreTS} from "../mocks/transfomer.mock";

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
});
