export interface ShoppingCart {
  id:       number;
  userId:   number;
  date:     Date;
  products: CartProducts[];
  __v:      number;
}

export interface CartProducts {
  productId: number;
  quantity:  number;
}
