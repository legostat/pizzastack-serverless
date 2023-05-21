import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { hashPassword } from "../common/pasword";
import { signToken } from "../common/jwt";
import { api } from "../common/api";
import { AdminRegisterInput, InsertAdminMutation } from "../common/sdk";
import { config } from "../core/config";

const handler: Handler = async (event: HandlerEvent, _: HandlerContext) => {
  const { body, headers } = event;

  if (
    !headers["x-pizzastack-secret-key"] ||
    headers["x-pizzastack-secret-key"] !== config.hasuraPizzastackSecret
  ) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        message: "x-pizzastack-secret-key is missing or invalid",
      }),
    };
  }

  const input: AdminRegisterInput = JSON.parse(body!).input.admin;

  const password: string = hashPassword(input.password);

  const data: InsertAdminMutation = await api.InsertAdmin(
    {
      username: input.username,
      password,
    },
    {
      "x-hasura-admin-secret": config.hasuraAdminSecret,
    }
  );

  const accessToken: string = signToken(data.insert_admin_one?.id);

  return {
    statusCode: 200,
    body: JSON.stringify({ accessToken }),
  };
};

export { handler };
