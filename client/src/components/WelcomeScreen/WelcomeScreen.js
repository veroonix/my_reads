// WelcomeScreen.jsx
import { Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <Box display="flex" flexDirection="column" alignItems="center" marginTop={5}>
      <h2>Добро пожаловать в книжное приложение!</h2>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => navigate("/login")} 
        sx={{ marginBottom: 2 }}
      >
        Войти
      </Button>
      <Button 
        variant="outlined" 
        color="secondary" 
        onClick={() => navigate("/register")}
      >
        Зарегистрироваться
      </Button>
    </Box>
  );
}