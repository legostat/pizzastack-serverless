import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  // schema: "http://localhost:8080/v1/graphql",
  schema: [
    {
      "http://localhost:8080/v1/graphql": {
        headers: {
          "x-hasura-admin-secret": "q5Dwbv3Q9P59tEFE",
        },
      },
    },
  ],
  documents: "graphql/*.gql",
  generates: {
    "netlify/common/sdk.ts": {
      plugins: [
        "typescript",
        "typescript-resolvers",
        "typescript-operations",
        "typescript-graphql-request",
      ],
    },
  },
};

export default config;
