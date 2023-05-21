import jwt from "jsonwebtoken";
import { config } from "../core/config";

export const HASURA_CLAIMS = "https://hasura.io/jwt/claims";
export const HASURA_USER_ID = "x-hasura-user-id";

export const signToken = (userId: string): string =>
  jwt.sign(
    {
      [HASURA_CLAIMS]: {
        "x-hasura-default-role": "admin",
        "x-hasura-allowed-roles": ["admin"],
        [HASURA_USER_ID]: userId,
      },
    },
    config.jwtSecret
  );

export const getTokenData = (token: string) => {
  return jwt.verify(token, config.jwtSecret);
};
