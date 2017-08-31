function UserErrorResponse(userMessage, debugMessage) {
  return {
    'message' : userMessage,
    'debug' : debugMessage
  }
}

export default function (message, debugMessage) {
  return new UserErrorResponse(message, debugMessage);
}