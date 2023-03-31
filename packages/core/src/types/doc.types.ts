export interface Doc<D> {
  key: string;
  data: D;
  owner?: string;
  created_at?: bigint;
  updated_at?: bigint;
}
