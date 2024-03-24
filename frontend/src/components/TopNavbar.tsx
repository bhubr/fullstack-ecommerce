import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Badge,
  Container,
} from 'reactstrap';
import { Link } from 'react-router-dom';

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
              <NavLink tag={Link} to="/a-propos">À propos</NavLink>
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
            <form className="d-flex">
              <button className="btn btn-outline-dark" type="submit">
                <i className="bi-cart-fill me-1"></i>
                Panier
                <Badge color="dark" className="ms-1 rounded-pill">
                  0
                </Badge>
              </button>
            </form>
          </div>
        </div>
      </Container>
    </Navbar>
  );
};

export default TopNavbar;
