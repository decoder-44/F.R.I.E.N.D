import { HTTP_METHOD, LOG_LEVEL } from "../../constants.js";
import { GraphqlRequestOperations } from "../graphqlRequestOperations.js";
import { PHONE_PE_ORDER_DATA } from "../../graphql/query/PhonePeOrderData.js";
import { log } from "../../utils/logger.js";
import { ERROR_CODES } from "../../errors/errorCodes.js";
import { CustomError } from "../../errors/customError.js";

export class PaymentsOps {
    constructor(req) {
        this.req = req
        this.graphqlRequestOperations = new GraphqlRequestOperations(this.req);
    }

    async getPhonePeOrderId(inputData) {
        try {
            const option = {
                method: HTTP_METHOD.POST,
                query: PHONE_PE_ORDER_DATA,
                variable: { input: inputData },
            }
            const response = await this.graphqlRequestOperations.performQuery(option.method, option.query, option.variable);
            log(
                LOG_LEVEL.INFO,
                "Successfully fetched order id from phone pe payments",
                { inputData },
                this.req
            );
            return response;
        } catch (error) {
            log(
                LOG_LEVEL.ERROR,
                `Error occurred while fetching phone pay order id ${error.message}`,
                { inputData },
                this.req
            );
            const errorData = {
                code: ERROR_CODES.GET_PHONE_PE_ORDER_ID_ERROR,
            }
            throw new CustomError(errorData);
        }
    }
}