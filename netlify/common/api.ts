import { GraphQLClient } from "graphql-request";
import { getSdk } from "./sdk";

export const api = getSdk(
  new GraphQLClient("http://localhost:8080/v1/graphql")
);
