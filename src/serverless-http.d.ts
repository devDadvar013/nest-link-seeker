declare module 'serverless-http' {
  import { Request, Response, NextFunction } from 'express';

  interface ServerlessHttpOptions {
    binary?: string[] | ((request: Request) => boolean);
    request?: (request: Request) => void;
    response?: (response: Response) => void;
  }

  function serverless<T>(
    app: T,
    options?: ServerlessHttpOptions,
  ): (req: Request, res: Response, next?: NextFunction) => Promise<void>;

  export default serverless;
}
