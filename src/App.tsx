import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import RFPsPage from './pages/RFPsPage';
import CreateRFPPage from './pages/CreateRFPPage';
import RFPDetailPage from './pages/RFPDetailPage';
import VendorsPage from './pages/VendorsPage';
import ComparisonPage from './pages/ComparisonPage';

function App() {
  return (
    <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/rfps" element={<RFPsPage />} />
          <Route path="/rfps/create" element={<CreateRFPPage />} />
          <Route path="/rfps/:id" element={<RFPDetailPage />} />
          <Route path="/rfps/:id/compare" element={<ComparisonPage />} />
          <Route path="/vendors" element={<VendorsPage />} />
        </Routes>
    </Layout>
  );
}

export default App;


