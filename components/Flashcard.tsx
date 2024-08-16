import React, { useState } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

interface FlashcardComponentProps {
  flashcard: {
    front: string;
    back: string;
  };
}

const FlashcardComponent: React.FC<FlashcardComponentProps> = ({ flashcard }) => {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <Card
      onClick={handleFlip}
      sx={{
        minHeight: "200px",
        minWidth: "275px",
        maxWidth: "400px",
        margin: "1rem auto",
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
        cursor: "pointer",
        transformStyle: "preserve-3d",
        transition: "transform 0.6s",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CardContent>
            <Typography variant="h5" component="div">
              {flashcard.front}
            </Typography>
          </CardContent>
        </Box>
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CardContent>
            <Typography variant="h5" component="div">
              {flashcard.back}
            </Typography>
          </CardContent>
        </Box>
      </Box>
    </Card>
  );
};

export default FlashcardComponent;