export class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export class NotFoundError extends AppError {
  constructor(details) {
    super("Not found error", 404, "NOT_FOUND");
    this.details = details;
  }
}
export class UnauthorizedError extends AppError {
  constructor(details) {
    super("UNATHORIZED ERROR", 401, "UNAUTHORIZED");
    this.details = details;
  }
}
export class alreadyExistsError extends AppError {
  constructor(details) {
    super("Already exists error", 409, "ALREADY_EXISTS");
    this.details = details;
  }
}
export class EmailAlreadyExistsError extends AppError {
  constructor(email) {
    super(`Email ${email} already in use`, 409, "EMAIL_ALREADY_EXISTS");
  }
}
export class InsufficientStockError extends AppError {
  constructor(details) {
    super("Insufficient stock error", 409, "INSUFFICIENT_STOCK");
    this.details = details;
  }
}

export class ValidationError extends AppError {
  constructor(details) {
    super("Validation error", 400, "VALIDATION_ERROR");
    this.details = details;
  }
}
export class RegisterError extends AppError {
  constructor(details) {
    super("Register error", 401, "REGISTER_ERROR");
    this.details = details;
  }
}

export class AuthError extends AppError {
  constructor(details) {
    super("Auth error", 401, "AUTH_ERROR");
    this.details = details;
  }
}
export class SendEmailError extends AppError {
  constructor(details) {
    super("Send email error", 500, "SEND_EMAIL_ERROR");
    this.details = details;
  }
}
export class NetworkError extends AppError {
  constructor(details) {
    super("Network error", 500, "NETWORK_ERROR");
    this.details = details;
  }
}
export class ForbiddenError extends AppError {
  constructor(details) {
    super("Forbidden error", 403, "FORBIDDEN_ERROR");
    this.details = details;
  }
}
export class methodNotAllowedError extends AppError {
  export;
  constructor(details) {
    super("Method not allowed error", 405, "METHOD_NOT_ALLOWED");
    this.details = details;
  }
}
