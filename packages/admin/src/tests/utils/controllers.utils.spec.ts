import {Principal} from '@icp-sdk/core/principal';
import {SatelliteDid} from '@junobuild/ic-client/actor';
import {SetControllerParams} from '../../types/controllers';
import {mapSetControllerParams} from '../../utils/controllers.utils';
import {mockUserIdText} from '../mocks/admin.mock';

describe('controllers.utils', () => {
  describe('mapSetControllerParams', () => {
    it('maps controllerId and non-empty profile correctly', () => {
      const input: SetControllerParams = {
        controllerId: mockUserIdText,
        profile: 'hello world'
      };

      const result = mapSetControllerParams(input);

      expect(result.controllerIds).toEqual([Principal.fromText(mockUserIdText)]);

      const expected: SatelliteDid.SetController = {
        metadata: [['profile', 'hello world']],
        expires_at: [],
        scope: {Admin: null},
        kind: []
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
      expect(result.controller.scope).toEqual({Admin: null});
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
});
