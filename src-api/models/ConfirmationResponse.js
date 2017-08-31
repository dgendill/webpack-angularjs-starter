function ConfirmationResponse(message) {
  return {
    'message' : message
  }
}

export default function (message) {
  return new ConfirmationResponse(message);
}