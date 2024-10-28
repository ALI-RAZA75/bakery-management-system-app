import "./Categories.scss";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

function Categories() {
  const [value, setValue] = useState("1");
  const [parentCategoryName, setParentCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]); 
  const [error, setError] = useState(null);
  const [category_name, setCategory_name] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null); 

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:3001/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Error fetching categories");
    }
  };


  const fetchParentCategories = async () => {
    try {
      const response = await fetch("http://localhost:3001/categories/parent");
      if (!response.ok) {
        throw new Error("Failed to fetch parent categories");
      }
      const data = await response.json();
      setParentCategories(data);
    } catch (error) {
      console.error("Error fetching parent categories:", error);
      setError("Error fetching parent categories");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchParentCategories();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const categoryData = {
      category_name,
      parent_category_name: parentCategoryName,
      parent_id: parentCategoryName, 
      description,
    };

    try {
      let response;
      if (editMode) {
        
        response = await fetch(`http://localhost:3001/categories/${editCategoryId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(categoryData),
        });
      } else {
       
        response = await fetch("http://localhost:3001/categories/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(categoryData),
        });
      }

      if (!response.ok) {
        throw new Error(editMode ? "Failed to update category" : "Failed to add category");
      }

      setCategory_name("");
      setParentCategoryName("");
      setDescription("");
      setError(null);
      setEditMode(false); 
      setEditCategoryId(null); 
      setValue("1");

      alert(editMode ? "Category updated successfully" : "Category added successfully");
      fetchCategories(); 
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (category) => {
    setCategory_name(category.category_name);
    setParentCategoryName(category.parent_category_name || "");
    setDescription(category.description);
    setEditCategoryId(category.id); 
    setEditMode(true);
    setValue("2");
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/categories/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete category");
      }
      fetchCategories(); 
    } catch (err) {
      console.error("Error deleting category:", err);
      setError("Error deleting category");
    }
  };
  

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === "2" && !editMode) {
      setCategory_name("");
      setParentCategoryName("");
      setDescription("");
    }
  };

  return (
    <div className="categories">
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="Categories Tabs">
              <Tab className="tabHeading" label="Categories" value="1" />
              <Tab className="tabHeading" label={editMode ? "Edit Category" : "Add Categories"} value="2" />
            </TabList>
          </Box>
          <TabPanel className="tabPanel" value="1">
            <div className="categoriesTable">
              <table className="categoriesTable">
                <thead>
                  <tr>
                    <th className="tableHeader">Category Name</th>
                    <th className="tableHeader">Parent Category</th>
                    <th className="tableHeader">Description</th>
                    <th className="tableHeader">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <tr key={category.id}>
                        <td className="tableCell">{category.category_name}</td>
                        <td className={!category.parent_category_name ? "lightGrey" : "tableCell"}>{category.parent_category_name || "None"}</td>
                        <td className="tableCell">{category.description}</td>
                        <td className="tableCell">
                          <button className="editBtn" onClick={() => handleEdit(category)}>Edit</button>
                          <button className="deleteBtn" onClick={() => handleDelete(category.id)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="tableCell">
                        No categories found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabPanel>

          <TabPanel value="2">
            <form onSubmit={handleSubmit}>
              <div className="formDiv">
                <div className="formInnerDiv">
                  <label className="formLabel">Category Name</label>
                  <input
                    value={category_name}
                    onChange={(e) => setCategory_name(e.target.value)}
                    type="text"
                    className="formInput"
                  />
                </div>
                <div className="formInnerDiv">
                  <label className="formLabel">Parent Category</label>
                  <select
                    value={parentCategoryName}
                    onChange={(e) => setParentCategoryName(e.target.value)}
                    className="formInput"
                  >
                    <option value="">Select Parent Category</option>
                    {parentCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.category_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="formInnerDiv">
                  <label className="formLabel">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="formInput"
                  />
                </div>
              </div>
              {error && <p className="error">{error}</p>}
              <div className="submitBtnDiv">
                <button className="submitBtn" type="submit">
                  {editMode ? "Update Category" : "Submit"}
                </button>
              </div>
            </form>
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
}

export default Categories;
