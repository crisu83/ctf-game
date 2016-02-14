import Chance from 'chance';
import winston from 'winston';

export const chance = new Chance();

export const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    // new (winston.transports.File)({filename: 'server.log'})
  ]
});
