"use client";

import { Button, Grid, Modal, Box, Typography, TextField, IconButton } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase";
import Flashcard from "@/components/Flashcard";

interface FlashcardProps {
  flashcard: {
    id?: string;
    front: string;
    back: string;
  };
}

interface FlashcardsPageProps {
  params: {
    collectionName: string;
  };
}

export default function FlashcardsPage({ params }: FlashcardsPageProps) {
  const { collectionName } = params;
  const [flashcards, setFlashcards] = useState<FlashcardProps["flashcard"][]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const { user } = useUser();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFlashcard, setSelectedFlashcard] = useState<FlashcardProps["flashcard"] | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchFlashcards = async () => {
      if (!collectionName || !user) return;

      try {
        const userDocRef = doc(collection(db, "users"), user.id);
        const colRef = collection(userDocRef, collectionName);
        const colSnap = await getDocs(colRef);

        const flashcardsData: FlashcardProps["flashcard"][] = colSnap.docs.map((doc) => ({
          id: doc.id,
          front: doc.data().front || "",
          back: doc.data().back || "",
        }));

        setFlashcards(flashcardsData);
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      }
    };

    fetchFlashcards();
  }, [collectionName, user]);

  const handleNext = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const handlePrevious = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
  };

  const handleOpenModal = (flashcard: FlashcardProps["flashcard"] | null = null) => {
    setSelectedFlashcard(flashcard || { front: "", back: "" });
    setIsEditing(!!flashcard);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedFlashcard(null);
    setIsEditing(false);
  };

  const handleSaveFlashcard = async () => {
    if (!user || !collectionName) return;

    const userDocRef = doc(collection(db, "users"), user.id);
    const colRef = collection(userDocRef, collectionName);

    try {
      if (isEditing && selectedFlashcard?.id) {
        const flashcardDocRef = doc(colRef, selectedFlashcard.id);
        await updateDoc(flashcardDocRef, {
          front: selectedFlashcard.front,
          back: selectedFlashcard.back,
        });
      } else {
        await addDoc(colRef, {
          front: selectedFlashcard?.front || "",
          back: selectedFlashcard?.back || "",
        });
      }

      const colSnap = await getDocs(colRef);
      const flashcardsData: FlashcardProps["flashcard"][] = colSnap.docs.map((doc) => ({
        id: doc.id,
        front: doc.data().front || "",
        back: doc.data().back || "",
      }));
      setFlashcards(flashcardsData);
    } catch (error) {
      console.error("Error saving flashcard:", error);
    }

    handleCloseModal();
  };

  const handleDeleteFlashcard = async (flashcardId: string) => {
    if (!user || !collectionName) return;

    try {
      const userDocRef = doc(collection(db, "users"), user.id);
      const colRef = collection(userDocRef, collectionName);
      const flashcardDocRef = doc(colRef, flashcardId);
      await deleteDoc(flashcardDocRef);

      const colSnap = await getDocs(colRef);
      const flashcardsData: FlashcardProps["flashcard"][] = colSnap.docs.map((doc) => ({
        id: doc.id,
        front: doc.data().front || "",
        back: doc.data().back || "",
      }));
      setFlashcards(flashcardsData);
    } catch (error) {
      console.error("Error deleting flashcard:", error);
    }
  };

  return (
    <div className="w-full">
      <Box
        sx={{
          mt: 6,
          mb: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h3" className="mb-1 scroll-m-20 antialiased text-4xl font-bold tracking-tight lg:text-5xl">
          {decodeURIComponent(collectionName)}
        </Typography>
        {flashcards.length > 0 ? (
          <>
            <div className="grid grid-flow-col gap-10 mt-2">
              <div className="flex justify-center items-center">
                <Button variant="contained" color="primary" size="large" onClick={handlePrevious} disabled={currentCardIndex === 0}>
                  {"<"}
                </Button>
              </div>
              <Flashcard flashcard={flashcards[currentCardIndex]} />
              <div className="flex justify-center items-center">
                <Button variant="contained" color="primary" size="large" onClick={handleNext} disabled={currentCardIndex === flashcards.length - 1}>
                  {">"}
                </Button>
              </div>
            </div>
            <hr className="border-t-2 border-gray-200 mt-16 w-3/4 mx-auto" />

            <Box
              sx={{
                mt: 6,
                mb: 6,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}>
              <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h6"
                className="scroll-m-20 antialiased text-2xl font-bold tracking-tight lg:text-4xl"
                sx={{ position: "relative", display: "inline-flex", alignItems: "center" }}
              >
                All Questions
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleOpenModal()}
                  sx={{
                    marginLeft: 2, // Adds some space between the text and the button
                    borderRadius: '50%', // Makes the button circular
                    width: "40px", 
                    height: "40px",
                    minWidth: "auto", // Removes default min-width
                    padding: "0.5rem", // Adjust padding to make it look like a small icon button
                  }}
                >
                  +
                </Button>
              </Typography>
            </Box>
            <Grid container spacing={2} marginTop={2}>
              {flashcards.map((flashcard) => (
                <Grid item xs={12} sm={12} md={12} key={flashcard.id}>
                  <Box
                    sx={{
                      padding: 2,
                      backgroundColor: "white",
                      borderRadius: "8px",
                      boxShadow: 1,
                      display: "flex", // Use flexbox to align items
                      justifyContent: "space-between", // Space between text and icons
                      alignItems: "center", // Vertically center the content
                    }}
                  >
                    <Typography variant="body1" sx={{ flexGrow: 1 }}>
                      {flashcard.front}
                    </Typography>
                    <Box>
                      <IconButton color="primary" onClick={() => handleOpenModal(flashcard)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="secondary" onClick={() => handleDeleteFlashcard(flashcard.id!)}>
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
            </Box>
          </>
        ) : (
          <Box
            sx={{
              mt: 6,
              mb: 6,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center"
            }}
          >
            <Typography variant="h6">No flashcards found in this collection.</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpenModal()}
              sx={{ mt: 2 }}
            >
              Create New Flashcard
            </Button>
          </Box>
        )}
      </Box>

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{ p: 4, backgroundColor: "white", margin: "auto", mt: 6, borderRadius: "8px", width: "400px" }}>
          <Typography id="modal-title" variant="h6">{isEditing ? "Edit Flashcard" : "Add New Flashcard"}</Typography>
          <form>
            <TextField
              id="modal-description"
              label="Question"
              fullWidth
              margin="normal"
              value={selectedFlashcard?.front || ""}
              onChange={(e) =>
                setSelectedFlashcard((prev) => ({
                  ...prev!,
                  front: e.target.value,
                }))
              }
            />
            <TextField
              label="Answer"
              fullWidth
              margin="normal"
              value={selectedFlashcard?.back || ""}
              onChange={(e) =>
                setSelectedFlashcard((prev) => ({
                  ...prev!,
                  back: e.target.value,
                }))
              }
            />
            <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
              <Button onClick={handleCloseModal} variant="outlined">
                Cancel
              </Button>
              <Button onClick={handleSaveFlashcard} variant="contained" color="primary">
                {isEditing ? "Save Changes" : "Add Flashcard"}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </div>
  );
}