import { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Send as SendIcon,
  Drafts as DraftsIcon,
  MoveToInbox as InboxIcon,
} from "@mui/icons-material";

// Стилизация компонентов с помощью styled
const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexGrow: 1,
}));

const Content = styled(CardContent)({
  display: "flex",
  flexDirection: "column",
  flex: "1 0 auto",
  maxWidth: 190,
});

const Cover = styled(CardMedia)({
  minWidth: 120,
  height: 180,
});

const Title = styled(Typography)({
  fontWeight: 600,
  color: "#2F2542",
});

const ShelfButton = styled(Button)({
  color: "#3B1D6E",
  fontWeight: 600,
});

const shelfTitle = {
  currentlyReading: "Currently Reading",
  read: "Read",
  wantToRead: "Want to Read",
};

function BookItem({ id, title, shelf, image, authors, onBookShelfChange }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentShelf, setCurrentShelf] = useState(null);

  useEffect(() => {
    setCurrentShelf(shelf);
  }, [shelf, title]);

  const handleChange = (value) => {
    onBookShelfChange(id, value);
    setCurrentShelf(value);
    handleClose();
  };

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <StyledCard elevation={0}>
        <Cover image={image} title={title} />
        <Content>
          <Typography variant="subtitle1" component={Title} gutterBottom>
           
            {title ? title.split(" ").slice(0, 7).join(" ") : "Без названия"}

          </Typography>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            {authors}
          </Typography>
          <ShelfButton onClick={handleOpen} variant="text">
            {shelfTitle[currentShelf] || "No Shelf"}
          </ShelfButton>
          <Menu
            id="customized-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => handleChange("currentlyReading")}>
              <ListItemIcon>
                <SendIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Currently Reading" />
            </MenuItem>
            <MenuItem onClick={() => handleChange("read")}>
              <ListItemIcon>
                <DraftsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Read" />
            </MenuItem>
            <MenuItem onClick={() => handleChange("wantToRead")}>
              <ListItemIcon>
                <InboxIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Want to Read" />
            </MenuItem>
            <MenuItem onClick={() => handleChange("none")}>
              <ListItemIcon>
                <InboxIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="No Shelf" />
            </MenuItem>
          </Menu>
        </Content>
      </StyledCard>
    </Grid>
  );
}

export default BookItem;
