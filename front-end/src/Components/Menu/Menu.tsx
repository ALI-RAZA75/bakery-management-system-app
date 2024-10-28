import { useState } from "react";
import { Link } from "react-router-dom";
import "./Menu.scss";
import { menu } from "../../data";

function Menu() {
  const [openItemId, setOpenItemId] = useState(null);
  const [activeItemId, setActiveItemId] = useState(null);

  const handleToggle = (id) => {
    setOpenItemId(openItemId === id ? null : id);
    setActiveItemId(id); 
  };

  return (
    <div className="menu">
      {menu.map((item) => (
        <div
          className={`item ${activeItemId === item.id ? "active" : ""}`}
          key={item.id}
        >
          <Link
            to={item.url}
            className={`title ${activeItemId === item.id ? "active" : ""}`}
            onClick={() => handleToggle(item.id)}
          >
            <span>{item.title}</span>
          </Link>

          {openItemId === item.id && (
            <div className={`dropdown ${openItemId === item.id ? "show" : ""}`}>
              {item.listItems && item.listItems.map((listItem) => (
                <Link
                  to={listItem.url}
                  className={`listItem ${activeItemId === listItem.id ? "active" : ""}`}
                  key={listItem.id}
                >
                  {listItem.icon && <img className="listItemIcon" src={listItem.icon} alt="" />}
                  <span className="listItemTitle">{listItem.title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Menu;
