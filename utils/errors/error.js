class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}
class InsufficientStockError extends Error {
  constructor(message) {
    super(message);
    this.name = "InsufficientStockError";
    this.statusCode = 409;
  }
}

class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
    this.statusCode = 400;
  }
}
class RegisterError {
  constructor(field, message) {
    this.message = message;
    this.field = field;
    this.StatusCode = 401;
  }
}

class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthError";
    this.statusCode = 401;
  }
}
class SendEmailError extends Error {
  constructor(message) {
    super(message);
    this.name = "SendEmailError";
    this.statusCode = 500;
  }
}
class NetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = "NetworkError";
    this.statusCode = 500;
  }
}
class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = "ForbiddenError";
    this.statusCode = 403;
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
