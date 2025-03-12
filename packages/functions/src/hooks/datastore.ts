import {RawData, RawUserId, Timestamp, Version} from './core';

export interface DocUpsert {
  before?: Doc;
  after: Doc;
}

export interface DocAssertSet {
  current?: Doc;
  proposed: SetDoc;
}

export interface Doc {
  owner: RawUserId;
  data: RawData;
  description?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
  version?: Version;
}

export interface SetDoc {
  data: RawData;
  description?: string;
  version?: Version;
}
