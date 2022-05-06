import session, { SessionOptions } from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { sessionConfig } from './config/session.config';
import { connectDataSource, dataSource } from './config/dataSource.config';

dotenv.config();

const startServer = async () => {
  const app = await NestFactory.create(AppModule);

  // set session and passport local strategy
  app.use(session(sessionConfig as SessionOptions));
  app.use(passport.initialize());
  app.use(passport.session());

  // use of promise.all to boost up the performance
  await Promise.all([
    app.listen(process.env.PORT || 3001),
    connectDataSource(),
  ]);
  console.log(`Server has started on the URL: ${await app.getUrl()}`);
};

startServer();
