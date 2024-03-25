import { Routes, Route } from 'react-router-dom';

import HomeContainer from './pages/Home.container';
import Cart from './pages/Cart';
import SigninForm from './pages/SigninForm';
import SubmitOrder from './pages/SubmitOrder';
import TopNavbar from './components/TopNavbar';
import Footer from './components/Footer';
import NotFound from './components/NotFound';
import OrderListContainer from './pages/OrderListContainer';
import OrderDetailsContainer from './pages/OrderDetailsContainer';
import SignupForm from './pages/SignupForm';

const App = () => {
  return (
    <div>
      <TopNavbar />

      <Routes>
        <Route path="/" element={<HomeContainer />} />
        <Route path="/panier" element={<Cart />} />
        <Route path="/commande" element={<SubmitOrder />} />
        <Route path="/commandes" element={<OrderListContainer />} />
        <Route path="/commandes/:reference" element={<OrderDetailsContainer />} />
        <Route path="/categories/:categorySlug" element={<HomeContainer />} />
        <Route path="/compte/connexion" element={<SigninForm />} />
        <Route path="/compte/inscription" element={<SignupForm />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </div>
  );
};
export default App;
