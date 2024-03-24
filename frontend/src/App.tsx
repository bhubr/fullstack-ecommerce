import { Routes, Route } from 'react-router-dom';
import TopNavbar from './components/TopNavbar';
import Footer from './components/Footer';
import HomeContainer from './pages/Home.container';

const App = () => {
  return (
    <div>
      <TopNavbar />

      {/* <header className="bg-dark py-5">
        <Container>
          <div className="text-center text-white">
            <h1 className="display-4 fw-bolder">Shop in style</h1>
            <p className="lead fw-normal text-white-50 mb-0">
              With this shop homepage template
            </p>
          </div>
        </Container>
      </header> */}

      <Routes>
        <Route path="/" element={<HomeContainer />} />
        <Route path="/categories/:categorySlug" element={<HomeContainer />} />
      </Routes>

      <Footer />
    </div>
  );
};
export default App;
