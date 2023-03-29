import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { api } from "../common/api";
import { getTokenData, HASURA_CLAIMS, HASURA_USER_ID } from "../common/jwt";

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  const { headers } = event;
  const authHeader = headers["authorization"];

  if (!authHeader) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: "Forbidden" }),
    };
  }

  const [_, authToken] = authHeader.split(" ");

  const adminObj = getTokenData(authToken);

  const adminId = adminObj[HASURA_CLAIMS][HASURA_USER_ID];

  const data = await api.AdminGetMe(
    { id: adminId },
    {
      "x-hasura-admin-secret": "q5Dwbv3Q9P59tEFE",
    }
  );

  // const data = await api.GetAdminByUsername(
  //   { username: input.username },
  //   {
  //     "x-hasura-admin-secret": "q5Dwbv3Q9P59tEFE",
  //   }
  // );

  return {
    statusCode: 200,
    body: JSON.stringify({ id: adminId, username: data.admin_by_pk?.username }),
  };
};

export { handler };
