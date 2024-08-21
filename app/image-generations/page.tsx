"use client";

import { useUser } from "@clerk/nextjs";
import { useState, CSSProperties } from "react";
import { Container, Box } from "@mui/material";
import { db } from "@/firebase";
import { collection, doc, getDoc, writeBatch } from "firebase/firestore";
import Preview from "@/components/Preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createWorker } from "tesseract.js";
import Image from "next/image";
import { TextArea } from "@/components/ui/textarea";
import SyncLoader from "react-spinners/SyncLoader";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};


export default function GenerateWithImagePage() {
  const color = "#0284c7"
  const { isLoaded, isSignedIn, user } = useUser();
  const [loading, setLoading] = useState(false);
  const [imageData, setImageData] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("idle");
  const [flashcards, setFlashcards] = useState([]);
  const [name, setName] = useState("");

  const handleExtract = async () => {
    if (!imageData) return;

    const worker = await createWorker("eng", 1,{
      logger: (m) => {
        setProgress(m.progress);
        setProgressLabel(m.progress === 1 ? "done" : m.status);
      },
    });

    const { data: { text } } = await worker.recognize(imageData);
    await worker.terminate();

    return text;
  };

  const handleSubmit = async () => {
    setFlashcards([]);
    setLoading(true);
    const extractedText = await handleExtract();
    if (!extractedText) return;

    try {
      const response = await fetch("/api/image-generations", {
        method: "POST",
        body: JSON.stringify({ textGenerated: extractedText }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setLoading(false);
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
        <h1 className="mb-2 scroll-m-20 antialiased text-4xl font-bold tracking-tight lg:text-5xl">
          Generate Flashcards from Image
        </h1>
        
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-sky-600 rounded-lg cursor-pointer hover:bg-gray-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <p className="text-lg font-medium antialiased">
              Drag an image here or click to select a file
            </p>
          </div>
          <Input
            id="dropzone-file"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImageData(e.target.files[0]);
              }
            }}
          />
        </label>
        {imageData && (
          <Image
            src={URL.createObjectURL(imageData)}
            alt="AI-Image"
            className="mt-4"
            width={200}
            height={200}
          />
        )}

        <Button
          className="bg-sky-700 hover:bg-sky-600 text-white w-1/2 mt-4"
          onClick={handleSubmit}
          disabled={!imageData}
        >
          <p className="text-base antialiased">Submit</p>
        </Button>

        {loading && (
          <div className="flex justify-center items-center mt-20">
            <SyncLoader
            color={color}
            loading={loading}
            cssOverride={override}
            size={10}
          />
          </div>
          
        )}

        {flashcards.length > 0 && (
          <>
            <h2 className="mt-14 mb-2 antialiased text-3xl font-semibold tracking-tight">
              Preview Your Flashcards
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {flashcards.map((flashcard, index) => (
                <div key={index}>
                  <Preview flashcard={flashcard} />
                </div>
              ))}
            </div>

            <h3 className="mt-4 mb-2 antialiased text-2xl font-semibold tracking-tight">
              Flashcards generated! Save them below:
            </h3>
            
            <TextArea
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a name for the collection"
              className="mb-4 ring ring-violet-600 ring-opacity-50 focus:ring-opacity-100 text-base antialiased"
            />
            <Button
              className="bg-violet-800 hover:bg-violet-700 text-white w-1/2"
              onClick={saveFlashcards}
              disabled={!name || !flashcards.length}
            >
              <p className="text-base antialiased">Save Flashcards</p>
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
}