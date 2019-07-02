class ErrorHandler {
  static createErrorResponse(statusCode, message) {
    return {
      statusCode: statusCode || 501,
      headers: { 'Content-Type': 'text/plain' },
      body: message || 'Unknown Error'
    };
  }
}

module.exports = ErrorHandler;