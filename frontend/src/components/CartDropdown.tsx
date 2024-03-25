import { useContext, useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';

import { formatName, formatPrice } from '../helpers';
import CartContext from '../contexts/CartContext';

const CartDropdown = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { items: cartItems, removeItem } = useContext(CartContext);
  const navigate = useNavigate();
  const itemsTotal = useMemo(
    () =>
      cartItems.reduce(
        (total, { product, quantity }) => ({
          quantity: total.quantity + quantity,
          price: total.price + quantity * product.price,
        }),
        { price: 0, quantity: 0 }
      ),
    [cartItems]
  );
  const canOrder = cartItems.length > 0;

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  return (
    <Dropdown id="cart-dropdown" isOpen={dropdownOpen} toggle={toggleDropdown}>
      <DropdownToggle outline caret>
        <i className="bi-cart-fill me-1"></i>
        Panier
        <Badge color="dark" className="ms-1 rounded-pill">
          {itemsTotal.quantity}
        </Badge>
      </DropdownToggle>
      <DropdownMenu>
        {cartItems.length === 0 ? (
          <DropdownItem disabled>Panier vide</DropdownItem>
        ) : (
          cartItems.map((item) => (
            <DropdownItem
              key={item.product.id}
              className="d-flex justify-content-between"
            >
              <span>
                {formatName(item.product.name, 20)} x {item.quantity}
              </span>
              <Button
                color="danger"
                outline
                size="sm"
                className="ms-3"
                onClick={() => removeItem(item.product)}
              >
                Supprimer
              </Button>
            </DropdownItem>
          ))
        )}
        <DropdownItem divider />
        <DropdownItem>Total : {formatPrice(itemsTotal.price)}</DropdownItem>
        <DropdownItem divider />
        <DropdownItem onClick={() => navigate('/panier')}>Panier</DropdownItem>
        <DropdownItem
          disabled={!canOrder}
          onClick={() => navigate('/commande')}
        >
          <span className={`text-${canOrder ? 'primary' : 'secondary'}`}>
            Commander
          </span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
export default CartDropdown;
