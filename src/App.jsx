import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VenueSelectPage from "./pages/VenueSelectPage";
import BookingPage from "./pages/BookingPage";
import BookingManagePage from "./pages/BookingManagePage";
import CreatePaymentPage from "./pages/CreatePaymentPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VenueSelectPage />} />
        <Route path="/booking/:venueId" element={<BookingPage />} />
        <Route path="/bookings" element={<BookingManagePage />} />
        <Route path="/create-payment" element={<CreatePaymentPage />} />
      </Routes>
    </Router>
  );
}

export default App;
