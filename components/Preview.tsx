import React, {useState} from "react";
import { Card, CardContent, Typography } from "@mui/material";

interface FlashcardProps {
  flashcard: {
    front: string;
    back: string;
  };
}

const Preview: React.FC<FlashcardProps> = ({ flashcard }) => {
    const [flipped, setFlipped] = useState(false);

    const handleClick = () => {
        setFlipped(!flipped);
    };

return (
    <Card
        sx={{
            minWidth: "200px",
            minHeight: "200px",
            margin: "1rem auto",
            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transition: "transform 0.5s",
        }}
        onClick={handleClick}
    >
        <CardContent
            sx={{
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transformStyle: "preserve-3d",
                transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                transition: "transform 0.5s",
            }}
        >
            <Typography
                variant="h6"
                component="div"
                sx={{
                    width: "100%",
                    height: "100%",
                    fontSize: "clamp(12px, 3vw, 18px)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    wordWrap: "break-word",
                    lineHeight: 1.2,
                }}
            >
                {flipped ? flashcard.back : flashcard.front}
            </Typography>
        </CardContent>
    </Card>
);
};

export default Preview;