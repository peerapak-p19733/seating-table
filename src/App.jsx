import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomPage from "./page/components/SlideToUnlock";
import HomePage from "./page/HomePage";
import StoryPage from "./page/CoupleStory";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/home" element={<HomePage />} /> */}
        <Route path="/story" element={<StoryPage />} />
      </Routes>
    </Router>
  );
}