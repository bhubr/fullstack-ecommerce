import { useContext } from 'react';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Container,
} from 'reactstrap';
import { Link } from 'react-router-dom';

import CartDropdown from './CartDropdown';
import AccountDropdown from './AccountDropdown';
import AuthContext from '../contexts/AuthContext';
import UserAccountNavbarLink from './UserAccountNavbarLink';

const TopNavbar = () => {
  const { user } = useContext(AuthContext);
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
            {user ? <UserAccountNavbarLink user={user} /> : <AccountDropdown />}
            <CartDropdown />
          </div>
        </div>
      </Container>
    </Navbar>
  );
};

export default TopNavbar;
