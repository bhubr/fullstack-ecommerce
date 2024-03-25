import { useContext } from 'react';
import { Button, Card, CardImg, CardBody, CardFooter } from 'reactstrap';

import type { IProduct } from '../types';
import { serverUrl } from '../settings';
import { formatName, formatPrice } from '../helpers';
import CartContext from '../contexts/CartContext';

import './ProductCard.css';

const ProductCard = ({ product }: { product: IProduct }) => {
  const { addItem } = useContext(CartContext);
  const isOutOfStock = product.stock === 0;
  const buttonProps = isOutOfStock
    ? { color: 'secondary', disabled: true, label: 'Épuisé' }
    : { color: 'primary', disabled: false, label: 'Panier' };
  return (
    <Card className="h-100 position-relative">
      {product.stock <= 3 && (
        <div className="ribbon">
          <span>{isOutOfStock ? 'ÉPUISÉ' : 'STOCK BAS'}</span>
        </div>
      )}
      {/* {product.sale && (
      <div
        className="badge bg-dark text-white position-absolute"
        style={{ top: '0.5rem', right: '0.5rem' }}
      >
        Sale
      </div>
    )} */}
      <CardImg top src={`${serverUrl}${product.pictureUrl}`} alt="..." />
      <CardBody className="p-4">
        <div className="text-center">
          <p>{formatName(product.name)}</p>
          {/* {product.reviews && (
          <div className="d-flex justify-content-center small text-warning mb-2">
            {[...Array(product.reviews)].map((_, i) => (
              <i key={i} className="bi-star-fill"></i>
            ))}
          </div>
        )}
        {product.oldPrice && (
          <span className="text-muted text-decoration-line-through">
            {product.oldPrice}
          </span>
        )}{' '} */}
          <strong>{formatPrice(product.price)}</strong>
        </div>
      </CardBody>
      <CardFooter className="p-4 pt-0 border-top-0 bg-transparent">
        <div className="text-center">
          <Button
            color={buttonProps.color}
            outline
            onClick={() => addItem(product)}
            disabled={buttonProps.disabled}
          >
            {buttonProps.label}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
