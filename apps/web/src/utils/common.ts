export function getErrorMessage(error: any) {
  const data = error?.response?.data;
  const errorMessage = data?.developer_errors?.[0]?.display_error || data?.message || 'Something went wrong!';
  if (Array.isArray(errorMessage)) return errorMessage[0];
  return errorMessage;
}


export function getImageUrl(filepath: string | undefined | null): string | undefined {
  if (!filepath) return undefined;
  if (filepath.startsWith('data:image') || filepath.startsWith('blob:') || filepath.startsWith('http')) {
    return filepath;
  }

  let BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
 

  const imageUrl = `${BASE_URL}/${filepath}`.trim();
  return imageUrl;
}