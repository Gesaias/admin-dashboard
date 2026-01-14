import { PrismaClientKnownRequestError } from '../generated/prisma/runtime/client.js';

export function isPrismaKnownRequestError(
  error: any,
): error is PrismaClientKnownRequestError {
  return error instanceof PrismaClientKnownRequestError;
}
