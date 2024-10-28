const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const userRoleRoutes = require('./routes/userRoleRoutes');
const categories = require('./routes/categoriesRoutes');
const supplier = require('./routes/supplierRoutes');
const products = require('./routes/productsRoutes');
const demands = require('./routes/demandRoutes');
const received = require('./routes/receivedRoutes');
const issuance = require('./routes/issuanceRoutes')

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());


app.use('/users', userRoutes);
app.use('/users-roles', userRoleRoutes);
app.use('/categories', categories);
app.use('/suppliers', supplier);
app.use('/products', products);
app.use('/demands', demands);
app.use('/received', received);
app.use('/issuance', issuance);

app.listen(3001, () => {
  console.log('Server running on port 3001');
});



// const express = require('express');
// const odbc = require('odbc');
// const bodyParser = require('body-parser');
// const cors = require('cors');


// const app = express();
// app.use(express.json());
// app.use(cors());
// app.use(bodyParser.json());

// const connectionString = 'DRIVER={ODBC Driver 17 for SQL Server};SERVER=DESKTOP-UI47VET\\SQL2019;DATABASE=Production;UID=sa;PWD=sa123';

// app.get('/users', async (req, res) => {
//   try {
//     const connection = await odbc.connect(connectionString);
//     const query = 'SELECT [id], [firstName], [lastName], [email], [password], [role], [contactNumber], [remarks] FROM [Production].[dbo].[users]';
//     const result = await connection.query(query);
//     await connection.close();
//     res.status(200).json(result);
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     res.status(500).json({ message: 'Error fetching users' });
//   }
// });


// app.listen(3001, () => {
//   console.log('Server running on port 3001');
// });
