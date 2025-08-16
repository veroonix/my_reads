import { Box, Grid, Typography, Container } from "@mui/material";
import { styled } from "@mui/material/styles";
import BookItem from "./BookItem.js";

const ShelfBooksContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(6),
}));

const NoBooksText = styled(Typography)({
  textAlign: "center",
  color: "#877F96",
});

function Books({ bookList, onBookShelfChange, currentShelf }) {
  const filteredBooks = bookList
    ? currentShelf
      ? bookList.filter((book) => book.shelf === currentShelf)
      : bookList
    : [];

  return (
    <ShelfBooksContainer>
      <Grid container spacing={6}>
        {filteredBooks.length > 0 &&
          filteredBooks.map((book, index) => (
            <BookItem
              key={index}
              id={book.id}
              title={book.title}
              shelf={book.shelf}
              image={
                book.imageLinks
                  ? book.imageLinks.thumbnail
                  : "/assets/no-thumbnail.jpg"
              }
              authors={book.authors ? book.authors.join(", ") : ""}
              onBookShelfChange={onBookShelfChange}
            />
          ))}
        {filteredBooks.length === 0 && (
          <Container>
            <NoBooksText variant="h4">No Book Here Yet!</NoBooksText>
          </Container>
        )}
      </Grid>
    </ShelfBooksContainer>
  );
}

export default Books;
