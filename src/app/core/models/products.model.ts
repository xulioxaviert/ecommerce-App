export interface Products {
  productId:   number;
  title:       string;
  price:       number;
  size?:       SizeElement[];
  stock:       number;
  description: string;
  category:    Category;
  image:       string;
  rating:      Rating;
  id:          string;
}

export enum Category {
  Electronics = "electronics",
  Jewelery = "jewelry",
  MenSClothing = "men's clothing",
  WomenSClothing = "women's clothing",
}

export interface Rating {
  rate:  number;
  count: number;
}

export interface SizeElement {
  size:     SizeEnum;
  quantity: number;
}

export enum SizeEnum {
  L = "l",
  M = "m",
  S = "s",
  Xl = "xl",
  XS = "xs",
  XXL = "xxl",
}
