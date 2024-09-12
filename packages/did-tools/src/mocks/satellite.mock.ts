import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Hello { 'world' : string }
export interface _SERVICE {
    'build_version' : ActorMethod<[], string>,
    'yolo' : ActorMethod<[Hello], string>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];