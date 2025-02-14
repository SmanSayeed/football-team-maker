import { useEffect } from "react";
import "./App.css";
import Button from "./submodule/ui/Button/Button";
import {
  useGetCountriesQuery,
  useGetPlayersQuery,
} from "./redux/apis/apiSlice";
import config from "./config/config";
import { useDispatch, useSelector } from "react-redux";
import { selectCountries, setCountries } from "./redux/slices/countrySlice";
import { selectPlayers, setPlayers } from "./redux/slices/playersSlice";
import { BrowserRouter, Route, Router, Routes } from "react-router";
import Home from "./pages/Home/Home";
import Layout from "./components/Layout/Layout";

function App() {
  

  
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
        
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
