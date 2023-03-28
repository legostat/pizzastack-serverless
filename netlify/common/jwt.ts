import jwt from "jsonwebtoken";

export const signToken = (userId: string): string =>
  jwt.sign(
    {
      "https://hasura.io/jwt/claims": {
        "x-hasura-default-role": "admin",
        "x-hasura-allowed-roles": ["admin"],
        "x-hasura-user-id": userId,
      },
    },
    "hUf8d67EJzDhfXLz4mkdURGcQc2RZdAt"
  );
