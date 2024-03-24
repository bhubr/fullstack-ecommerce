import { Card, CardImg, CardBody, CardFooter } from 'reactstrap';
import { IProduct } from '../types';
import { serverUrl } from '../settings';

const ProductCard = ({ product }: { product: IProduct }) => (
  <Card className="h-100">
    {product.sale && (
      <div
        className="badge bg-dark text-white position-absolute"
        style={{ top: '0.5rem', right: '0.5rem' }}
      >
        Sale
      </div>
    )}
    <CardImg top src={`${serverUrl}${product.pictureUrl}`} alt="..." />
    <CardBody className="p-4">
      <div className="text-center">
        <h5 className="fw-bolder">{product.name}</h5>
        {product.reviews && (
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
        )}{' '}
        {product.price}
      </div>
    </CardBody>
    <CardFooter className="p-4 pt-0 border-top-0 bg-transparent">
      <div className="text-center">
        <a className="btn btn-outline-dark mt-auto" href="#">
          Show product
        </a>
      </div>
    </CardFooter>
  </Card>
);

export default ProductCard;
