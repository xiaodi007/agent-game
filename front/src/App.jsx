// src/App.jsx
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Splash from "./pages/splash";
import Home from "./pages/home";
import CharacterSelection from "./pages/charactersSelection";
import SceneSelection from "./pages/sceneSelection";
import Test from "./pages/test";

const App = () => {
  const location = useLocation();  // 获取当前的路由位置

  return (
    // <AnimatePresence exitBeforeEnter>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Splash />} />
        <Route path="/character" element={<CharacterSelection />} />
        <Route path="/scene" element={<SceneSelection />} />
        <Route path="/home" element={<Home />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    // </AnimatePresence>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
