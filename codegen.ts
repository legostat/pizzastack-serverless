import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:8080/v1/graphql",
  documents: "graphql/*.gql",
  generates: {
    "netlify/common/sdk.ts": {
      plugins: [
        "typescript",
        // "typescript-resolvers",
        "typescript-operations",
        // "typescript-document-nodes",
        "typescript-graphql-request",
      ],
    },
  },
};

export default config;
