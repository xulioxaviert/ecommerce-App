export interface Cart {
  id:       number;
  userId:   number;
  date:     Date;
  products: ProductCart[];
  __v:      number;
}

export interface ProductCart {
  productId: number;
  quantity:  number;
}
