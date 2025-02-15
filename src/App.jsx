import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/Home/Home";
import Layout from "./components/Layout/Layout";
import CreateTeamPage from "./pages/CreateTeam/CreateTeam";

function App() {
  

  
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="create-team" element={<CreateTeamPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
