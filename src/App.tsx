import UserHome from "./pages/UserHome";
import { BrowserRouter, Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { FlowProvider } from "./context/context";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <FlowProvider>
        <Routes>
          <Route path="/" element={<UserHome />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </FlowProvider>
    </BrowserRouter>
  );
}

export default App;
