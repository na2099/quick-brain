import React, { use, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface FlashcardComponentProps {
  flashcard: {
    front: string;
    back: string;
  };
}

const FlashcardComponent: React.FC<FlashcardComponentProps> = ({
  flashcard,
}) => {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(false);
  }, [flashcard]);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <Card
      className={`flashcard scroll-m-20 w-3/4 h-64 bg-sky-600 bg-opacity-60 ${
        flipped ? "flipped" : ""
      }`}
      onClick={handleFlip}
    >
      <div className="flex flex-col items-center text-white">
        <h1 className="text-center text-3xl font-semibold font-mono tracking-tight antiliased mt-20">
          {flipped ? "Answer" : "Question"}
        </h1>
        <CardContent className="flashcard-content mb-10">
          <div className="flashcard-face">
            <h6 className="w-full text-2xl tracking-tight text-center antiliased font-mono">{flipped ? flashcard.back : flashcard.front}</h6>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default FlashcardComponent;
