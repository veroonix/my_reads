import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
} from "@mui/material"; // Material-UI
import { Menu as MenuIcon, AccountCircle, Search } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { styled } from "@mui/system"; // Используем @mui/system вместо @mui/styles

const TitleLink = styled(Link)({
  textDecoration: "none",
  color: "black",
  fontWeight: 600,
});

function Header() {
  const navigate = useNavigate(); // Используем useNavigate

  const handleProfile = () => {};
  const handleSearch = () => {
    navigate("/search"); // Современный способ навигации
  };

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        <IconButton edge="start" sx={{ marginRight: 2 }} color="inherit">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }} noWrap>
          <TitleLink to="/">My Reads</TitleLink>
        </Typography>
        <IconButton edge="end" onClick={handleSearch} color="inherit">
          <Search fontSize="large" />
        </IconButton>
        <IconButton edge="end" onClick={handleProfile} color="inherit">
          <AccountCircle fontSize="large" sx={{ color: "#B994FF" }} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
