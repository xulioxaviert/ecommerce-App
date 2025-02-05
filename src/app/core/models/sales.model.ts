export interface Sales {
  name:             string;
  email:            string;
  creditCardHoler:  string;
  creditCardNumber: string;
  expirationDate:   string;
  cvc:              string;
  sales:            Sale[];
}

export interface Sale {
  id:       string;
  cartId:   number;
  userId:   number;
  date:     Date;
  products: Product[];
}

export interface Product {
  productId:   number;
  title:       string;
  price:       number;
  properties:  Property[];
  quantity:    number;
  type:        string;
  stock:       number;
  description: string;
  category:    string;
  image:       string;
  rating:      Rating;
  id:          string;
}

export interface Property {
  color:        string;
  size?:        Size[];
  stock:        boolean;
  season?:      string;
  fabric?:      string;
  fit?:         string;
  style:        string;
  batteryLife?: string;
}

export interface Size {
  size:     string;
  quantity: number;
}

export interface Rating {
  rate:  number;
  count: number;
}
