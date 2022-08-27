import { Route, Routes } from "react-router-dom";
import { Home } from "../Pages/Home";
import { Success } from "../Pages/Success";

export function Navigation() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/success" element={<Success />} />
    </Routes>
  );
}
