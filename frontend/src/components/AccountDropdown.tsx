import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const AccountDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  return (
    <Dropdown isOpen={isOpen} toggle={toggle} className="mx-1">
      <DropdownToggle outline caret>
        Compte
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem>
          <Link to="/compte/connexion">Connexion</Link>
        </DropdownItem>
        <DropdownItem>
          <Link to="/compte/inscription">Inscription</Link>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default AccountDropdown;
