import { Link } from 'react-router-dom';
import { NavLink } from 'reactstrap';
import { ICategory } from '../types';

export interface ICategorySidebarProps {
  categories: ICategory[];
}

const CategorySidebar = ({ categories }: ICategorySidebarProps) => {
  return (
    <div>
      <h5>Categories</h5>
      <ul className="list-unstyled">
        {categories.map((category) => (
          <li key={category.id}>
            <NavLink tag={Link} to={`/categories/${category.slug}`}>
              {category.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySidebar;
