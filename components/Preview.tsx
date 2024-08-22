import React, { useState } from "react";
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
      className={`custom-card ${flipped ? "flipped" : ""} dark:bg-gray-800`}
      onClick={handleClick}
    >
      <CardContent className="custom-card-content">
        <div className="card-face card-front">
          <h4 className="w-full text-center mb-2 question text-lg antiliased font-semibold dark:text-sky-500">Question</h4>
          <h6 className="w-full text-center">{flashcard.front}</h6>
        </div>
        <div className="card-face card-back">
          <h4 className="w-full text-center mb-2 answer text-lg antiliased font-semibold dark:text-red-400">Answer</h4>
          <h6 className="w-full text-center antiliased">{flashcard.back}</h6>
        </div>
      </CardContent>
    </Card>
  );
};

export default Preview;