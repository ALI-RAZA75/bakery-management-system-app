import { useEffect, useState, useMemo } from "react";
import "./Demands.scss";
import Box from "@mui/material/Box";
import DataTable from "../../Components/dataTable/DataTable";
import { GridColDef } from "@mui/x-data-grid";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";

function Demands() {
  const [userID, setUserID] = useState<number | null>(null);
  const [demandDate, setDemandDate] = useState<string>("");
  const [demands, setDemands] = useState<any[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [productQuantities, setProductQuantities] = useState<Record<number, number>>({});
  const [nextDmdId, setNextDmdId] = useState("");

  useEffect(() => {
    const fetchNextDmdId = async () => {
      try {
        const response = await fetch("http://localhost:3001/demands/next");
        const data = await response.json();
        console.log("Next Demand ID from API:", data);
        setNextDmdId(data.nextDmdId);
      } catch (error) {
        console.error("Error fetching nextDmdId:", error);
      }
    };

    fetchNextDmdId();
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [usersRes, categoriesRes, productsRes] = await Promise.all([
          fetch("http://localhost:3001/users"),
          fetch("http://localhost:3001/categories"),
          fetch("http://localhost:3001/products"),
        ]);

        const usersData = await usersRes.json();
        const categoriesData = await categoriesRes.json();
        const productsData = await productsRes.json();

        setUsers(usersData);
        setCategories(categoriesData);
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAllData();
  }, []);

  const productMap = useMemo(() => {
    return products.reduce((map, product) => {
      map[product.id] = product.itemName;
      return map;
    }, {} as Record<number, string>);
  }, [products]);

  const categoryMap = useMemo(() => {
    return categories.reduce((map, category) => {
      map[category.id] = category.category_name;
      return map;
    }, {} as Record<number, string>);
  }, [categories]);

  const handleProductSelect = (productId: number) => {
    if (productId) {
      setSelectedProducts((prev) =>
        prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId]
      );
    }
  };

  const handleQuantityChange = (productId: number, value: number) => {
    setProductQuantities((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedProductsData = selectedProducts
      .map((productId) => {
        const product = products.find((prod) => prod.id === productId);
        return {
          productID: productId,
          quantity: productQuantities[productId] || 0,  
          categoryID: product ? product.category : null,
        };
      })
      .filter((product) => product.productID);

    const demandData = {
      userID,
      demandDate,
      products: selectedProductsData,
    };

    try {
      const response = await fetch("http://localhost:3001/demands/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(demandData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add demand: ${errorText}`);
      }

      alert("Demand added successfully");

      setUserID(null);
      setDemandDate("");
      setSelectedProducts([]);
      setProductQuantities({});
      
      const responseNextId = await fetch("http://localhost:3001/demands/next");
      const dataNextId = await responseNextId.json();
      setNextDmdId(dataNextId.nextDmdId);
    } catch (err) {
      console.error(err.message);
    }
  };

  const productColumns: GridColDef[] = useMemo(
    () => [
      {
        field: "select",
        headerName: "Select",
        flex: 1,
        renderCell: (params) => (
          <input
            type="checkbox"
            checked={selectedProducts.includes(params.row?.id)}
            onChange={() => handleProductSelect(params.row?.id)}
          />
        ),
      },
      {
        field: "itemName",
        headerName: "Product Name",
        flex: 1,
      },
      {
        field: "categoryID",
        headerName: "Category",
        flex: 1,
        renderCell: (params) => {
          const categoryName = categoryMap[params.row?.category] || "Unknown";
          return categoryName;
        },
      },
      {
        field: "quantity",
        headerName: "Quantity",
        flex: 1,
        renderCell: (params) => (
          <input
            type="number"
            value={productQuantities[params.row?.id] || 0}
            onChange={(e) =>
              handleQuantityChange(params.row?.id, parseInt(e.target.value, 10))
            }
          />
        ),
      },
    ],
    [productMap, categoryMap, selectedProducts, productQuantities]
  );

  return (
    <div className="demands">
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value="1">
          <TabPanel value="1">
            <div className="demand-form">
              <form onSubmit={handleSubmit}>
                <div className="formDiv">
                  <div className="formInnerDiv">
                    <label htmlFor="nextDmdId" className="formLabel">Demand ID</label>
                    <input
                      className="formInput"
                      type="text"
                      id="nextDmdId"
                      value={nextDmdId}
                      readOnly
                    />
                  </div>
                  <div className="formInnerDiv">
                    <label className="formLabel">User</label>
                    <select
                      className="formInput"
                      value={userID || ""}
                      onChange={(e) => setUserID(Number(e.target.value))}
                    >
                      <option value="">Select User</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.firstName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="formInnerDiv">
                    <label className="formLabel">Demand Date</label>
                    <input
                      className="formInput"
                      type="date"
                      value={demandDate}
                      onChange={(e) => setDemandDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="demandBtnDiv">
                  <button className="submitBtn" type="submit">Submit</button>
                </div>
                <div className="productTable">
                  <DataTable
                    columns={productColumns}
                    rows={products}
                    autoHeight
                    getRowId={(row) => row.id}
                  />
                </div>
              </form>
            </div>
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
}

export default Demands;
