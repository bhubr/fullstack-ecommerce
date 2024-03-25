import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import Gravatar from 'react-gravatar';

import type { IUser } from '../types';
import { useContext, useState } from 'react';
import AuthContext from '../contexts/AuthContext';
const UserAccountNavbarDropdown = ({ user }: { user: IUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { signout } = useContext(AuthContext);
  const toggle = () => setIsOpen(!isOpen);
  return (
    <Dropdown isOpen={isOpen} toggle={toggle} className="me-2">
      <DropdownToggle outline caret>
        <Gravatar
          email={user.email}
          size={20}
          className="rounded-circle me-1"
        />
        <span>{user.fullName}</span>
      </DropdownToggle>
      <DropdownMenu>
        {/* <DropdownItem>{user.fullName}</DropdownItem>
           <DropdownItem divider /> */}
        <DropdownItem>
          <Link to="/commandes">Commandes</Link>
        </DropdownItem>
        <DropdownItem>
          <Link to="#" onClick={signout}>
            Déconnexion
          </Link>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
// <Nav>
//   <NavLink tag={Link} to="/compte" className="me-2">
//     {user.email}
//   </NavLink>
//   <NavLink tag={Link} to="/deconnexion">
//     Déconnexion
//   </NavLink>
// </Nav>

export default UserAccountNavbarDropdown;
