export interface User {
  email: string;
  password: string;
}

export interface Book {
  genre: string;
  title: string;
  author: string;
  translator?: string;
  editorialOffice?: string;
  publishingHouse?: string;
  yearPublish: number;
  series?: string;
  price: number;
  img: string;
  annotation: string;
  id?: string;
  discountIsActive: boolean;
  discount?: number;
  discountPrice?: number;
  isBestseller: boolean;
}
