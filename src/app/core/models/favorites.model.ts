export interface Favorites {
  id: string;
  favorityId: number;
  userId: number;
  date: Date;
  products: Product[];
}

export interface Product {
  productId: number;
  quantity: QuantitySize | number;
}

export interface QuantitySize {
  xs?: number;
  s?: number;
  m?: number;
  l?: number;
}
