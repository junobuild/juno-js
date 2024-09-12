export interface DocEntry {
    name: string;
    fileName?: string;
    url?: string;
    documentation?: string;
    type?: string;
    parameters?: DocEntry[];
    methods?: DocEntry[];
    properties?: DocEntry[];
    returnType?: string;
}