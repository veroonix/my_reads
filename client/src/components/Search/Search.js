import React from "react";
import {
  Container,
  Paper,
  IconButton,
  InputBase,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";

const RootContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  marginTop: theme.spacing(9),
}));

const SearchBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
  display: "flex",
  alignItems: "center",
  width: 600,
  height: 60,
}));

const InputField = styled(InputBase)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  flex: 1,
}));

const IconBtn = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(1.25),
}));

function Search({ onInputChange }) {
  console.log("Search is rendering .......................................");

  return (
    <RootContainer>
      <SearchBox component="form">
        <IconBtn type="submit">
          <SearchIcon />
        </IconBtn>
        <InputField placeholder="Search Books" onChange={onInputChange} />
      </SearchBox>
    </RootContainer>
  );
}

export default React.memo(Search);
