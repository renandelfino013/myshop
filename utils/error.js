class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
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

export {
  NotFoundError,
  ValidationError,
  AuthError,
  SendEmailError,
  NetworkError,
};
