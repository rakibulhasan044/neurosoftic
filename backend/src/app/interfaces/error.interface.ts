export type TErrorSource = {
  field?: string;
  message: string;
};

export type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorDetails: TErrorSource[];
};