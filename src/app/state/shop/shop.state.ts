import { InventoryAdjustmentReason } from '@app/models/inventory-adjustment-reason';
import { InventoryCategory } from '@app/models/inventory-category';
import { PaymentType } from '@app/models/payment-type';
import { ProductCategory } from '@app/models/product-category';

export interface ShopState {
  id: string;
  name: string;
  description: string;
  location: string;
  currencyCode: string;
  paymentTypes: PaymentType[];
  productCategories: ProductCategory[];
  inventoryCategories: InventoryCategory[];
  inventoryAdjustmentReasons: InventoryAdjustmentReason[];
}