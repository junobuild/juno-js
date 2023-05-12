export interface Doc<D> {
  key: string;
  description?: string;
  data: D;
  owner?: string;
  created_at?: bigint;
  updated_at?: bigint;
}
