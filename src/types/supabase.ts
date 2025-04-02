
export interface RealtimeTable {
  table: string;
  filter?: Record<string, any>;
  order?: { column: string; ascending: boolean };
  limit?: number;
  onDataChange: (payload: any) => void;
}

export interface RealtimeQueryResult<T> {
  data: T[];
  error: string;
  loading: boolean;
  refetch: () => Promise<void>;
}
