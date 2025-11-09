import {Principal} from '@icp-sdk/core/principal';

export const mockUserIdText = 'xlmdg-vkosz-ceopx-7wtgu-g3xmd-koiyc-awqaq-7modz-zf6r6-364rh-oqe';
export const mockUserIdPrincipal = Principal.fromText(mockUserIdText);
export const mockRawUserId = mockUserIdPrincipal.toUint8Array();
