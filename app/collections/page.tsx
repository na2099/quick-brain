"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
  IconButton,
  Modal,
  TextField,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { db } from "@/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  writeBatch,
  DocumentData,
} from "firebase/firestore";
import Link from "next/link";

interface Collection {
  name: string;
  questionCount?: number;
}

export default function CollectionsPage() {
  const { user } = useUser();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null
  );
  const [newCollectionName, setNewCollectionName] = useState<string>("");

  const fetchCollections = async () => {
    if (user) {
      const userDocRef = doc(collection(db, "users"), user.id);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const userCollections = docSnap.data().flashcards || [];

        const collectionsWithCounts = await Promise.all(
          userCollections.map(async (col: Collection) => {
            const colRef = collection(userDocRef, col.name);
            const colSnap = await getDocs(colRef);
            const questionCount = colSnap.size;
            return {
              ...col,
              questionCount,
            };
          })
        );

        setCollections(collectionsWithCounts);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, [user]);

  const handleOpenModal = (collectionName: string) => {
    setSelectedCollection(collectionName);
    setNewCollectionName(collectionName);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCollection(null);
    setNewCollectionName("");
  };

  const handleSaveCollectionName = async () => {
    if (!user || !selectedCollection || !newCollectionName.trim()) return;

    const userDocRef = doc(collection(db, "users"), user.id);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const batch = writeBatch(db);
      const userCollections: Collection[] = docSnap.data().flashcards || [];

      // Update the collection name in the flashcards array
      const updatedCollections = userCollections.map((col: Collection) => {
        if (col.name === selectedCollection) {
          return { ...col, name: newCollectionName };
        }
        return col;
      });

      batch.update(userDocRef, { flashcards: updatedCollections });

      // Rename the actual collection in Firestore
      const oldCollectionRef = collection(userDocRef, selectedCollection);
      const newCollectionRef = collection(userDocRef, newCollectionName);

      const colSnap = await getDocs(oldCollectionRef);
      

      // Copy documents to the new collection
      colSnap.forEach((document) => {
        const newDocRef = doc(newCollectionRef, document.id);
        batch.set(newDocRef, document.data());
      });

      // Delete the old collection documents
      colSnap.forEach((document) => {
        // Renamed from 'doc' to 'document'
        batch.delete(document.ref);
      });

      await batch.commit();

      // Update the state with the new collection names
      setCollections(
        updatedCollections.map((col: Collection) => {
          const existing = collections.find((c) => c.name === col.name);
          return {
            ...col,
            questionCount: existing ? existing.questionCount : 0,
          };
        })
      );
      handleCloseModal();
      window.location.reload();
    } else {
      console.error("Document does not exist!");
    }
  };

  const handleDeleteCollection = async () => {
    if (!user || !selectedCollection) return;

    try {
      const userDocRef = doc(collection(db, "users"), user.id);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const userCollections: Collection[] = docSnap.data().flashcards || [];

        // Remove the collection name from the flashcards array
        const updatedCollections = userCollections.filter(
          (col: Collection) => col.name !== selectedCollection
        );

        await updateDoc(userDocRef, { flashcards: updatedCollections });

        // Delete the actual collection from Firestore
        const collectionRef = collection(userDocRef, selectedCollection);
        const colSnap = await getDocs(collectionRef);

        const batch = writeBatch(db);

        // Delete all documents in the collection
        colSnap.forEach((doc) => {
          batch.delete(doc.ref);
        });

        await batch.commit();

        // Update the state with the remaining collections
        setCollections(
          updatedCollections.map((col: Collection) => {
            const existing = collections.find((c) => c.name === col.name);
            return {
              ...col,
              questionCount: existing ? existing.questionCount : 0,
            };
          })
        );

        await fetchCollections(); // Ensure this is awaited to finish before continuing
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error deleting collection:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 6,
          mb: 6,
          maxWidth: "80rem",
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {collections.length === 0 ? (
          <>
            <Typography
              variant="h3"
              className="mb-6 scroll-m-20 antialiased text-4xl font-bold tracking-tight lg:text-5xl"
            >
              No collections made yet
            </Typography>
            <Button variant="contained" color="primary" sx={{ mt: 2 }}>
              <Link href="/text-generations" passHref>
                Go to Generate Flashcards
              </Link>
            </Button>
          </>
        ) : (
          <>
            <Typography
              variant="h3"
              className="mb-6 scroll-m-20 antialiased text-4xl font-bold tracking-tight lg:text-5xl"
            >
              Your Collections
            </Typography>
            <List sx={{ width: "100%", mt: 2 }}>
              {collections.map((col, index) => (
                <ListItem
                  key={index}
                  className="mb-4 ring ring-sky-600 ring-opacity-50 focus:ring-opacity-100 text-base antialiased rounded-list-item"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Link href={`/flashcards/${col.name}`} passHref>
                    <ListItemText
                      primary={`${col.name} (${col.questionCount} questions)`}
                    />
                  </Link>
                  <Box>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleOpenModal(col.name)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => {
                        setSelectedCollection(col.name); // Set the collection name
                        handleDeleteCollection(); // Then delete the collection
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Box>

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            p: 4,
            backgroundColor: "white",
            margin: "auto",
            mt: 6,
            borderRadius: "8px",
            width: "400px",
          }}
        >
          <Typography variant="h6">Edit or Delete Collection</Typography>
          <TextField
            label="New Collection Name"
            fullWidth
            margin="normal"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
          />
          <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
            <Button onClick={handleCloseModal} variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={handleSaveCollectionName}
              variant="contained"
              color="primary"
            >
              Save
            </Button>
            <Button
              onClick={handleDeleteCollection}
              variant="contained"
              color="secondary"
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
}
