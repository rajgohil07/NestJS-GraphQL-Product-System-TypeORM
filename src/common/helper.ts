import crypto from 'crypto';
import { BadRequestException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { constant } from './constant';

dotenv.config();

export interface IGenerateToken {
  ID: number;
  Name: string;
  Email: string;
}

const hashPassword = (plainPassword: string) =>
  bcrypt.hash(plainPassword, constant.HASH_SALT_COUNT);

const comparePassword = (plainPassword: string, hasPassword: string) =>
  bcrypt.compare(plainPassword, hasPassword);

/* 
   manual validation due to below issue 
   reference https://github.com/nestjs/passport/issues/129 
*/
const emailAndPasswordValidation = (email: string, password: string) => {
  // validate email
  const emailRegex =
    /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
  const emailValidationResult = emailRegex.test(email);
  if (!emailValidationResult) {
    throw new BadRequestException(constant.INVALID_EMAIL_FORMAT);
  }
  // manual password validation
  const passwordRegex =
    /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&? "])[a-zA-Z0-9!#$%&?]{8,16}$/;
  const passwordValidationResult = passwordRegex.test(password);
  if (!passwordValidationResult) {
    throw new BadRequestException(constant.WEAK_PASSWORD_MESSAGE);
  }
};

/*
    Generate random string for the TransactionID
*/
const GenerateTransactionID = () =>
  crypto.randomBytes(constant.TRANSACTION_ID_LENGTH).toString('hex');

export {
  hashPassword,
  comparePassword,
  emailAndPasswordValidation,
  GenerateTransactionID,
};
