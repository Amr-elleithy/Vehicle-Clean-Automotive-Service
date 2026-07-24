import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Signing_in/Login";
import Otp from "./components/Signing_in/Otp";
import Layout from "./components/Main_layouts/Layout";
import { Navigate } from "react-router-dom";
import Booking from "./components/navlinks/Booking";
import Users from "./components/navlinks/Users";
import Cars from "./components/navlinks/Cars";
import Baqu from "./components/navlinks/Baqu";
import Gift from "./components/navlinks/Gift";
import Points from "./components/navlinks/Points";
import Invoice from "./components/navlinks/Invoice";
import Manage_message from "./components/navlinks/Manage_message";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/otp" element={<Otp />} />

        <Route path="/home" element={<Layout />}>
          <Route index element={<Navigate to="booking" replace />} />
          <Route path="booking" element={<Booking />} />
          <Route path="users" element={<Users />} />
          <Route path="cars" element={<Cars />} />
          <Route path="baqu" element={<Baqu />} />
          <Route path="gift" element={<Gift />} />
          <Route path="points" element={<Points />} />
          <Route path="invoice" element={<Invoice />}/>
          <Route path="manage_message" element={<Manage_message />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;