import Home from "./Pages/Home/Home"
import {
  createBrowserRouter,
  RouterProvider,
  Outlet
} from "react-router-dom";
import User from "./Pages/User/User";
import Products from "./Pages/Products/Products";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import Menu from "./Components/Menu/Menu";
import Login from "./Pages/Login/Login";
import './styles/global.scss'
import UserRoles from "./Pages/UserRoles/UserRoles";
import Categories from "./Pages/Categories/Categories";
import SupplierDetails from "./Pages/SupplierDetails/SupplierDetails";
import Demands from "./Pages/Demands/Demands";
import Receiveds from "./Pages/Received/Receiveds";
import Issuance from "./Pages/Issuance/Issuance";
function App() {

  const Layout = ()=> {
    return(
      <div className="main">
        <Navbar/>
        <div className="container">
          <div className="menu-container">
            <Menu/>
          </div>
          <div className="content-container">
            <Outlet/>
          </div>
        </div>
        <Footer/>
      </div>
    )
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element:<Layout/>,
      children:[
        {
          path: "/",
          element:<Home/>
        },
        {
          path: "/User",
          element:<User/>
        },
        {
          path: "/user-roles",
          element:<UserRoles/>
        }
        ,{
          path: "/categories",
          element:<Categories/>
        },
        {
          path: "/supplier-details",
          element:<SupplierDetails/>
        },
        {
          path:"/products",
          element:<Products/>
        },
        {
          path:"/demands",
          element:<Demands/>
        },
        {
          path:"/Receiveds",
          element:<Receiveds/>
        },
        {
          path:"/Issuance",
          element:<Issuance/>
        }
      ]
    },
    {
      path: "/Login",
      element:<Login/>
    },
  ]);

  return <RouterProvider router={router}/>
}

export default App
