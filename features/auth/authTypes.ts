export type SignInPayload = {
  username: string;
  password: string;
};

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  userImage: string | null;
  userType: string | null;
  enabled: boolean;
};

export type SessionResponse = {
  authenticated: boolean;
  user: AuthUser;
};

export type SignInResponse = {
  authenticated: true;
  message: string;
  homePage: string | null;
  user: AuthUser;
};

export type LogoutResponse = {
  authenticated: false;
  message: string;
};
