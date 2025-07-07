export type AccessToken = {
  token: string;
  duration: number;
  expiration: Date;
};

export type RefreshToken = {
  token: string;
  duration: number;
  expiration: Date;
};
