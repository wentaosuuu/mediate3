export interface OrderItem {
  serviceType: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ServiceType {
  id: string;
  name: string;
  price: number;
  unit: string;
}