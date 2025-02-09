
export interface ShoppingCart {
  id: string;
  cartId: number;
  userId: number | null;
  date: Date;
  products: Product[];
  
}

export interface Product {
  productId: number;
  title: string;
  price: number;
  properties: Property[];
  quantity: number;
  type: string;
  stock: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
  id: string;
}

export interface Property {
  color: string;
  size: Size[];
  stock: boolean;
  season: string;
  fabric: string;
  fit: string;
  style: string;
}

export interface Size {
  size: string;
  quantity: number;
}

export interface Rating {
  rate: number;
  count: number;
}
