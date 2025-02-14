import React from 'react'
import PlayerGrid from '../../components/PlayerGrid/PlayerGrid'
import { usePlayers } from '../../hooks/usePlayers';
import { useCountries } from '../../hooks/useCountries';

export default function Home() {
   // Use custom hooks
   const { players, isLoading: playersLoading } = usePlayers();
   const { countries, isLoading: countriesLoading } = useCountries();
 
  return (
    <>
      <h1>Home</h1>
      <p>Click on a player to view details</p>
      <hr/>
   <PlayerGrid />
    </>
  )
}
