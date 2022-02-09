export interface Cart {
  id: string;
  items: CartItem[];
  subTotal: number;
  shippingTotal: number;
  discount: number;
  total: number;
}

export type CartItem = {
  quantity: number;
  product: Product;
};

export type Product = {
  sku: string;
  name: string;
  imageObjects: Array<object>;
  priceSpecification: PriceSpecification;
};

export type PriceSpecification = {
  sku: string;
  price: number;
  originalPrice: number;
  maxPrice: number;
  percent: number;
  discount: number;
};

export type ImageObjects = {
  featured: string;
  thumbnail: string;
  small: string;
  medium: string;
  large: string;
  extraLarge: string;
  valid: boolean;
};