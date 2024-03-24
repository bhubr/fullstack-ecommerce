import { useContext, useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import CartContext from '../contexts/CartContext';
import { formatName } from '../helpers';

const CartDropdown = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { items: cartItems, removeItem } = useContext(CartContext);
  const itemsTotal = useMemo(
    () => cartItems.reduce((total, { quantity }) => total + quantity, 0),
    [cartItems]
  );

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
      <DropdownToggle caret>
        <i className="bi-cart-fill me-1"></i>
        Cart
        <Badge color="dark" className="ms-1 rounded-pill">
          {itemsTotal}
        </Badge>
      </DropdownToggle>
      <DropdownMenu>
        {cartItems.length === 0 ? (
          <DropdownItem disabled>No items in cart</DropdownItem>
        ) : (
          cartItems.map((item) => (
            <DropdownItem key={item.product.id}>
              {formatName(item.product.name, 20)} x {item.quantity}
              <Button
                color="danger"
                outline
                size="sm"
                className="ms-2"
                onClick={() => removeItem(item.product.id)}
              >
                Supprimer
              </Button>
            </DropdownItem>
          ))
        )}
        <DropdownItem divider />
        <DropdownItem>Panier</DropdownItem>
        <DropdownItem>Acheter</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
export default CartDropdown;
