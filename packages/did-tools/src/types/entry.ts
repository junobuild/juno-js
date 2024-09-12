export type DocEntryType =
    | 'function'
    | 'method'
    | 'class'
    | 'const'
    | 'interface'
    | 'type'
    | 'enum';

export interface DocEntry {
    name: string;
    fileName?: string;
    url?: string;
    documentation?: string;
    type?: string;
    parameters?: DocEntry[];
    methods?: DocEntry[];
    returnType?: string;
    doc_type?: DocEntryType;
}