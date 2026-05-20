export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface AuthResponse {
  token: string;
  username: string;
}
