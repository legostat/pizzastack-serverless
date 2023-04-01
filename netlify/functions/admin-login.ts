import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { hashPassword } from "../common/pasword";
import { signToken } from "../common/jwt";
import { api } from "../common/api";
import { AdminLoginInput } from "../common/sdk";

const handler: Handler = async (event: HandlerEvent, _: HandlerContext) => {
  const { body } = event;

  const input: AdminLoginInput = JSON.parse(body!).input.admin;

  const password = hashPassword(input.password);

  const data = await api.GetAdminByUsername(
    { username: input.username },
    {
      "x-hasura-admin-secret": "q5Dwbv3Q9P59tEFE",
    }
  );

  if (
    data.admin.length === 0 ||
    hashPassword(input.password) !== data.admin[0].password
  ) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "User not found or password invalid" }),
    };
  }

  // console.log("data ", data);

  const accessToken = signToken(data.admin[0].id);

  return {
    statusCode: 200,
    body: JSON.stringify({ accessToken }),
  };
};

export { handler };
