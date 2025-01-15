export interface ShoppingCart {
  cartId:   number;
  userId:   number;
  date:     Date;
  products: Product[];
  id:       string;
}

export interface Product {
  productId: number;
  size:      Size[];
}

export interface Size {
  size:     string;
  quantity: number;
}
