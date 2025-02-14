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
  console.log("base url", config.baseUrl);

  const dispatch = useDispatch();
  const countries = useSelector(selectCountries);
  const players = useSelector(selectPlayers);

  // Only call the API if countries are not already in Redux
  const { data: countriesData, isSuccess: isCountriesSuccess } =
    useGetCountriesQuery(undefined, {
      skip: countries.length > 0,
    });

  // Only call the API if players are not already in Redux
  const { data: playersData, isSuccess: isPlayersSuccess } = useGetPlayersQuery(
    undefined,
    {
      skip: players.length > 0,
    }
  );

  useEffect(() => {
    if (!countries.length && isCountriesSuccess) {
      dispatch(setCountries(countriesData));
    }
  }, [countries, countriesData, isCountriesSuccess, dispatch]);

  useEffect(() => {
    if (!players.length && isPlayersSuccess) {
      dispatch(setPlayers(playersData));
    }
  }, [players, playersData, isPlayersSuccess, dispatch]);

  console.log("redux -", countries, players);
  console.log("api -", countriesData, playersData);

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
