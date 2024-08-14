import { Request, Response, NextFunction } from 'express';

export function loggingHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logging.log(`
    Incoming ------------------
    Request: ${req.method} ${req.url} ${req.socket.remoteAddress}
    ${
      ''
      // Headers: ${JSON.stringify(req.headers)}
      // Body: ${JSON.stringify(req.body)}
    }
    ----------------------------`);
  res.on('finish', () => {
    logging.log(`
    Incoming ------------------
    Request: ${req.method} ${req.url} ${req.socket.remoteAddress}
    Status: ${res.statusCode}
    ${
      ''
      // Headers: ${JSON.stringify(req.headers)}
      // Body: ${JSON.stringify(req.body)}
    }
    ----------------------------`);
  });

  next();
}
