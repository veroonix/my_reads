import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { styled } from "@mui/material/styles";

const ShelfContainer = styled(Box)(({ theme }) => ({
  margin: theme.spacing(1),
}));

function ShelfSelect({ currentShelf, onShelfChange }) {
  const handleShelfChange = (e) => onShelfChange(e.target.value);

  return (
    <ShelfContainer>
      <FormControl fullWidth>
        <InputLabel id="shelf-select-label">Select Shelf</InputLabel>
        <Select
          labelId="shelf-select-label"
          value={currentShelf}
          onChange={handleShelfChange}
        >
          <MenuItem value="currentlyReading">Currently Reading</MenuItem>
          <MenuItem value="read">Read</MenuItem>
          <MenuItem value="wantToRead">Want to Read</MenuItem>
        </Select>
      </FormControl>
    </ShelfContainer>
  );
}

export default ShelfSelect;
