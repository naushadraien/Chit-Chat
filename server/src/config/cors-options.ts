import { allowedOrigins } from './allowedOrigin';

export const corsOptions = {
  origin: (
    origin: string,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    //when using server to server request like server action in the next js, the origin will be undefined and then allow to access the resource but when pass the origin in the request header the origin can't be undefined and if this is not in the allowed origins array the request is blocked by cors
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      // If the origin is in the allowedOrigins array or the origin is falsy (null, undefined, or an empty string), allow the request
      callback(null, true);
    } else {
      // If the origin is not in the allowedOrigins array and the origin is not falsy, block the request
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
};
