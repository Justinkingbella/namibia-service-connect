
export interface PaymentMethod {
  id: string;
  user_id: string;
  type: string;
  name: string;
  details: any;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}
