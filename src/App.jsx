import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VenueSelectPage from "./pages/VenueSelectPage";
import BookingPage from "./pages/BookingPage";
import BookingManagePage from "./pages/BookingManagePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VenueSelectPage />} />
        <Route path="/booking/:venueId" element={<BookingPage />} />
        <Route path="/bookings" element={<BookingManagePage />} />
      </Routes>
    </Router>
  );
}

export default App;
