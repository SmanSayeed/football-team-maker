import { Box } from "@mui/material";
import React from "react";
import SearchInput from "../../submodule/ui/SeachInput/SearchInput";

export default function SearchPlayer() {

  return (
    <>
      <Box sx={{ display: { xs: "none", md: "block" }, width: 300 }}>
        <SearchInput fullWidth placeholder="Search players..." />
        {/*clear the search*/}
        <button>X</button>
        
      </Box>
    </>
  );
}
