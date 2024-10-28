const connectDB = require("../config/dbConfig");

const getAllCategories = async () => {
try {
  const connection = await connectDB();

  const query = `
    SELECT 
      child.id,
      child.category_name, 
      parent.category_name AS parent_category_name,
      child.description
    FROM 
      all_categories AS child
    LEFT JOIN 
      all_categories AS parent
    ON 
      child.parent_id = parent.id;
  `;


  const result = await connection.query(query);


  await connection.close();

  return result;
} catch (error) {
  console.error("Error executing the SQL statement:", error);
  throw error;
}
};

const getParentCategories = async () => {
  try {
    const connection = await connectDB();
    const query = `
      SELECT 
        id, 
        category_name
      FROM 
        all_categories
      WHERE 
        parent_id IS NULL;
    `;
    const result = await connection.query(query);
    await connection.close();
    return result;
  } catch (error) {
    console.error("Error executing the SQL statement:", error);
    throw error;
  }
};

const getCategoriesById = async (categoriesId) => {
  const connection = await connectDB();
  const query = `
        SELECT category_name, parent_id,description FROM all_categories WHERE id = ? `;

  try {
    const result = await connection.query(query, [categoriesId]);
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

const createCategory = async (categoryData) => {
  const { category_name, parent_category_name, description } = categoryData;

  try {
    const connection = await connectDB();

    const parentId = parent_category_name ? parseInt(parent_category_name) : null;

    const query = `
      INSERT INTO all_categories (category_name, parent_id, description)
      VALUES (?, ?, ?);
    `;
    await connection.query(query, [category_name, parentId, description]);

    await connection.close();
  } catch (error) {
    console.error("Error executing the SQL statement:", error);
    throw error;
  }
};

const updateCategory = async (categoriesId, categoriesUpdate) => {
  const connection = await connectDB();
  
  const query = `
    UPDATE all_categories
    SET category_name = ?, parent_id = ?, description = ?
    WHERE id = ?
  `;

  const values = [
    categoriesUpdate.category_name,
    categoriesUpdate.parent_id, 
    categoriesUpdate.description,
    categoriesId,
  ];

  try {
    const result = await connection.query(query, values);
    console.log("Query Result:", result);

    const rowsAffected = result?.rowsAffected ? result.rowsAffected : result.affectedRows || 0;
    console.log("Rows affected:", rowsAffected);

    if (rowsAffected > 0) {
      console.log("Category updated successfully.");
      return true;
    } else {
      console.log("No category found to update.");
      return false;
    }
  } catch (error) {
    console.error("Error updating category:", error);
    throw new Error("Failed to update category.");
  } finally {
    await connection.close();
  }
};

const deleteCategory = async (id) => {
  const connection = await connectDB();
  const query = 'DELETE FROM all_categories WHERE id = ?';
  const result = await connection.query(query, [id]);
  await connection.close();
  return result;
};


module.exports = {
  getAllCategories,
  getCategoriesById,
  createCategory,
  getParentCategories,
  updateCategory,
  deleteCategory
};
