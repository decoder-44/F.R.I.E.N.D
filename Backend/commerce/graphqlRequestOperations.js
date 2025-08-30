import { URL_TYPES } from "../constants.js"
import { GraphQLClient } from "graphql-request";
import { HTTP_METHOD } from "../constants.js";

export class GraphqlRequestOperations {
  constructor(urlType) {
    const urls = {
      COMMERCE: process.env.COMMERCE_URL
    }
    // this.urlType = urlType ?? URL_TYPES.COMMERCE;
    this.commerceUrl = urls[URL_TYPES.COMMERCE];
  }

  getClient(method) {
    return new GraphQLClient(this.commerceUrl, {
      method: HTTP_METHOD[method],
      jsonSerializer: {
        parse: JSON.parse,
        stringify: JSON.stringify,
      },
    });
  }

  async performQuery(method, operation, variable) {
    const client = this.getClient(method);

    return await client.request(operation, variable)
  }
}