import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import VerifyEmail from './components/VerifyEmail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/verify" element={<VerifyEmail />} />
      </Routes>
    </Router>
  );
}

export default App;