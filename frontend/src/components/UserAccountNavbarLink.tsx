import { Nav, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import type { IUser } from '../types';

const UserAccountNavbarLink = ({ user }: { user: IUser }) => (
  <Nav>
    <NavLink tag={Link} to="/compte" className="me-2">
      {user.email}
    </NavLink>
    <NavLink tag={Link} to="/deconnexion">
      Déconnexion
    </NavLink>
  </Nav>
);

export default UserAccountNavbarLink;
