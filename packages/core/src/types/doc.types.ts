export interface Doc<D> {
  key: string;
  data: D;
  created_at?: bigint;
  updated_at?: bigint;
}
