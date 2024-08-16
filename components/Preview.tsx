import React, {useState} from "react";
import { Card, CardContent } from "@/components/ui/card"; 

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
        className="custom-card"
        onClick={handleClick}
        style={{transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)"}}
    >
        <CardContent
            className="custom-card-content"
            style={{transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)"}}
        >
        <div>
            <h6
               className=""
            >
                {flipped? flashcard.back : flashcard.front}
            </h6>
        </div>
        </CardContent>
    </Card>
);
};

export default Preview;