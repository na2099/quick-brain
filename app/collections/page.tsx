"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Container, Typography, Box, List, ListItem, ListItemText, Button } from "@mui/material";
import { db } from "@/firebase";
import { collection, doc, getDoc } from "firebase/firestore";
import Link from "next/link";

export default function Collections() {
  const { user } = useUser();
  const [collections, setCollections] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchCollections = async () => {
        const userDocRef = doc(collection(db, "users"), user.id);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const userCollections = docSnap.data().flashcards || [];
          setCollections(userCollections.map((collection: any) => collection.name));
        }
        setLoading(false);
      };

      fetchCollections();
    }
  }, [user]);

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography variant="h5">Loading your collections...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 6, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {collections.length === 0 ? (
          <>
            <Typography variant="h5">No collections made yet</Typography>
            <Button variant="contained" color="primary" sx={{ mt: 2 }}>
              <Link href="/generations" passHref>
                Go to Generate Flashcards
              </Link>
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h4">Your Collections</Typography>
            <List sx={{ width: "100%", mt: 2 }}>
              {collections.map((collectionName, index) => (
                <ListItem
                  key={index}
                  button
                  component={Link}
                  href={`/flashcards/${collectionName}`}
                >
                  <ListItemText primary={collectionName} />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Box>
    </Container>
  );
}