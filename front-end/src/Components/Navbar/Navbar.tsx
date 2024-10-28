import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import './Navbar.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
function Navbar() {
  return (
    <div className='navbar'>
      <div className="nav-left">
      <div className="logo">
        <span>M S</span>
      </div>
      </div>
      <div className="nav-right">
      <div className="icons">
        <div className="userDiv">
          <img src="https://tetracrystals.com/wp-content/uploads/2022/08/ali-raza.png" alt="" />
          <div className="profileTitle">
          <span className='profileTitleName'>RAZA</span>
          <span>Admin</span>
          </div>
          <div className="logOut">
            <span>
            <FontAwesomeIcon icon={faRightFromBracket} />
            </span>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default Navbar