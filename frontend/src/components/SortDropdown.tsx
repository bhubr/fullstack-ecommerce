import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import type { SortOrder } from '../types';

interface ISortDropdownProps {
  toggle: () => void;
  isOpen: boolean;
  sortOrder: SortOrder;
  setSortOrder: React.Dispatch<React.SetStateAction<SortOrder>>;
}

const SortDropdown = ({
  toggle,
  isOpen,
  sortOrder,
  setSortOrder,
}: ISortDropdownProps) => {
  return (
    <Dropdown id="sort-order-dropdown" isOpen={isOpen} toggle={toggle}>
      <DropdownToggle className="" outline caret>
        Trier par
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem
          active={sortOrder === 'price-asc'}
          onClick={() => setSortOrder('price-asc')}
        >
          Prix croissant
        </DropdownItem>
        <DropdownItem
          active={sortOrder === 'price-desc'}
          onClick={() => setSortOrder('price-desc')}
        >
          Prix décroissant
        </DropdownItem>
        <DropdownItem
          active={sortOrder === 'createdAt-desc'}
          onClick={() => setSortOrder('createdAt-desc')}
        >
          Nouveauté
        </DropdownItem>
        {/* Add more sorting options here */}
      </DropdownMenu>
    </Dropdown>
  );
};

export default SortDropdown;
