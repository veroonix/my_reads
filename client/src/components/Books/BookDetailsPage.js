import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  CardMedia,
  Button,
  Rating,
  TextField,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText as MuiListItemText,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useParams } from "react-router-dom";
import {
  Send as SendIcon,
  Drafts as DraftsIcon,
  MoveToInbox as InboxIcon,
} from "@mui/icons-material";

const Cover = styled(CardMedia)({
  width: "100%",
  maxHeight: 400,
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

function BookDetailsPage({ books }) {
  const { id } = useParams();
 // const book = books.find((b) => b.id === id);
   const book = "vpp";
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([
    { user: "Kimberly", rating: 5, text: "Отличная книга, вдохновляет!" },
    { user: "Иван", rating: 4, text: "Полезная информация, много интересных идей." },
  ]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentShelf, setCurrentShelf] = useState(book?.shelf || "none");

  useEffect(() => {
    if (book?.rating) setRating(book.rating);
  }, [book]);

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
  };

  const handleCommentSubmit = () => {
    if (!comment) return;
    setReviews([...reviews, { user: "Вы", rating, text: comment }]);
    setComment("");
  };

  const handleChange = (value) => {
    setCurrentShelf(value);
    setAnchorEl(null);
  };

  return (
    <Container>
      {book ? (
        <>
          <Cover image={book.image} title={book.title} />
          <Typography variant="h4">{book.title}</Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Автор: {book.authors}
          </Typography>

          {/* Меню выбора полки */}
          <ShelfButton onClick={(event) => setAnchorEl(event.currentTarget)} variant="text">
            {shelfTitle[currentShelf] || "No Shelf"}
          </ShelfButton>
          <Menu
            id="customized-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => handleChange("currentlyReading")}>
              <ListItemIcon><SendIcon fontSize="small" /></ListItemIcon>
              <MuiListItemText primary="Currently Reading" />
            </MenuItem>
            <MenuItem onClick={() => handleChange("read")}>
              <ListItemIcon><DraftsIcon fontSize="small" /></ListItemIcon>
              <MuiListItemText primary="Read" />
            </MenuItem>
            <MenuItem onClick={() => handleChange("wantToRead")}>
              <ListItemIcon><InboxIcon fontSize="small" /></ListItemIcon>
              <MuiListItemText primary="Want to Read" />
            </MenuItem>
            <MenuItem onClick={() => handleChange("none")}>
              <ListItemIcon><InboxIcon fontSize="small" /></ListItemIcon>
              <MuiListItemText primary="No Shelf" />
            </MenuItem>
          </Menu>

          {/* Рейтинг */}
          <Typography variant="h6">Ваш рейтинг:</Typography>
          <Rating value={rating} onChange={handleRatingChange} />

          {/* Отзывы */}
          <Typography variant="h6">Отзывы:</Typography>
          <List>
            {reviews.map((review, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`${review.user} (${review.rating} ⭐)`}
                  secondary={review.text}
                />
              </ListItem>
            ))}
          </List>

          {/* Форма для комментариев */}
          <TextField
            label="Добавить отзыв"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            fullWidth
          />
          <Button onClick={handleCommentSubmit} variant="contained">
            Отправить
          </Button>
        </>
      ) : (
        <Typography variant="h6">Книга не найдена</Typography>
      )}
    </Container>
  );
}

export default BookDetailsPage;
