import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Đã xảy ra lỗi hệ thống';
    let code = 'INTERNAL_SERVER_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exResponse = exception.getResponse() as any;
      message = typeof exResponse === 'string'
        ? exResponse
        : exResponse.message || message;
      code = exResponse.error || exception.constructor.name;
    } else {
      this.logger.error(exception);
    }

    response.status(status).json({
      success: false,
      error: {
        code,
        message: Array.isArray(message) ? message.join(', ') : message,
        path: request.url,
        timestamp: new Date().toISOString(),
      },
    });
  }
}
