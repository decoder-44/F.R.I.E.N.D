import { gql } from "graphql-request";

export const PHONE_PE_ORDER_DATA = gql`
  query PhonePePaymentRequest($input: String!) {
    PhonePePaymentRequest(input: $input) {
      orderId
    }
  }
`;