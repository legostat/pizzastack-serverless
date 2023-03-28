import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { hashPassword } from "../common/pasword";
import { signToken } from "../common/jwt";
import { api } from "../common/api";
import { AdminRegisterInput } from "../common/sdk";

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

  const password = hashPassword(input.password);

  const data = await api.InsertAdmin(
    {
      username: input.username,
      password,
    },
    {
      "x-hasura-admin-secret": "q5Dwbv3Q9P59tEFE",
    }
  );

  const accessToken = signToken(data.insert_admin_one?.id);

  return {
    statusCode: 200,
    body: JSON.stringify({ accessToken }),
  };
};

export { handler };
