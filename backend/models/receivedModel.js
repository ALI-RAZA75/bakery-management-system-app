const connectDB = require("../config/dbConfig");

const getAllReceived = async () => {
  try {
    const connection = await connectDB();
    const query = `
      SELECT id, dmdID, userID, categoryID, productID, quantity, quantityReceived, remainingquantity, demandDate, receivedDate
      FROM received;
    `;
    const result = await connection.query(query);
    await connection.close();
    return result;
  } catch (error) {
    console.error("Error fetching received records:", error);
    throw error;
  }
};

// const getAllReceived = async () => {
//   try {
//     const connection = await connectDB();
//     const query = `
//       WITH AggregatedData AS (
//           SELECT 
//               MIN(id) AS id,        -- Get the minimum ID for each group
//               dmdID, 
//               productID, 
//               SUM(quantityReceived) AS totalReceived
//           FROM 
//               received
//           GROUP BY 
//               dmdID, 
//               productID
//       )
//       SELECT 
//           id,
//           dmdID, 
//           productID, 
//           totalReceived
//       FROM 
//           AggregatedData
//       ORDER BY 
//           id;  -- Now order by the ID
//     `;
//     const result = await connection.query(query);
//     await connection.close();

//     const summarizedData = result.map((row) => ({
//       id: row.id,
//       dmdID: row.dmdID,
//       productID: row.productID,
//       totalReceived: row.totalReceived || 0,
//     }));

//     return summarizedData;
//   } catch (error) {
//     console.error("Error fetching summarized received data:", error);
//     throw error;
//   }
// };

// const getAllReceived = async () => {
//   try {
//     const connection = await connectDB();
//     const query = `
//       SELECT dmdID, productID, SUM(quantityReceived) AS totalReceived
//       FROM received
//       GROUP BY dmdID, productID
//       ORDER BY
//       id;
//     `;
//     const result = await connection.query(query);
//     await connection.close();

//     const summarizedData = result.map((row) => ({
//       dmdID: row.dmdID,
//       productID: row.productID,
//       totalReceived: row.totalReceived || 0,
//     }));

//     return summarizedData;
//   } catch (error) {
//     console.error("Error fetching summarized received data:", error);
//     throw error;
//   }
// };

const getReceivedById = async (id) => {
  try {
    const connection = await connectDB();
    const query = `
      SELECT id, dmdID, userID, categoryID, productID, quantity, quantityReceived, remainingquantity, demandDate, receivedDate
      FROM received
      WHERE id = ?;
    `;
    const result = await connection.query(query, [id]);
    await connection.close();
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Error fetching received by ID:", error);
    throw error;
  }
};

const getTotalReceivedByDmdIdProductId = async (dmdID, productID) => {
  try {
    const connection = await connectDB();
    const query = `
      SELECT SUM(quantityReceived) as totalReceived
      FROM received
      WHERE productID = ?;
    `; 
    const result = await connection.query(query, [dmdID, productID]);
    await connection.close();

    const totalReceived = result.length > 0 ? result[0].totalReceived || 0 : 0;
    return totalReceived;
  } catch (error) {
    console.error(
      "Error fetching total received quantity for productID:",
      error
    );
    throw error;
  }
};

const getTotalReceivedByProductId = async (productID) => {
  try {
    const connection = await connectDB();
    const query = `
      SELECT SUM(quantityReceived) as totalReceived
      FROM received
      WHERE productID = ?;
    `; 
    const result = await connection.query(query, [productID]);
    await connection.close();

    const totalReceived = result.length > 0 ? result[0].totalReceived || 0 : 0;
    return totalReceived;
  } catch (error) {
    console.error(
      "Error fetching total received quantity for productID:",
      error
    );
    throw error;
  }
};


// const getTotalReceivedByDmdIdAndProductIds = async ( productID) => {
//   try {
//     const connection = await connectDB();
//     const query = `
//       SELECT SUM(quantityReceived) as totalReceived
//       FROM received
//       WHERE dmdID = ? AND productID = ?;
//     `;
//     const result = await connection.query(query, [ productID]);
//     await connection.close();

//     // Extract the total received quantity
//     const totalReceived = result.length > 0 ? result[0].totalReceived || 0 : 0;
//     return totalReceived;
//   } catch (error) {
//     console.error(
//       "Error fetching total received quantity for dmdID and productID:",
//       error
//     );
//     throw error;
//   }
// };

