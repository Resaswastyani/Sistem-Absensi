"use client";

import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { Camera, Loader, CheckCircle, AlertCircle } from "lucide-react";
import { DarkButton } from "./dark-mode-wrapper";

// Ubah interface props menjadi:
interface FaceDetectionCameraProps {
  onCapture: (imageData: string, confidence: number) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function FaceDetectionCamera({
  onCapture,
  isLoading = false,
}: FaceDetectionCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL =
          "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/";
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setIsInitialized(true);
      } catch (err) {
        console.error("Error loading face-api models:", err);
        setError("Gagal memuat model face detection");
      }
    };

    loadModels();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Initialize camera
  useEffect(() => {
    if (!isInitialized) return;

    const initializeCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: "user",
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          setStream(mediaStream);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError(
          "Gagal mengakses kamera. Pastikan Anda memberikan permission akses kamera.",
        );
      }
    };

    initializeCamera();
  }, [isInitialized]);

  // Detect faces continuously
  useEffect(() => {
    if (!isInitialized || !videoRef.current) return;

    const detectFaces = async () => {
      if (!videoRef.current) return;

      try {
        const detections = await faceapi
          .detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions(),
          )
          .withFaceLandmarks()
          .withFaceDescriptors();

        if (detections.length > 0) {
          const face = detections[0];
          // confidence dari face detection (0-1)
          const conf = Math.round(face.detection.score * 100) / 100;
          setConfidence(conf);
          setFaceDetected(conf > 0.7); // Minimum 70% confidence
        } else {
          setFaceDetected(false);
          setConfidence(0);
        }
      } catch (err) {
        console.error("Error detecting faces:", err);
      }

      setIsDetecting(false);
    };

    const interval = setInterval(() => {
      setIsDetecting(true);
      detectFaces();
    }, 500); // Detect setiap 500ms

    return () => clearInterval(interval);
  }, [isInitialized]);

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    try {
      const context = canvasRef.current.getContext("2d");
      if (!context) return;

      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);

      const imageData = canvasRef.current.toDataURL("image/jpeg", 0.9);
      onCapture(imageData, confidence);
    } catch (err) {
      console.error("Error capturing photo:", err);
      setError("Gagal mengambil foto");
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg p-6 text-center">
        <AlertCircle
          className="mx-auto mb-3 text-red-600 dark:text-red-400"
          size={32}
        />
        <p className="text-red-900 dark:text-red-300 font-medium mb-4">
          {error}
        </p>
        <DarkButton variant="primary" onClick={() => window.location.reload()}>
          Muat Ulang Halaman
        </DarkButton>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader className="animate-spin text-primary" size={32} />
        <p className="ml-3 text-muted-foreground dark:text-muted-foreground">
          Memuat sistem face detection...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Camera Preview */}
      <div className="relative bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full aspect-video bg-black object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Face Detection Indicator */}
        <div className="absolute top-4 right-4">
          {isDetecting ? (
            <div className="flex items-center gap-2 bg-black/70 px-3 py-2 rounded-lg">
              <Loader className="animate-spin text-yellow-400" size={16} />
              <span className="text-sm text-yellow-400">
                Mendeteksi wajah...
              </span>
            </div>
          ) : faceDetected ? (
            <div className="flex items-center gap-2 bg-green-500/80 px-3 py-2 rounded-lg">
              <CheckCircle size={16} className="text-white" />
              <span className="text-sm text-white font-medium">
                Wajah Terdeteksi ({Math.round(confidence * 100)}%)
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-red-500/80 px-3 py-2 rounded-lg">
              <AlertCircle size={16} className="text-white" />
              <span className="text-sm text-white font-medium">
                Tidak Ada Wajah
              </span>
            </div>
          )}
        </div>

        {/* Crosshair overlay */}
        <div className="absolute inset-0 border-4 border-dashed border-white/30 rounded-lg pointer-events-none">
          <div className="absolute inset-1/4 border-4 border-white/40 rounded-lg" />
        </div>
      </div>

      {/* Status and Instructions */}
      <div className="bg-card dark:bg-card border border-border dark:border-border/50 rounded-lg p-4">
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-foreground dark:text-foreground mb-2">
              Confidence Level
            </p>
            <div className="w-full bg-secondary dark:bg-secondary/50 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  confidence > 0.8
                    ? "bg-accent"
                    : confidence > 0.6
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${confidence * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-2">
              {Math.round(confidence * 100)}% (Minimum 70% diperlukan)
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded border border-blue-200 dark:border-blue-900/50">
            <p className="text-xs text-blue-900 dark:text-blue-300">
              <span className="font-medium">Tips:</span> Posisikan wajah Anda di
              tengah lingkaran, pastikan pencahayaan cukup, dan wajah terdeteksi
              dengan confidence di atas 70% sebelum mengambil foto.
            </p>
          </div>
        </div>
      </div>

      {/* Capture Button */}
      <DarkButton
        variant="primary"
        onClick={capturePhoto}
        disabled={!faceDetected || isLoading}
        className="w-full flex items-center justify-center gap-2 py-3"
      >
        <Camera size={20} />
        {isLoading
          ? "Memproses..."
          : faceDetected
            ? "Ambil Foto"
            : "Tunggu Deteksi Wajah"}
      </DarkButton>
      <div className="flex gap-2">
        <DarkButton variant="outline" onClick={onCancel} className="flex-1">
          Batal
        </DarkButton>
        <DarkButton
          variant="primary"
          onClick={capturePhoto}
          disabled={!faceDetected || isLoading}
          className="w-full flex items-center justify-center gap-2 py-3"
        >
          <Camera size={20} />{" "}
          {isLoading
            ? "Memproses..."
            : faceDetected
              ? "Ambil Foto"
              : "Tunggu Deteksi Wajah"}
        </DarkButton>
      </div>
    </div>
  );
}
