import { DataSource } from 'typeorm';
import { PostgresDataSource } from './database.config';

export const dataSource = new DataSource(PostgresDataSource);

export const connectDataSource = async () => {
  try {
    await dataSource.initialize();
    console.log('Database has been initialized!');
  } catch (err) {
    console.error('Error during Database initialization', err);
  }
};