// const getSumOfReceivedByDmdIdAndProductId = async (dmdID) => {
//   try {
//     const connection = await connectDB();
//     const query = `
//       SELECT productID, SUM(quantityReceived) as totalReceived
// FROM received
// GROUP BY productID;
//     `;
//     const result = await connection.query(query, [dmdID]);
//     await connection.close();

//     const totals = result.map((row) => ({
//       productID: row.productID,
//       totalReceived: row.totalReceived || 0,
//     }));

//     return totals;
//   } catch (error) {
//     console.error(
//       "Error fetching sum of received quantities for dmdID:",
//       error
//     );
//     throw error;
//   }
// };

// const getSumOfReceivedByDmdIdAndProductId = async (dmdID, productID) => {
//   let connection;
//   try {
//     connection = await connectDB();

//     const query = `
//       SELECT SUM(quantityReceived) AS totalReceived
//       FROM received
//       WHERE dmdID = @dmdID AND productID = @productID;
//     `;

//     console.log('Executing query with parameters:', { dmdID, productID });

//     const result = await connection.query(query, {
//       dmdID: dmdID,
//       productID: productID,
//     });

//     if (!result || !Array.isArray(result) || result.length === 0) {
//       console.error("No results found for dmdID:", dmdID, "and productID:", productID);
//       return 0;
//     }

//     const totalReceived = result[0].totalReceived !== null ? result[0].totalReceived : 0;
//     return totalReceived;
//   } catch (error) {
//     console.error("Error executing SQL statement:", error);
//     throw error;
//   } finally {
//     if (connection) {
//       await connection.close();
//     }
//   }
// };

