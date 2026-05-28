export function getErrorMessage(error: any) {
  const data = error?.response?.data;
  const errorMessage = data?.developer_errors?.[0]?.display_error || data?.message || 'Something went wrong!';
  if (Array.isArray(errorMessage)) return errorMessage[0];
  return errorMessage;
}