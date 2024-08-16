"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Container, TextField, Button, Typography, Box, Grid } from "@mui/material";
import { db } from "@/firebase";
import { collection, doc, getDoc, writeBatch } from "firebase/firestore";
import Preview from "@/components/Preview";
import { TextArea } from "@/components/ui/textarea";

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [text, setText] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [name, setName] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/flashcards-generations", {
        method: "POST",
        body: text,
      });

      const data = await response.json();
      setFlashcards(data);
    } catch (error) {
      console.error("Error generating flashcards:", error);
    }
  };

  const saveFlashcards = async () => {
    if (!name) {
      alert("Please enter a name for the flashcard set");
      return;
    }

    const batch = writeBatch(db);
    if (user) {
      const userDocRef = doc(collection(db, "users"), user.id);

      try {
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const collections = docSnap.data().flashcards || [];

          if (collections.find((f: any) => f.name === name)) {
            alert("Flashcard set with the same name already exists");
            return;
          } else {
            collections.push({ name });
            batch.set(userDocRef, { flashcards: collections }, { merge: true });
          }
        } else {
          batch.set(userDocRef, { flashcards: [{ name }] });
        }

        const flashcardRef = collection(userDocRef, name);
        flashcards.forEach((flashcard) => {
          const cardDocRef = doc(flashcardRef);
          batch.set(cardDocRef, flashcard);
        });

        await batch.commit();
      } catch (error) {
        console.error("Error getting user document:", error);
      }
    }
  };

  useEffect(() => {
    if (flashcards.length > 0) {
      console.log("Flashcards state updated:", flashcards);
    }
  }, [flashcards]);

  return (
    <Container maxWidth="xl"> 
      <Box
        sx={{
          mt: 4,
          mb: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">Generate Flashcards</Typography>
        <TextArea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to generate flashcards"
          rows={4}
          className="mb-4"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
        >
          Submit
        </Button>

        {flashcards.length > 0 && (
          <>
            <Typography variant="h5" sx={{ mt: 4 }}>
              Preview Your Flashcards
            </Typography>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {flashcards.map((flashcard, index) => (
                <div key={index}>
                  <Preview flashcard={flashcard} />
                </div>
              ))}
            </div>
              

            <Typography variant="h6" sx={{ mt: 4 }}>
              Flashcards generated! Save them below:
            </Typography>
            <TextArea
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a name for the collection"
              className="mb-4"
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={saveFlashcards}
              fullWidth
              disabled={!name || !flashcards.length}
            >
              Save Flashcards
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
}