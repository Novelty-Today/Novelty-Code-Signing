import { Route, Routes } from "react-router-dom";
import { Home } from "../Pages/Home";
import { UserFiles } from "../Pages/UserFiles";

export function Navigation() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:userWalletAddress/files" element={<UserFiles />} />
    </Routes>
  );
}
