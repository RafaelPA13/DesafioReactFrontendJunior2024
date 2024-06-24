//Importe react-router-dom
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Importe páginas
import { All } from "./pages/all";
import { Active } from "./pages/active";
import { Completed } from "./pages/completed";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<All />} />
        <Route path="/active" element={<Active />} />
        <Route path="/completed" element={<Completed />} />
      </Routes>
    </BrowserRouter>
  );
}
