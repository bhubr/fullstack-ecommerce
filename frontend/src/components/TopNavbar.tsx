import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Collapse,
  NavbarToggler,
  Badge,
  Container,
} from 'reactstrap';

const TopNavbar = () => {
  return (
    <Navbar color="light" light expand="lg">
      <Container>
        <NavbarBrand href="#!">Start Bootstrap</NavbarBrand>
        <NavbarToggler />
        <Collapse navbar>
          <Nav className="me-auto" navbar>
            <NavItem>
              <NavLink href="#!" active>
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#!">About</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#!">Shop</NavLink>
            </NavItem>
          </Nav>
          <form className="d-flex">
            <button className="btn btn-outline-dark" type="submit">
              <i className="bi-cart-fill me-1"></i>
              Cart
              <Badge color="dark" className="ms-1 rounded-pill">
                0
              </Badge>
            </button>
          </form>
        </Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNavbar;
