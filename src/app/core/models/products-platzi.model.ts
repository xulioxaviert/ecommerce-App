export interface ProductsPlatzi {
  id:          number;
  title:       string;
  price:       number;
  description: string;
  images:      string[];
  creationAt:  Date;
  updatedAt:   Date;
  category:    CategoryPlatzi;
}

export interface CategoryPlatzi {
  id:         number;
  name:       Name;
  image:      string;
  creationAt: Date;
  updatedAt:  Date;
}

export enum Name {
  ChangeTitle = "Change title",
  Clothes = "Clothes",
  Electronics = "Electronics ",
  Miscellaneous = "Miscellaneous",
  Shoes = "Shoes",
}
