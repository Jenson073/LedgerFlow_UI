export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends Credentials {
  name: string;
}
