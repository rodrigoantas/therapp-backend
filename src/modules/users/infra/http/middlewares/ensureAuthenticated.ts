import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';

interface ITokenPayLoad {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  // validação do token JWT, pelo header

  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }
  // a virgula antes determina que nao vamos usar a primeira variavel
  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub } = decoded as ITokenPayLoad;

    request.user = {
      id: sub,
    };
    // id do usuario disponível para as outras requisições, para saber quem ta marcando appointments e o que listar

    return next();
  } catch (err) {
    throw new AppError('Invalid JWT token', 401);
  }
}
