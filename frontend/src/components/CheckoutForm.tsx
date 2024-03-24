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
    <Row>
      <Col>
        <h4>Informations de Livraison</h4>
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
          <Row className="my-4">
            <Col>
              <h4>Informations de Paiement</h4>
              <p className="text-danger fst-italic" style={{ fontSize: 14 }}>
                Évidemment, ne renseignez pas de vraies informations de
                paiement&hellip;
                <br />
                (elles ne seront pas stockées, de toute façon)
              </p>
            </Col>
            <Col xs="12">
              <FormGroup>
                <Label for="cardNumber">Numéro de Carte de Crédit</Label>
                <Input
                  type="text"
                  name="cardNumber"
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>
            <Col xs="6">
              <FormGroup>
                <Label for="cvv">CVV</Label>
                <Input
                  type="text"
                  name="cvv"
                  id="cvv"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>
            <Col xs="6">
              <FormGroup>
                <Label for="expiration">Date d'expiration</Label>
                <Input
                  type="text"
                  name="expiration"
                  id="expiration"
                  placeholder="12/26"
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
  );
};

export default CheckoutForm;
