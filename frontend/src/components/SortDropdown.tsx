import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

interface ISortDropdownProps {
  toggle: () => void;
  isOpen: boolean;
}

const SortDropdown = ({ toggle, isOpen }: ISortDropdownProps) => {
  return (
    <Dropdown isOpen={isOpen} toggle={toggle}>
      <DropdownToggle caret>Sort by</DropdownToggle>
      <DropdownMenu>
        <DropdownItem>Price</DropdownItem>
        <DropdownItem>Date Added</DropdownItem>
        {/* Add more sorting options here */}
      </DropdownMenu>
    </Dropdown>
  );
};

export default SortDropdown;
