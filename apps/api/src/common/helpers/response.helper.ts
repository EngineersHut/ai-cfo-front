export class ResponseHelper {
  static success(
    message: string,
    data: any = null,
  ) {
    return {
      success: true,
      message,
      data,
    };
  }

  static error(
    message: string,
    statusCode: number,
  ) {
    return {
      success: false,
      message,
      statusCode,
    };
  }
}