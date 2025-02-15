
// src/hooks/useInfiniteScroll.js
import { useCallback, useRef, useState, useEffect } from 'react';
import { ITEMS_PER_PAGE, LOADING_DELAY } from '../constants/playerConstants';
import { processPlayerData } from '../utils/playerUtils';

export const useInfiniteScroll = (currentPlayers) => {
  const [displayedPlayers, setDisplayedPlayers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const observer = useRef();
  const timerRef = useRef();

  const lastPlayerRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && displayedPlayers.length < currentPlayers.length) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, displayedPlayers.length, currentPlayers.length]);

  useEffect(() => {
    if (!currentPlayers?.length) return;
    
    setLoading(true);
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      const processedPlayers = currentPlayers
        .slice(0, page * ITEMS_PER_PAGE)
        .map(processPlayerData)
        .filter(Boolean);
      
      setDisplayedPlayers(processedPlayers);
      setLoading(false);
    }, LOADING_DELAY);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [page, currentPlayers]);

  useEffect(() => {
    return () => {
      if (observer.current) observer.current.disconnect();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return {
    displayedPlayers,
    loading,
    lastPlayerRef,
    setPage
  };
};