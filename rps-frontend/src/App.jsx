import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Header";
import Home from "./pages/Home";
import SinglePlayer from "./pages/SinglePlayer";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
// import MultiPlayer from "./components/MultiPlayer";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/single-player" element={<SinglePlayer />} />
        <Route path="/create-room" element={<CreateRoom />} />
        <Route path="/join-room" element={<JoinRoom />} />
        {/* <Route path="/multi-player" element={<MultiPlayer />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
