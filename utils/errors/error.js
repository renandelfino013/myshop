export class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

class NotFoundError extends AppError {
  constructor(details) {
    super("Not found error", 404, "NOT_FOUND");
    this.details = details;
  }
}
export class UnauthorizedError extends AppError {
  constructor(message = "Invalid or missing authentication token") {
    super(message, 401, "UNAUTHORIZED");
  }
}
export class EmailAlreadyExistsError extends AppError {
  constructor(email) {
    super(`Email ${email} already in use`, 409, "EMAIL_ALREADY_EXISTS");
  }
}
class InsufficientStockError extends AppError {
  constructor(details) {
    super("Insufficient stock error", 409, "INSUFFICIENT_STOCK");
    this.details = details;
  }
}

class ValidationError extends AppError {
  constructor(details) {
    super("Validation error", 400, "VALIDATION_ERROR");
    this.details = details;
  }
}
class RegisterError extends AppError {
  constructor(details) {
    super("Register error", 401, "REGISTER_ERROR");
    this.details = details;
  }
}

class AuthError extends AppError {
  constructor(details) {
    super("Auth error", 401, "AUTH_ERROR");
    this.details = details;
  }
}
class SendEmailError extends AppError {
  constructor(details) {
    super("Send email error", 500, "SEND_EMAIL_ERROR");
    this.details = details;
  }
}
class NetworkError extends AppError {
  constructor(details) {
    super("Network error", 500, "NETWORK_ERROR");
    this.details = details;
  }
}
class ForbiddenError extends AppError {
  constructor(details) {
    super("Forbidden error", 403, "FORBIDDEN_ERROR");
    this.details = details;
  }
}

export {
  ForbiddenError,
  NotFoundError,
  ValidationError,
  AuthError,
  SendEmailError,
  NetworkError,
  RegisterError,
  InsufficientStockError,
};
