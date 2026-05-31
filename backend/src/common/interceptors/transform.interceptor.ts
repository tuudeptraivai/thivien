import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface PaginatedResponse<T> {
  success: boolean;
  meta?: {
    total_records: number;
    total_pages: number;
    current_page: number;
    limit: number;
  };
  data: T;
  message?: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, PaginatedResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<PaginatedResponse<T>> {
    return next.handle().pipe(
      map((response) => {
        if (response && typeof response === 'object' && 'success' in response) {
          return response;
        }
        return {
          success: true,
          data: response,
        };
      }),
    );
  }
}