const getReceivedByDmdId = async (dmdID) => {
  try {
    const connection = await connectDB();

    // Fetch the demand and remaining quantity from the table
    const query = `
      SELECT id, dmdID, userID, categoryID, productID, quantity, quantityReceived, remainingquantity, demandDate, receivedDate
      FROM received
      WHERE dmdID = ?;
    `;
    const result = await connection.query(query, [dmdID]);
    await connection.close();

    if (result.length > 0) {
      // Directly return the result with stored remaining quantity
      const demand = result[0];
      return demand;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching received by dmdID:", error);
    throw error;
  }
};

const addReceived = async (receivedData) => {
  console.log("Received data:", receivedData);

  if (!Array.isArray(receivedData)) {
    throw new Error("receivedData must be an array.");
  }

  const connection = await connectDB();

  const query = `
    INSERT INTO received (dmdID, userID, categoryID, productID, quantity, quantityReceived, remainingquantity, demandDate, receivedDate)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;

  try {
    for (const product of receivedData) {
      const {
        dmdID,
        userID,
        categoryID,
        productID,
        quantity,
        quantityReceived,
        remainingquantity,
        demandDate,
        receivedDate,
      } = product;

      const demandDateFormatted =
        demandDate && !isNaN(Date.parse(demandDate))
          ? new Date(demandDate).toISOString().split("T")[0]
          : null;

      const receivedDateFormatted =
        receivedDate && !isNaN(Date.parse(receivedDate))
          ? new Date(receivedDate).toISOString().split("T")[0]
          : null;

      const values = [
        dmdID,
        Number(userID),
        Number(categoryID),
        Number(productID),
        quantity,
        quantityReceived,
        remainingquantity,
        demandDateFormatted,
        receivedDateFormatted,
      ];

      try {
        await connection.query(query, values);
        console.log(
          "Received record added successfully for product ID:",
          product.productID
        );
      } catch (error) {
        console.error(
          "Error adding received record for product ID:",
          product.productID,
          error
        );
      }
    }
  } catch (error) {
    console.error("Error adding received record:", error);
    throw new Error("Error adding received record: " + error.message);
  } finally {
    await connection.close();
  }
};

// const updateReceived = async (id, receivedData) => {
//   const { dmdID, userID, categoryID, productID, quantity, quantityReceived, remainingquantity, demandDate, receivedDate } = receivedData;

//   const userIDNumber = parseInt(userID, 10);
//   const categoryIDNumber = parseInt(categoryID, 10);
//   const productIDNumber = parseInt(productID, 10);

//   const demandDateFormatted = new Date(demandDate).toISOString().split('T')[0];
//   const receivedDateFormatted = new Date(receivedDate).toISOString().split('T')[0];

//   try {
//     const connection = await connectDB();
//     const query = `
//       UPDATE received
//       SET dmdID = ?, userID = ?, categoryID = ?, productID = ?, quantity = ?, quantityReceived = ?, remainingquantity = ?, demandDate = ?, receivedDate = ?
//       WHERE id = ?;
//     `;
//     const result = await connection.query(query, [
//       dmdID,
//       userIDNumber,
//       categoryIDNumber,
//       productIDNumber,
//       quantity,
//       quantityReceived,
//       remainingquantity,
//       demandDateFormatted,
//       receivedDateFormatted,
//       id
//     ]);

//     await connection.close();

//     if (result) {
//       return { success: true, message: 'Record updated successfully' };
//     } else {
//       return { success: false, message: 'No record found with the provided ID' };
//     }

//   } catch (error) {
//     console.error("Error updating received record:", error);
//     throw new Error('Failed to update received record');
//   }
// };

// const updateReceived = async (id, receivedData) => {
//   console.log("Updating received data:", receivedData);

//   const [dmdID, userID, categoryID, productID] = id.split(':');

//   const connection = await connectDB();

//   const query = `
//     UPDATE received
//     SET quantity = ?, quantityReceived = ?, remainingquantity = ?, demandDate = ?, receivedDate = ?
//     WHERE dmdID = ? AND userID = ? AND categoryID = ? AND productID = ?;
//   `;

//   const values = [
//     receivedData.quantity,
//     receivedData.quantityReceived,
//     receivedData.remainingquantity,
//     receivedData.demandDate,
//     receivedData.receivedDate,
//     dmdID,
//     userID,
//     categoryID,
//     productID
//   ];

//   try {
//     const result = await connection.query(query, values);
//     return result.affectedRows > 0;
//   } catch (error) {
//     console.error("Error updating received record:", error);
//     throw new Error('Error updating received record: ' + error.message);
//   } finally {
//     await connection.close();
//   }
// };

const updateReceived = async (id, receivedData) => {
  console.log("Updating received data:", receivedData);

  const [dmdID, userID, categoryID, productID] = id.split(":");
  const connection = await connectDB();

  const query = `
    UPDATE received 
    SET quantity = ?, 
        quantityReceived = quantityReceived + ?, 
        remainingquantity = ?, 
        demandDate = ?, 
        receivedDate = ?
    WHERE dmdID = ? AND userID = ? AND categoryID = ? AND productID = ?;
  `;

  const values = [
    parseInt(receivedData.quantity, 10),
    parseInt(receivedData.quantityReceived, 10),
    receivedData.remainingquantity,
    receivedData.demandDate,
    receivedData.receivedDate,
    dmdID,
    parseInt(userID, 10),
    parseInt(categoryID, 10),
    parseInt(productID, 10),
  ];

  try {
    console.log("SQL Query Values:", values); // Debug output
    const result = await connection.query(query, values);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error updating received record:", error);
    throw new Error("Error updating received record: " + error.message);
  } finally {
    await connection.close();
  }
};

const checkReceived = async (criteria) => {
  try {
    const connection = await connectDB();

    // Assuming criteria could be an object containing the dmdID and other parameters
    const query = `
      SELECT id, dmdID, userID, categoryID, productID, quantity, quantityReceived, remainingquantity, demandDate, receivedDate
      FROM received
      WHERE dmdID = ? AND productID = ?;
    `;

    const values = [criteria.dmdID, criteria.productID];

    const result = await connection.query(query, values);
    await connection.close();

    return result.length > 0 ? result : null; // Returns records if found
  } catch (error) {
    console.error("Error checking received records:", error);
    throw error;
  }
};

// Example of how to use checkReceived in your code
const checkReceivedByDmdIdAndProductId = async (dmdID, productID) => {
  return await checkReceived({ dmdID, productID });
};

const deleteReceived = async (id) => {
  try {
    const connection = await connectDB();
    const query = `DELETE FROM received WHERE id = ?;`;
    const result = await connection.query(query, [id]);
    await connection.close();
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error deleting received record:", error);
    throw error;
  }
};

module.exports = {
  getAllReceived,
  getReceivedById,
  getReceivedByDmdId,
  // getSumOfReceivedByDmdIdAndProductId,
  getTotalReceivedByProductId,
  addReceived,
  updateReceived,
  deleteReceived,
  checkReceived,
  checkReceivedByDmdIdAndProductId,
};
