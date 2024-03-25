import { useContext, useState } from 'react';
import {
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  FormText,
  Label,
  Input,
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import type { AxiosError } from 'axios';

import { submitOrder } from '../api';
import CartContext from '../contexts/CartContext';

const CheckoutForm = () => {
  const [formData, setFormData] = useState({
    address: '',
    postalCode: '',
    city: '',
    phone: '',
    cardHolder: '',
    cardNumber: '',
    cvv: '',
    expiration: '',
  });
  const [error, setError] = useState<AxiosError | null>(null);
  const { clearLocal } = useContext(CartContext);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const order = await submitOrder({
        address: {
          addrStreet: formData.address,
          addrCity: formData.city,
          addrPostCode: formData.postalCode,
          addrPhone: formData.phone,
        },
        payment: {
          cardHolder: formData.cardHolder,
          cardNumber: formData.cardNumber,
          cardExpiry: formData.expiration,
          cardCvc: formData.cvv,
        },
      });
      clearLocal();
      navigate(`/commandes/${order.reference}?success=true`);
    } catch (err) {
      setError(
        err as AxiosError
        // (err as unknown as AxiosError).response?.data.error || 'Erreur inconnue'
      );
    }
  };

  return (
    <Row>
      <Col>
        {error && (
          <div className="alert alert-danger" role="alert">
            {(error.response?.data as { error: string }).error ||
              'Erreur inconnue'}
          </div>
        )}
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
                <Label for="cardHolder">Nom sur la Carte de Crédit</Label>
                <Input
                  type="text"
                  name="cardHolder"
                  id="cardHolder"
                  placeholder="Leia Organa"
                  value={formData.cardHolder}
                  onChange={handleChange}
                />
              </FormGroup>
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
                <FormText color="muted">
                  Numéro de carte pour les tests : 1234 1234 1234 1234
                </FormText>
              </FormGroup>
            </Col>
            <Col xs="7">
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
                <FormText color="muted">
                  Cryptogramme pour les tests : 123
                </FormText>
              </FormGroup>
            </Col>
            <Col xs="5">
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
