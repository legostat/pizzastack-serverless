import { GraphQLClient } from "graphql-request";
import { getSdk } from "./sdk";
import { config } from "../core/config";

export const api = getSdk(new GraphQLClient(config.hasuraEndpoint));
