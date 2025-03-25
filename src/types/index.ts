
export * from './auth';
export * from './service';
export * from './booking';

export interface IResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
