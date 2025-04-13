
import { PaymentMethodType as SchemaPaymentMethodType } from '@/types/schema';
import { PaymentMethodType as PaymentPaymentMethodType } from '@/types/payment';

/**
 * Safely cast a schema payment method type to a payment type
 * This helps bridge the gap between different type definitions
 */
export function castPaymentMethodType(schemaType: SchemaPaymentMethodType): PaymentPaymentMethodType {
  // Create a map between schema types and payment types
  // This helps TypeScript understand the conversion is safe
  const typeMapping: Record<SchemaPaymentMethodType, PaymentPaymentMethodType> = {
    'credit_card': 'credit_card' as PaymentPaymentMethodType,
    'debit_card': 'debit_card' as PaymentPaymentMethodType, 
    'bank_transfer': 'bank_transfer' as PaymentPaymentMethodType,
    'mobile_money': 'mobile_money' as PaymentPaymentMethodType,
    'cash': 'cash' as PaymentPaymentMethodType,
    'wallet': 'wallet' as PaymentPaymentMethodType
  };
  
  // Return the mapped type or a default if not found
  return typeMapping[schemaType] || 'cash' as PaymentPaymentMethodType;
}
