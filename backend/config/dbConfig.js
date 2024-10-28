const odbc = require('odbc');

const connectionString = 'DRIVER={ODBC Driver 17 for SQL Server};SERVER=DESKTOP-UI47VET\\SQL2019;DATABASE=Production;UID=sa;PWD=sa123';

async function connectDB() {
  try {
    const connection = await odbc.connect(connectionString);
    return connection;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

module.exports = connectDB;
