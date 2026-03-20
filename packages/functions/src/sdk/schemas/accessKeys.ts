import * as z from 'zod';
import {RawPrincipalSchema} from '../../schemas/candid';
import {type Timestamp, TimestampSchema} from '../../schemas/satellite';

/**
 * @see AccessKeyScope
 */
export const AccessKeyScopeSchema = z.enum(['write', 'admin', 'submit']);

/**
 * Represents the permission scope of an access key.
 */
export type AccessKeyScope = z.infer<typeof AccessKeyScopeSchema>;

/**
 * @see AccessKeyKind
 */
export const AccessKeyKindSchema = z.enum(['automation', 'emulator']);

/**
 * Represents a specific kind of access key. Meant for informational purposes.
 */
export type AccessKeyKind = z.infer<typeof AccessKeyKindSchema>;

/**
 * @see MetadataSchema
 */
export const MetadataSchema = z.tuple([z.string(), z.string()]);

/**
 * Represents a single metadata entry as a key-value tuple.
 */
export type Metadata = z.infer<typeof MetadataSchema>;

/**
 * @see AccessKeySchema
 */
export const AccessKeySchema = z
  .object({
    metadata: z.array(MetadataSchema),
    created_at: TimestampSchema,
    updated_at: TimestampSchema,
    expires_at: TimestampSchema.optional(),
    scope: AccessKeyScopeSchema,
    kind: AccessKeyKindSchema.optional()
  })
  .strict();

/**
 * Represents an access key with access scope and associated metadata.
 */
export interface AccessKey {
  /**
   * A list of key-value metadata pairs associated with the access key.
   */
  metadata: Metadata[];

  /**
   * The timestamp when the access key was created.
   */
  created_at: Timestamp;

  /**
   * The timestamp when the access key was last updated.
   */
  updated_at: Timestamp;

  /**
   * Optional expiration timestamp for the access key.
   */
  expires_at?: Timestamp;

  /**
   * The scope assigned to the access key.
   */
  scope: AccessKeyScope;

  /**
   * An optional kind identifier of the access key.
   */
  kind?: AccessKeyKind;
}

/**
 * @see AccessKeyRecordSchema
 */
export const AccessKeyRecordSchema = z.tuple([RawPrincipalSchema, AccessKeySchema]);

/**
 * Represents a tuple containing the principal ID and associated access key data.
 */
export type AccessKeyRecord = z.infer<typeof AccessKeyRecordSchema>;

/**
 * @see AccessKeysSchema
 */
export const AccessKeysSchema = z.array(AccessKeyRecordSchema);

/**
 * Represents a list of access keys.
 */
export type AccessKeys = z.infer<typeof AccessKeysSchema>;
