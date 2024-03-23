import {
  Container,
  Row,
  Col,
} from "reactstrap";
import { IProduct } from "../types";
import ProductCard from "./ProductCard";

const ProductCardList = ({ products }: { products: IProduct[] }) => (
  <Container>
    <Row xs="1" sm="2" md="3" xl="4" className="justify-content-center">
      {products.map((product, index) => (
        <Col key={index} className="mb-5">
          <ProductCard product={product} />
        </Col>
      ))}
    </Row>
  </Container>
);

export default ProductCardList;