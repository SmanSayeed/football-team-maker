import { useState } from 'react'
import './App.css'
import Button from './submodule/ui/Button/Button'
import { useGetCountriesQuery } from './redux/apis/apiSlice'
import config from './config/config';

function App() {
console.log("base url", config.baseUrl);
  // get countries from rtk query from apiSlice.js
  const { data: countries, error, isLoading } = useGetCountriesQuery();
  console.log(countries);
 
  return (
    <>
      <Button />
    </>
  )
}

export default App
