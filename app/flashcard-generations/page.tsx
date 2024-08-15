"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { db } from "@/firebase";
import { collection, doc, getDoc, writeBatch } from "firebase/firestore";

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
      console.log("API Response:", data);
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
                    collections.push({ name })
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
  }

  useEffect(() => {
    if (flashcards.length > 0) {
      console.log("Flashcards state updated:", flashcards);
    }
  }, [flashcards]);

  return (
    <Container maxWidth="sm">
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
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          label="Enter text to generate flashcards"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          sx={{ mb: 2 }}
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
            <Typography variant="h6" sx={{ mt: 4 }}>
              Flashcards generated! Save them below:
            </Typography>
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              label="Enter a name for the collection"
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
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