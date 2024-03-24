import { useContext, useEffect, useState } from 'react';
import {
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Button,
  Row,
  Col,
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

import { signin } from '../api';
import AuthContext from '../contexts/AuthContext';

const SigninForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);
    try {
      await signin(email, password);
      navigate('/');
    } catch (err) {
      setErrorMessage(
        ((err as AxiosError).response?.data as { error: string })?.error ||
          (err as Error).message
      );
    } finally {
      setLoading(false);
    }
  };

  return user ? (
    <Container className="my-5 text-center">
      <p>Vous êtes déjà authentifié&hellip; Redirection vers l&#39;accueil.</p>
    </Container>
  ) : (
    <Container className="my-5">
      <Row>
        <Col
          md={{ size: 6, offset: 3 }}
          sm={{ size: 8, offset: 2 }}
          xs={{ size: 10, offset: 1 }}
        >
          <Form onSubmit={onSubmit}>
            {errorMessage && (
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
            )}
            <FormGroup className="mb-3">
              <Label for="inputEmail">Adresse e-mail</Label>
              <Input
                type="email"
                name="email"
                id="inputEmail"
                placeholder="leia@skywalker.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FormText>
                Nous ne partagerons <em>jamais</em> votre e-mail.
              </FormText>
            </FormGroup>
            <FormGroup className="mb-3">
              <Label for="inputPassword">Mot de passe</Label>
              <Input
                type="password"
                name="password"
                id="inputPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormGroup>

            <Button color="primary" disabled={loading}>
              Connexion
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SigninForm;
