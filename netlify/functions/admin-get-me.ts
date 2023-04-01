import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { getAdminFromHeaders } from "../common/get-admin-from-headers";

const handler: Handler = async (event: HandlerEvent, _: HandlerContext) => {
  const { headers } = event;

  try {
    const admin = await getAdminFromHeaders(headers);
    return {
      statusCode: 200,
      body: JSON.stringify({
        id: admin.admin_by_pk.id,
        username: admin.admin_by_pk?.username,
      }),
    };
  } catch (error) {
    return JSON.parse(error.message);
  }
};

export { handler };
