import { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';

const CheckoutForm = () => {
  const [formData, setFormData] = useState({
    address: '',
    postalCode: '',
    city: '',
    phone: '',
    cardNumber: '',
    cvv: '',
    expiration: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ajoutez ici la logique pour envoyer les données au backend, par exemple pour traiter le paiement.
  };

  return (
    <Container>
      <Row>
        <Col xs={{ offset: 2, size: 8 }}>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="address">Adresse</Label>
              <Input
                type="text"
                name="address"
                id="address"
                value={formData.address}
                onChange={handleChange}
              />
            </FormGroup>
            <Row>
              <Col xs="4">
                <FormGroup>
                  <Label for="postalCode">Code Postal</Label>
                  <Input
                    type="text"
                    name="postalCode"
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>
              <Col xs="8">
                <FormGroup>
                  <Label for="city">Ville</Label>
                  <Input
                    type="text"
                    name="city"
                    id="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label for="phone">Téléphone</Label>
              <Input
                type="text"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </FormGroup>
            <hr style={{ margin: '3em 0' }} />
            <Row>
              <Col xs="6">
                <FormGroup>
                  <Label for="cardNumber">Numéro de Carte de Crédit</Label>
                  <Input
                    type="text"
                    name="cardNumber"
                    id="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>
              <Col xs="3">
                <FormGroup>
                  <Label for="cvv">CVV</Label>
                  <Input
                    type="text"
                    name="cvv"
                    id="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>
              <Col xs="3">
                <FormGroup>
                  <Label for="expiration">Date d'expiration</Label>
                  <Input
                    type="text"
                    name="expiration"
                    id="expiration"
                    value={formData.expiration}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Button color="primary" type="submit">
              Finaliser la Commande
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutForm;
