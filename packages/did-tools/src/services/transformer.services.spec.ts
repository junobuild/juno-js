import {mockMethodSignatures} from '../mocks/method-signatures.mock';
import {generateService} from './transformer.services';

describe('transformer-services', () => {
  it('should generate js with core lib', () => {
    const result = generateService({
      signatures: mockMethodSignatures,
      transformerOptions: {
        outputLanguage: 'js'
      }
    });

    console.log(result);
  });
});
