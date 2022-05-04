import { DataSource } from 'typeorm';
import { PostgresDataSource } from './database.config';

export const dataSource = new DataSource(PostgresDataSource);
