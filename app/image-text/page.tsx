"use client";

import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createWorker } from "tesseract.js";
import Image from "next/image";

export default function ImageText() {
  const [imageData, setImageData] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("idle");
  const [ocrResult, setOcrResult] = useState("");

  const handleExtract = async () => {
    if (!imageData) return;

    const worker = await createWorker("eng", 1, {
      logger: (m) => {
        setProgress(m.progress);
        setProgressLabel(m.progress === 1 ? "done" : m.status);
      },
    });

    const { data: { text } } = await worker.recognize(imageData);
    setOcrResult(text);
    await worker.terminate();
  };

  return (
    <div className="p-4 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
      <div className="flex-1">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <p className="text-lg font-medium">
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
            className="mt-4 "
            width={500} 
            height={500} 
          />
        )}
      </div>

      <div className="flex-1">
        <Button
          onClick={handleExtract}
          disabled={!imageData}
          className="w-full"
        >
          Extract
        </Button>
        <p className="mt-4 text-lg">{progressLabel.toUpperCase()}</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${progress * 100}%` }}
          ></div>
        </div>

        {ocrResult && (
          <div className="mt-4">
            <p className="text-xl font-semibold">RESULT</p>
            <p className="font-mono bg-black text-white p-4">{ocrResult}</p>
          </div>
        )}
      </div>
    </div>
  );
}