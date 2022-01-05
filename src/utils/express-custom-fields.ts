export type GraphqlOperationType =
  | 'query'
  | 'mutation'
  | 'subscription';
export interface GraphqlOperation {
  operationName: string;
  operationType: GraphqlOperationType;
  subOperation: string;
}

declare global {
  namespace Express {
    interface Request {
      graphql?: GraphqlOperation;
    }
  }
}
