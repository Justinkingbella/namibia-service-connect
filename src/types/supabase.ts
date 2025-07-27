
export interface RealtimeTable {
  table: string;
  filter?: Record<string, unknown>;
  order?: { column: string; ascending: boolean };
  limit?: number;
  onDataChange: (payload: { data: unknown; eventType: string }) => void;
}

export interface RealtimeQueryResult<T> {
  data: T[];
  error: string;
  loading: boolean;
  refetch: () => Promise<void>;
}
