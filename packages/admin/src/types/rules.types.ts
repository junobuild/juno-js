import type {Rule as RuleConfig} from '@junobuild/config';

// Redefine types for backward compatibility

/**
 * @deprecated use stableV2
 */
export type MemoryTextStable = 'stable';

export type MemoryText = 'heap' | 'stableV2' | MemoryTextStable;

export type Rule = Omit<RuleConfig, 'memory'> & {memory: MemoryText};
