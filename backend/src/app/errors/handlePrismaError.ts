import { Prisma } from "@prisma/client";
import { TGenericErrorResponse } from "../interfaces/error.interface";

const handlePrismaError = (
  error:
    | Prisma.PrismaClientKnownRequestError
    | Prisma.PrismaClientValidationError,
): TGenericErrorResponse => {
  // Prisma Known Errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002": {
        const field =
          (error.meta as any)?.driverAdapterError?.cause?.constraint
            ?.fields?.[0] ?? (error.meta as any)?.target?.[0];

        const fieldName = field ? field.charAt(0).toUpperCase() + field.slice(1) : "Record";

        return {
          statusCode: 409,
          message: `${fieldName} already exists`,
          errorDetails: [
            {
              field,
              message: `${fieldName} already exists`,
            },
          ],
        };
      }

      case "P2003":
        return {
          statusCode: 400,
          message: "Invalid Reference",
          errorDetails: [
            {
              message: "Related record does not exist.",
            },
          ],
        };

      case "P2025":
        return {
          statusCode: 404,
          message: "Record Not Found",
          errorDetails: [
            {
              message: "The requested record does not exist.",
            },
          ],
        };

      default:
        return {
          statusCode: 400,
          message: "Database Error",
          errorDetails: [
            {
              message: error.message,
            },
          ],
        };
    }
  }

  // ==========================
  // Prisma Validation Errors
  // ==========================

  const message = error.message;

  // Case 1: Missing unique field
  const uniqueInputMatch = message.match(
    /Argument `(\w+)` of type .* needs at least one of `(.+?)` arguments/,
  );

  if (uniqueInputMatch) {
    const [, argument, fields] = uniqueInputMatch;

    const parsedFields = fields.split("`, `").map((f) => f.replace(/`/g, ""));

    return {
      statusCode: 400,
      message: "Missing Required Field",
      errorDetails: [
        {
          field: argument,
          message: `At least one of the following fields is required: ${parsedFields.join(", ")}.`,
        },
      ],
    };
  }

  // Case 2: Missing argument
  const missingArgumentMatch = message.match(/Argument `(.+?)` is missing/);

  if (missingArgumentMatch) {
    return {
      statusCode: 400,
      message: "Missing Required Argument",
      errorDetails: [
        {
          field: missingArgumentMatch[1],
          message: `${missingArgumentMatch[1]} is required.`,
        },
      ],
    };
  }

  // Case 3: Invalid type
  const expected = message.match(/Expected (.+?),/)?.[1];
  const provided = message.match(/provided (.+?)\./)?.[1];

  if (expected && provided) {
    return {
      statusCode: 400,
      message: "Validation Error",
      errorDetails: [
        {
          message: `Expected ${expected}, but received ${provided}.`,
        },
      ],
    };
  }

  // Fallback
  return {
    statusCode: 400,
    message: "Validation Error",
    errorDetails: [
      {
        message: message.replace(/\n+/g, " ").replace(/\s+/g, " ").trim(),
      },
    ],
  };
};

export default handlePrismaError;
