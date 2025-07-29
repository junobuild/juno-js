import { Principal } from '@dfinity/principal';
import {SetControllerParams} from '../../types/controllers';
import {mockUserIdText} from '../mocks/principal.mocks';
import {mapSetControllerParams} from '../../utils/controllers.utils';
import {SetController} from '../../../declarations/satellite/satellite.did';

describe("controllers.utils", () => {
  describe('mapSetControllerParams', () => {
    it('maps controllerId and non-empty profile correctly', () => {
      const input: SetControllerParams = {
        controllerId: mockUserIdText,
        profile: 'hello world'
      };

      const result = mapSetControllerParams(input);

      expect(result.controllerIds).toEqual([Principal.fromText(mockUserIdText)]);

      const expected: SetController = {
        metadata: [['profile', 'hello world']],
        expires_at: [],
        scope: { Admin: null }
      };

      expect(result.controller).toEqual(expected);
    });

    it('maps controllerId and empty profile correctly', () => {
      const input: SetControllerParams = {
        controllerId: mockUserIdText,
        profile: ''
      };

      const result = mapSetControllerParams(input);

      expect(result.controllerIds).toEqual([Principal.fromText(mockUserIdText)]);
      expect(result.controller.metadata).toEqual([]);
      expect(result.controller.expires_at).toEqual([]);
      expect(result.controller.scope).toEqual({ Admin: null });
    });

    it('maps controllerId and null profile correctly', () => {
      const input: SetControllerParams = {
        controllerId: mockUserIdText,
        profile: null
      };

      const result = mapSetControllerParams(input);

      expect(result.controller.metadata).toEqual([]);
    });

    it('maps controllerId and undefined profile correctly', () => {
      const input: SetControllerParams = {
        controllerId: mockUserIdText,
        profile: undefined
      };

      const result = mapSetControllerParams(input);

      expect(result.controller.metadata).toEqual([]);
    });
  });

})

