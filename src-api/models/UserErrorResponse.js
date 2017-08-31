function UserErrorResponse(message) {
  return {
    'message' : message
  }
}

export default function (message) {
  return new UserErrorResponse(message);
}