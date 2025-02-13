export interface ShoppingCart {
  id?: string;
  cartId: number;
  userId: number | null;
  date: Date;
  products: Product[];
}
export interface Product {
  productId:   number;
  title:       string;
  price:       number;
  properties:  Property[];
  type:        Type;
  description: string;
  category?:   Category;
  image:       string;
  rating:      Rating;
  id:          string;
}

export enum Category {
  Electronics = "electronics",
  Jewelry = "jewelry",
  MenSClothing = "men's clothing",
  WomenSClothing = "women's clothing",
}

export interface Property {
  color:         string;
  size?:         Size[];
  quantity:      number;
  season?:       string;
  fabric?:       string;
  fit?:          string;
  style:         string;
  material?:     string;
  totalStock?:   number;
  batteryLife?:  string;
  capacity?:     string;
  connectivity?: string;
  features?:     string[];
  screenSize?:   string;
  specs?:        string[];
}

export interface Size {
  size:     string;
  quantity: number;
}

export interface Rating {
  rate:  number;
  count: number;
}

export enum Type {
  Composite = "composite",
  Simple = "simple",
}
