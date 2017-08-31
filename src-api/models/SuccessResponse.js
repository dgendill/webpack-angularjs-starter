function SuccessResponse(data) {
  return {
    'response' : data,
    'message' : ''
  }
}

export default function (data) {
  return new SuccessResponse(data);
}