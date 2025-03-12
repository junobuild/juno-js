import {RawUserId} from './core';
import {DocAssertSet, DocUpsert} from './datastore';

export interface HookContext<T> {
  caller: RawUserId;
  data: T;
}

export interface DocContext<T> {
  collection: string;
  key: string;
  data: T;
}

export type OnSetDocContext = HookContext<DocContext<DocUpsert>>;

export type AssertSetDocContext = HookContext<DocContext<DocAssertSet>>;
