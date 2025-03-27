import type {baseObjectInputType, baseObjectOutputType, ZodObject, ZodTypeAny} from 'zod';
import * as z from 'zod';
import {type Collection, CollectionSchema, type Key, KeySchema} from '../../../schemas/satellite';
import {HookContext, HookContextSchema} from '../context';
import {
  DocAssertDelete,
  DocAssertDeleteSchema,
  DocAssertSet,
  DocAssertSetSchema,
  DocUpsert,
  DocUpsertSchema
} from './payload';

/**
 * @see DocContext
 */
export const DocContextSchema = <T extends z.ZodTypeAny>(dataSchema: T) => {
  const schemaShape = {
    collection: CollectionSchema,
    key: KeySchema,
    data: dataSchema
  };

  // TODO: workaround for https://github.com/colinhacks/zod/issues/3998
  return z.object(schemaShape).strict() as ZodObject<
    typeof schemaShape,
    'strict',
    ZodTypeAny,
    baseObjectOutputType<typeof schemaShape>,
    baseObjectInputType<typeof schemaShape>
  >;
};

/**
 * Represents the context of a document operation within a collection.
 *
 * @template T - The type of data associated with the document.
 */
export interface DocContext<T> {
  /**
   * The name of the collection where the document is stored.
   */
  collection: Collection;

  /**
   * The unique key identifying the document within the collection.
   */
  key: Key;

  /**
   * The data associated with the document operation.
   */
  data: T;
}

/**
 * @see OnSetDocContext
 */
export const OnSetDocContextSchema = HookContextSchema(DocContextSchema(DocUpsertSchema));

/**
 * The context provided to the `onSetDoc` hook.
 *
 * This context contains information about the document being created or updated,
 * along with details about the user who triggered the operation.
 */
export type OnSetDocContext = HookContext<DocContext<DocUpsert>>;

/**
 * @see OnSetManyDocsContext
 */
export const OnSetManyDocsContextSchema = HookContextSchema(
  z.array(DocContextSchema(DocUpsertSchema))
);

/**
 * The context provided to the `onSetManyDocs` hook.
 *
 * This context contains information about multiple documents being created or updated
 * in a single operation, along with details about the user who triggered it.
 */
export type OnSetManyDocsContext = HookContext<DocContext<DocUpsert>[]>;

/**
 * @see AssertSetDocContext
 */
export const AssertSetDocContextSchema = HookContextSchema(DocContextSchema(DocAssertSetSchema));

/**
 * The context provided to the `assertDeleteDoc` hook.
 *
 * This context contains information about the document being validated before
 * it is created or updated. If validation fails, the developer should throw an error.
 */
export type AssertSetDocContext = HookContext<DocContext<DocAssertSet>>;

/**
 * @see AssertDeleteDocContext
 */
export const AssertDeleteDocContextSchema = HookContextSchema(
  DocContextSchema(DocAssertDeleteSchema)
);

/**
 * The context provided to the `assertDeleteDoc` hook.
 *
 * This context contains information about the document being validated before
 * it is deleted. If validation fails, the developer should throw an error.
 */
export type AssertDeleteDocContext = HookContext<DocContext<DocAssertDelete>>;
