import { Container } from 'reactstrap';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <Container style={{ margin: '10em auto' }}>
    <h1>404</h1>
    <h2>Page non trouvée</h2>
    <div>

    <img
      src="https://media1.tenor.com/m/IOI-BYb5CJAAAAAC/banana-peel-slips.gif"
      alt="Banana peel slip"
    />
    </div>
    <p className='my-3'>
      Désolé, la page que vous recherchez n&#39;existe pas !
    </p>
    <p>
    <Link to="/">Retourner à l&#39;accueil</Link>
    </p>
  </Container>
);

export default NotFound;
