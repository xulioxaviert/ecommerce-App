export interface Products {
  productId: number;
  title: string;
  price: number;
  quantity: QuantityClass | number;
  description: string;
  category: Category;
  image: string;
  rating: Rating;
}

export enum Category {
  Electronics = "electronics",
  Jewelery = "jewelery",
  MenSClothing = "men's clothing",
  WomenSClothing = "women's clothing",
}

export interface QuantityClass {
  xs: number;
  s: number;
  m: number;
  l: number;
  xl: number;
  xxl: number;
  xxxl: number;
}

export interface Rating {
  rate: number;
  count: number;
}

export interface CategoryFake {
  category:     string;
  name:         string;
  title:        string;
  descriptions: string;
  img:         string;
}



