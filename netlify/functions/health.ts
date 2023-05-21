import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const handler: Handler = async (event: HandlerEvent, _: HandlerContext) => {
  const { headers } = event;

  return {
    statusCode: 200,
    body: JSON.stringify({
      headers,
    }),
  };
};

export { handler };
