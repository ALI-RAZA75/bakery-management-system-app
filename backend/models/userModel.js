const connectDB = require("../config/dbConfig");

const getAllUsers = async () => {
  const connection = await connectDB();
  const query = "SELECT * FROM users";
  const result = await connection.query(query);
  await connection.close();
  return result.rows ? result.rows : result;
};

const getUserById = async (userId) => {
  const connection = await connectDB();
  const query = `
      SELECT firstName, lastName, email, password, role, contactNumber, remarks
      FROM users
      WHERE id = ?
    `;

  try {
    const result = await connection.query(query, [userId]);
    if (result.length > 0) {
      console.log("User found:", result[0]);
      return result[0];
    } else {
      console.log("User not found....");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  } finally {
    await connection.close();
  }
};

const createUser = async (user) => {
  const connection = await connectDB();
  const query = `
  INSERT INTO users (firstName, lastName, email, password, role, contactNumber, remarks)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`;

  const values = [
    user.firstName,
    user.lastName,
    user.email,
    user.password,
    user.role,
    user.contactNumber,
    user.remarks,
  ];

  try {
    await connection.query(query, values);
    console.log("User inserted successfully.");
  } catch (error) {
    console.error("Error inserting user:", error);
  } finally {
    await connection.close();
  }
};

const updateUser = async (userId, userUpdates) => {
  const connection = await connectDB();
  const query = `
      UPDATE users
      SET firstName = ?, lastName = ?, email = ?, password = ?, role = ?, contactNumber = ?, remarks = ?
      WHERE id = ?
    `;

  const values = [
    userUpdates.firstName,
    userUpdates.lastName,
    userUpdates.email,
    userUpdates.password,
    userUpdates.role,
    userUpdates.contactNumber,
    userUpdates.remarks,
    userId,
  ];

  console.log("Received userId:", userId);
  console.log("SQL Query:", query);
  console.log("Values:", values);

  try {
    const result = await connection.query(query, values);
    console.log("Query Result:", result);

    const rowsAffected =
      result && result.rowsAffected
        ? result.rowsAffected
        : result.affectedRows || 0;
    console.log("Rows affected:", rowsAffected);

    if (rowsAffected > 0) {
      console.log("User updated successfully.");
      return true;
    }
  } finally {
    await connection.close();
  }
};



  const deleteUser = async (id) => {
    const connection = await connectDB();
    const query = 'DELETE FROM users WHERE id = ?';
    const result = await connection.query(query, [id]);
    await connection.close();
    return result;
  };
module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
