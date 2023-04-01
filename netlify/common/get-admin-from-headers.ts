import { api } from "./api";
import { HASURA_CLAIMS, HASURA_USER_ID, getTokenData } from "./jwt";
import { GetAdminByIdQuery } from "./sdk";

export const getAdminFromHeaders = async (
  headers
): Promise<GetAdminByIdQuery> => {
  const authHeader = headers["authorization"];

  if (!authHeader) {
    throw new Error(
      JSON.stringify({
        statusCode: 403,
        body: JSON.stringify({ message: "Forbidden" }),
      })
    );
  }

  const [_, authToken] = authHeader.split(" ");

  const adminObj = getTokenData(authToken);

  const adminId = adminObj[HASURA_CLAIMS][HASURA_USER_ID];

  const data = await api.GetAdminById(
    { id: adminId },
    {
      "x-hasura-admin-secret": "q5Dwbv3Q9P59tEFE",
    }
  );

  return data;
};
