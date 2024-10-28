const connectDB = require("../config/dbConfig");

const getAllUserRole = async () => {
  const connection = await connectDB();
  const query = "SELECT * FROM user_role";
  const result = await connection.query(query);
  await connection.close();
  return result.rows ? result.rows : result;
};

const getUserRoleById = async (userRoleId) => {
  const connection = await connectDB();
  const query = `
      SELECT userRole, accessLevels FROM user_role WHERE id = ? `;

  try {
    const result = await connection.query(query, [userRoleId]);
    if (result.length > 0) {
      console.log("User Role found:", result[0]);
      return result[0];
    } else {
      console.log("User Role not found....");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user Role:", error);
  } finally {
    await connection.close();
  }
};

const createUserRole = async (userRole) => {
  const connection = await connectDB();
  const query = `
  INSERT INTO user_role (userRole, accessLevels)
  VALUES (?, ?)
`;

  const values = [
    userRole.userRole,
    JSON.stringify(userRole.accessLevels),
  ];

  try {
    await connection.query(query, values);
    console.log("User Role inserted successfully.");
  } catch (error) {
    console.error("Error inserting user Role:", error);
  } finally {
    await connection.close();
  }
};

const updateUserRole = async (userRoleId, userRoleUpdates) => {
  const connection = await connectDB();
  const query = `
      UPDATE user_role
      SET userRole = ?, accessLevels = ?
      WHERE id = ?
    `;

  const values = [
    userRoleUpdates.userRole,
    userRoleUpdates.accessLevels,
    userRoleId,
  ];

  try {
    const result = await connection.query(query, values);
    console.log("Query Result:", result);

    const rowsAffected =
      result && result.rowsAffected
        ? result.rowsAffected
        : result.affectedRows || 0;
    console.log("Rows affected:", rowsAffected);

    if (rowsAffected > 0) {
      console.log("User Role updated successfully.");
      return true;
    }
  } finally {
    await connection.close();
  }
};

const deleteUserRole = async (id) => {
  const connection = await connectDB();
  const query = 'DELETE FROM user_role WHERE id = ?';
  const result = await connection.query(query, [id]);
  await connection.close();
  return result;
};

module.exports = {
  getAllUserRole,
  getUserRoleById,
  createUserRole,
  updateUserRole,
  deleteUserRole,
  };