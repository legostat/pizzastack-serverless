import { Handler, HandlerEvent } from "@netlify/functions";
import { v2 as cloudinary } from "cloudinary";
import { getAdminFromHeaders } from "../common/get-admin-from-headers";
import { GetAdminByIdQuery } from "../common/sdk";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

const handler: Handler = async (event: HandlerEvent, _) => {
  const { headers } = event;

  try {
    const admin: GetAdminByIdQuery = await getAdminFromHeaders(headers);

    if (!admin.admin_by_pk.id) {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: "Forbidden" }),
      };
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const publicId = `menu-${timestamp}`;

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        public_id: publicId,
        folder: "menu",
      },
      process.env.API_SECRET
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        signature,
        timestamp,
        publicId,
        apiKey: process.env.API_KEY,
        cloudName: process.env.CLOUD_NAME,
      }),
    };
  } catch (error) {
    return JSON.parse(error.message);
  }
};

export { handler };
