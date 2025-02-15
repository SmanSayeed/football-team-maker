// src/utils/playerUtils.js
export const processPlayerData = (player) => {
    if (!player) return null;
    return {
      ...player,
      imageUrl: player.imageUrl?.trim() || null,
      clubImageUrl: player.clubImageUrl?.trim() || null,
      countryImageUrl: player.countryImageUrl?.trim() || null,
    };
  };
  
  export const parseMarketValue = (value) => {
    if (!value) return 0;
    const numericValue = parseFloat(value.replace(/[€mM]/g, ''));
    return isNaN(numericValue) ? 0 : numericValue;
  };