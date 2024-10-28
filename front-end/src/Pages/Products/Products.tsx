import { useEffect, useState } from "react";
import "./Products.scss";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../Components/dataTable/DataTable";

function Products() {
  const [value, setValue] = useState("1");
  const [itemCode, setItemCode] = useState<number | "">(0);
  const [barCode, setBarCode] = useState<string>("");
  const [boxBarCode, setBoxBarCode] = useState<string>("");
  const [itemName, setItemName] = useState<string>("");
  const [supplierName, setSupplierName] = useState<number | "">(0);
  const [category, setCategory] = useState<number | "">(0);
  const [parentCategory, setParentCategory] = useState<number | "">(0);
  const [boxQuantity, setBoxQuantity] = useState<number | "">(0);
  const [quantity, setQuantity] = useState<number | "">(0);
  const [unit, setUnit] = useState<string>("");
  const [accountHead, setAccountHead] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [costPerUnit, setCostPerUnit] = useState<number | "">(0);
  const [expirationDate, setExpirationDate] = useState<string>("");
  const [StockKeepingUnit, setStockKeepingUnit] = useState<number | "">(0);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [parentCategories, setParentCategories] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<any>({});

  const [editingProduct, setEditingProduct] = useState<any>(null);

  const fetchData = async (url: string, setter: (data: any) => void) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch from ${url}`);
      const data = await response.json();
      setter(data);
    } catch (error) {
      console.error(error);
      setError(`Unable to load data. Please try again later.`);
    }
  };

  useEffect(() => {
    fetchData("http://localhost:3001/products", setProducts);
    fetchData("http://localhost:3001/categories", setCategories);
    fetchData("http://localhost:3001/categories/parent", setParentCategories);
    fetchData("http://localhost:3001/suppliers", setSuppliers);
  }, []);

  const validateForm = () => {
    const errors: any = {};

    if (!itemCode || isNaN(itemCode))
      errors.itemCode = "Item Code is required and must be a number.";
    if (!barCode) errors.barCode = "Bar Code is required.";
    if (!boxBarCode) errors.boxBarCode = "Box Bar Code is required.";
    if (!itemName) errors.itemName = "Item Name is required.";
    if (!supplierName || isNaN(supplierName))
      errors.supplierName = "Supplier Name is required and must be a number.";
    if (!category || isNaN(category))
      errors.category = "Category is required and must be a number.";
    if (!parentCategory || isNaN(parentCategory))
      errors.parentCategory =
        "Parent Category is required and must be a number.";
    if (!boxQuantity || isNaN(boxQuantity))
      errors.boxQuantity = "Box Quantity is required and must be a number.";
    if (!quantity || isNaN(quantity))
      errors.quantity = "Quantity is required and must be a number.";

    if (!accountHead) errors.accountHead = "Account Head is required.";
    if (!date) errors.date = "Date is required.";
    if (!costPerUnit || isNaN(costPerUnit))
      errors.costPerUnit = "Cost Per Unit is required and must be a number.";
    if (!expirationDate) errors.expirationDate = "Expiration Date is required.";
    if (!StockKeepingUnit || isNaN(StockKeepingUnit))
      errors.StockKeepingUnit =
        "Stock Keeping Unit is required and must be a number.";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const productData = {
      itemCode,
      barCode,
      boxBarCode,
      itemName,
      supplierName,
      category,
      parentCategory,
      boxQuantity,
      quantity,
      unit,
      accountHead,
      date,
      costPerUnit,
      expirationDate,
      StockKeepingUnit,
    };

    console.log("Submitting product data:", productData);

    try {
      const response = await fetch("http://localhost:3001/products/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add product: ${errorText}`);
      }

      setItemCode(0);
      setBarCode("");
      setBoxBarCode("");
      setItemName("");
      setSupplierName(0);
      setCategory(0);
      setParentCategory(0);
      setBoxQuantity(0);
      setQuantity(0);
      setUnit("");
      setAccountHead("");
      setDate("");
      setCostPerUnit(0);
      setExpirationDate("");
      setStockKeepingUnit(0);
      fetchData("http://localhost:3001/products", setProducts);
      setValue("1");

      alert("Product added successfully");
    } catch (err) {
      console.error("Error adding product:", err);
      setError(err.message);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const updatedProductData = {
      itemCode,
      barCode,
      boxBarCode,
      itemName,
      supplierName,
      category,
      parentCategory,
      boxQuantity,
      quantity,
      unit,
      accountHead,
      date,
      costPerUnit,
      expirationDate,
      StockKeepingUnit,
    };

    try {
      const response = await fetch(
        `http://localhost:3001/products/${editingProduct.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProductData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update product: ${errorText}`);
      }
      fetchData("http://localhost:3001/products", setProducts);
      setValue("1");
      setEditingProduct(null);
      setItemCode(0);
      setBarCode("");
      setBoxBarCode("");
      setItemName("");
      setSupplierName(0);
      setCategory(0);
      setParentCategory(0);
      setBoxQuantity(0);
      setQuantity(0);
      setUnit("");
      setAccountHead("");
      setDate("");
      setCostPerUnit(0);
      setExpirationDate("");
      setStockKeepingUnit(0);

      alert("Product updated successfully");
    } catch (err) {
      console.error("Error updating product:", err);
      setError(err.message);
    }
  };

  const getSupplierName = (id: number) => {
    const supplier = suppliers.find((sup) => sup.id === id);
    return supplier ? supplier.supplierName : "Unknown Supplier";
  };

  const getCategoryName = (id: number) => {
    const category = categories.find((cat) => cat.id === id);
    return category ? category.category_name : "Unknown Category";
  };

  const getParentCategoryName = (id: number) => {
    const parentCategory = parentCategories.find((parent) => parent.id === id);
    return parentCategory ? parentCategory.category_name : "No Parent Category";
  };

  const mappedProducts = products.map((product) => ({
    ...product,
    supplierName: getSupplierName(product.supplierName),
    category: getCategoryName(product.category),
    parentCategory: getParentCategoryName(product.parentCategory),
  }));

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setItemCode(product.itemCode);
    setBarCode(product.barCode);
    setBoxBarCode(product.boxBarCode);
    setItemName(product.itemName);
    setSupplierName(product.supplierName);
    setCategory(product.category);
    setParentCategory(product.parentCategory);
    setBoxQuantity(product.boxQuantity);
    setQuantity(product.quantity);
    setUnit(product.unit);
    setAccountHead(product.accountHead);
    setDate(product.date);
    setCostPerUnit(product.costPerUnit);
    setExpirationDate(product.expirationDate);
    setStockKeepingUnit(product.StockKeepingUnit);
    setValue("2");
  };

  const resetForm = () => {
    setItemCode(0);
    setBarCode("");
    setBoxBarCode("");
    setItemName("");
    setSupplierName(0);
    setCategory(0);
    setParentCategory(0);
    setBoxQuantity(0);
    setQuantity(0);
    setUnit(0);
    setAccountHead("");
    setDate("");
    setCostPerUnit(0);
    setExpirationDate("");
    setStockKeepingUnit(0);
    setEditingProduct(null);
    setValue("1");
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3001/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete product: ${errorText}`);
      }

      setProducts(products.filter((product) => product.id !== id));
      alert("Product deleted successfully");
    } catch (err) {
      console.error("Error deleting product:", err);
      setError(err.message);
    }
  };

  const columns: GridColDef[] = [
    { field: "itemCode", headerName: "item code", width: 100 },
    { field: "barCode", headerName: "Bar Code", width: 100 },
    { field: "boxBarCode", headerName: "Box BarCode", width: 100 },
    { field: "itemName", headerName: "Item Name", width: 150 },
    { field: "supplierName", headerName: "Supplier", width: 150 },
    { field: "category", headerName: "Category", width: 150 },
    { field: "parentCategory", headerName: "Parent Category", width: 150 },
    { field: "boxQuantity", headerName: "Box Quantity", width: 50 },
    { field: "quantity", headerName: "Quantity", width: 50 },
    { field: "unit", headerName: "Unit", width: 50 },
    { field: "accountHead", headerName: "Account Head", width: 150 },
    { field: "date", headerName: "Date", width: 100 },
    { field: "costPerUnit", headerName: "Cost Per Unit", width: 50 },
    { field: "expirationDate", headerName: "Expiration Date", width: 100 },
    { field: "StockKeepingUnit", headerName: "SKU", width: 50 },
    {
      field: "actions",
      headerName: "Actions",

      width: 150,
      renderCell: (params) => (
        <div>
          <button className="editBtn" onClick={() => handleEdit(params.row)}>
            Edit
          </button>
          <button
            className="deleteBtn"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="products">
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={(e, newValue) => setValue(newValue)}
              aria-label="lab API tabs example"
            >
              <Tab label="Products List" value="1" />
              <Tab
                label={editingProduct ? "Edit Product" : "Add Product"}
                value="2"
              />
            </TabList>
          </Box>
          <TabPanel value="1">
            <DataTable columns={columns} rows={mappedProducts} />
          </TabPanel>
          <TabPanel value="2">
            <div className="product-form">
              <form onSubmit={editingProduct ? handleUpdate : handleSubmit}>
                <div className="formDiv">
                  <div className="formInnerDiv">
                    <label className="formLabel">Item Code</label>
                    <input
                      className="formInput"
                      type="number"
                      value={itemCode}
                      onChange={(e) => setItemCode(Number(e.target.value))}
                    />
                    {validationErrors.itemCode && (
                      <p className="error-text">{validationErrors.itemCode}</p>
                    )}
                  </div>
                  <div className="formInnerDiv">
                    <label className="formLabel">Bar Code</label>
                    <input
                      className="formInput"
                      type="text"
                      value={barCode}
                      onChange={(e) => setBarCode(e.target.value)}
                    />
                    {validationErrors.barCode && (
                      <p className="error-text">{validationErrors.barCode}</p>
                    )}
                  </div>
                  <div className="formInnerDiv">
                    <label className="formLabel">Box Bar Code</label>
                    <input
                      className="formInput"
                      type="text"
                      value={boxBarCode}
                      onChange={(e) => setBoxBarCode(e.target.value)}
                    />
                    {validationErrors.boxBarCode && (
                      <p className="error-text">
                        {validationErrors.boxBarCode}
                      </p>
                    )}
                  </div>
                  <div className="formInnerDiv">
                    <label className="formLabel">Item Name</label>
                    <input
                      className="formInput"
                      type="text"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                    />
                    {validationErrors.itemName && (
                      <p className="error-text">{validationErrors.itemName}</p>
                    )}
                  </div>
                </div>
                <div className="formDiv">
                  <div className="formInnerDiv">
                    <label className="formLabel">Supplier</label>
                    <select
                      className="formInput"
                      value={supplierName}
                      onChange={(e) => setSupplierName(Number(e.target.value))}
                    >
                      <option value={0}>Select Supplier</option>
                      {suppliers.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.supplierName}
                        </option>
                      ))}
                    </select>
                    {validationErrors.supplierName && (
                      <p className="error-text">
                        {validationErrors.supplierName}
                      </p>
                    )}
                  </div>
                  <div className="formInnerDiv">
                    <label className="formLabel">Category</label>
                    <select
                      className="formInput"
                      value={category}
                      onChange={(e) => setCategory(Number(e.target.value))}
                    >
                      <option value={0}>Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.category_name}
                        </option>
                      ))}
                    </select>
                    {validationErrors.category && (
                      <p className="error-text">{validationErrors.category}</p>
                    )}
                  </div>
                  <div className="formInnerDiv">
                    <label className="formLabel">Parent Category</label>
                    <select
                      className="formInput"
                      value={parentCategory}
                      onChange={(e) =>
                        setParentCategory(Number(e.target.value))
                      }
                    >
                      <option value={0}>Select Parent Category</option>
                      {parentCategories.map((parent) => (
                        <option key={parent.id} value={parent.id}>
                          {parent.category_name}
                        </option>
                      ))}
                    </select>
                    {validationErrors.parentCategory && (
                      <p className="error-text">
                        {validationErrors.parentCategory}
                      </p>
                    )}
                  </div>
                </div>
                <div className="formDiv">
                  <div className="formInnerDiv">
                    <label className="formLabel">Box Quantity</label>
                    <input
                      className="formInput"
                      type="number"
                      value={boxQuantity}
                      onChange={(e) => setBoxQuantity(Number(e.target.value))}
                    />
                    {validationErrors.boxQuantity && (
                      <p className="error-text">
                        {validationErrors.boxQuantity}
                      </p>
                    )}
                  </div>
                  <div className="formInnerDiv">
                    <label className="formLabel">Quantity</label>
                    <input
                      className="formInput"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                    {validationErrors.quantity && (
                      <p className="error-text">{validationErrors.quantity}</p>
                    )}
                  </div>
                  <div className="formInnerDiv">
                    <label className="formLabel">Unit</label>
                    <select
                      className="formInput"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                    >
                      <option value="0">Select Unit</option>
                      <option value="Kg">Kg</option>
                      <option value="Ltr">Ltr</option>
                      <option value="Pack">Pack</option>
                      <option value="Box">Box</option>
                    </select>

                    {validationErrors.unit && (
                      <p className="error-text">{validationErrors.unit}</p>
                    )}
                  </div>
                  <div className="formInnerDiv">
                    <label className="formLabel">Account Head</label>
                    <input
                      className="formInput"
                      type="text"
                      value={accountHead}
                      onChange={(e) => setAccountHead(e.target.value)}
                    />
                    {validationErrors.accountHead && (
                      <p className="error-text">
                        {validationErrors.accountHead}
                      </p>
                    )}
                  </div>
                </div>
                <div className="formDiv">
                  <div className="formInnerDiv">
                    <label className="formLabel">Date</label>
                    <input
                      className="formInput"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                    {validationErrors.date && (
                      <p className="error-text">{validationErrors.date}</p>
                    )}
                  </div>
                  <div className="formInnerDiv">
                    <label className="formLabel">Cost Per Unit</label>
                    <input
                      className="formInput"
                      type="number"
                      value={costPerUnit}
                      onChange={(e) => setCostPerUnit(Number(e.target.value))}
                    />
                    {validationErrors.costPerUnit && (
                      <p className="error-text">
                        {validationErrors.costPerUnit}
                      </p>
                    )}
                  </div>
                  <div className="formInnerDiv">
                    <label className="formLabel">Expiration Date</label>
                    <input
                      className="formInput"
                      type="date"
                      value={expirationDate}
                      onChange={(e) => setExpirationDate(e.target.value)}
                    />
                    {validationErrors.expirationDate && (
                      <p className="error-text">
                        {validationErrors.expirationDate}
                      </p>
                    )}
                  </div>
                  <div className="formInnerDiv">
                    <label className="formLabel">Stock Keeping Unit</label>
                    <input
                      className="formInput"
                      type="number"
                      value={StockKeepingUnit}
                      onChange={(e) =>
                        setStockKeepingUnit(Number(e.target.value))
                      }
                    />
                    {validationErrors.StockKeepingUnit && (
                      <p className="error-text">
                        {validationErrors.StockKeepingUnit}
                      </p>
                    )}
                  </div>
                </div>

                <div className="productBtnDiv">
                  <button className="productBtn" type="submit">
                    {" "}
                    {editingProduct ? "Update Product" : "Add Product"}
                  </button>
                  {editingProduct && (
                    <button
                      type="button"
                      className="productBtn cancelBtn"
                      onClick={resetForm}
                    >
                      Cancel Update
                    </button>
                  )}
                </div>
                {error && <p className="error-text">{error}</p>}
              </form>
            </div>
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
}

export default Products;
