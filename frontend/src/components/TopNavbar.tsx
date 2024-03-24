import { useContext, useMemo } from 'react';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Container,
} from 'reactstrap';
import { Link } from 'react-router-dom';

import CartContext from '../contexts/CartContext';
import CartDropdown from './CartDropdown';

const TopNavbar = () => {
  return (
    <Navbar color="light" light expand="lg">
      <Container>
        <div className="d-flex d-justify-between">
          <NavbarBrand tag={Link} to="/">
            E-shop
          </NavbarBrand>
          <Nav className="me-auto" navbar>
            <NavItem>
              <NavLink tag={Link} to="/a-propos">
                À propos
              </NavLink>
            </NavItem>
          </Nav>
          <div className="d-flex">
            <Nav className="me-2" navbar>
              <NavItem>
                <NavLink href="#!">
                  <i className="bi-person-fill me-1"></i>
                  Compte
                </NavLink>
              </NavItem>
            </Nav>
            <CartDropdown />
          </div>
        </div>
      </Container>
    </Navbar>
  );
};

export default TopNavbar;
