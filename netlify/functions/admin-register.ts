import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { GraphQLClient } from "graphql-request";
import { getSdk } from "../common/sdk";
import crypto from "crypto";
import jwt from "jsonwebtoken";

interface AdminRegisterInput {
  username: string;
  password: string;
}

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  const { body, headers } = event;

  if (
    !headers["x-pizzastack-secret-key"] ||
    headers["x-pizzastack-secret-key"] !== "mypizzastacksecretkey"
  ) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        message: "x-pizzastack-secret-key is missing or invalid",
      }),
    };
  }

  const input: AdminRegisterInput = JSON.parse(body!).input.admin;
  const sdk = getSdk(new GraphQLClient("http://localhost:8080/v1/graphql"));

  const password = crypto
    .pbkdf2Sync(input.password, "mygreatesaltsecret", 1000, 64, "sha512")
    .toString("hex");

  const data = await sdk.InsertAdmin({
    username: input.username,
    password,
  });
  const accessToken = jwt.sign(
    {
      "https://hasura.io/jwt/claims": {
        "x-hasura-default-role": "admin",
        "x-hasura-allowed-roles": ["admin"],
        "x-hasura-user-id": data.insert_admin_one?.id,
      },
    },
    "mygreatjwtsecret"
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ accessToken }),
  };
};

export { handler };
