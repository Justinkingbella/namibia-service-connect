
export * from './auth';
export * from './service';
export * from './booking';
export * from './payment';
export * from './subscription';

export interface IResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
