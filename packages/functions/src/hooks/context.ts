import {RawUserId} from './core';
import {DocAssertSet, DocUpsert} from './datastore';

/**
 * Represents the context provided to hooks, containing information about the caller and related data.
 *
 * @template T - The type of data associated with the hook.
 */
export interface HookContext<T> {
  /**
   * The user who originally triggered the function that in turn triggered the hook.
   */
  caller: RawUserId;

  /**
   * The data associated with the hook execution.
   */
  data: T;
}

/**
 * Represents the context of a document operation within a collection.
 *
 * @template T - The type of data associated with the document.
 */
export interface DocContext<T> {
  /**
   * The name of the collection where the document is stored.
   */
  collection: string;

  /**
   * The unique key identifying the document within the collection.
   */
  key: string;

  /**
   * The data associated with the document operation.
   */
  data: T;
}

/**
 * The context provided to the `onSetDoc` hook.
 *
 * This context contains information about the document being created or updated,
 * along with details about the user who triggered the operation.
 */
export type OnSetDocContext = HookContext<DocContext<DocUpsert>>;

/**
 * The context provided to the `assertSetDoc` hook.
 *
 * This context contains information about the document being validated before
 * it is created or updated. If validation fails, the developer should throw an error.
 */
export type AssertSetDocContext = HookContext<DocContext<DocAssertSet>>;
