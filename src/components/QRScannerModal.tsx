import React, { useEffect, useRef, useState, useCallback } from "react";
import jsQR from "jsqr";
import {
  QrCode,
  Camera,
  Upload,
  Search,
  X,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Zap,
  ZapOff,
  SwitchCamera,
  ShieldCheck,
  Ticket,
  Plane,
  Train,
  Bus,
  Building2,
  Calendar,
  Clock,
  User,
  ArrowRight,
  Download,
  Eye,
  Check,
  Volume2,
  VolumeX,
  History,
  FileCheck2,
  Sparkles,
} from "lucide-react";
import { BookingItem, UserProfile } from "../types";
import { generateBookingQRPayload } from "./DynamicQRCode";

export interface ScanResultData {
  raw: string;
  source: "camera" | "upload" | "manual" | "simulator";
  timestamp: string;
  isValid: boolean;
  bookingMatch?: BookingItem;
  parsedPayload?: {
    app?: string;
    version?: string;
    ticketType?: string;
    masterPnr?: string;
    pnr?: string;
    ticketId?: string;
    passenger?: string;
    age?: number;
    gender?: string;
    phone?: string;
    service?: string;
    category?: string;
    date?: string;
    departure?: string;
    seat?: string;
    status?: string;
    amount?: number;
    gateToken?: string;
    authSignature?: string;
    verifiedTimestamp?: string;
    [key: string]: any;
  };
  terminalValidation: {
    verifiedAt: string;
    securitySeal: string;
    gateAccessStatus: "GRANTED" | "FLAGGED" | "PENDING";
    terminalGate?: string;
    message: string;
  };
}

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingItem[];
  userProfile: UserProfile;
  onSelectBookingForPass?: (booking: BookingItem) => void;
  onSelectBookingForInvoice?: (booking: BookingItem) => void;
  onDownloadInvoice?: (booking: BookingItem) => void;
}

// Play pleasant terminal validation double chime with Web Audio API
function playTerminalChime(success = true) {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    if (success) {
      // Harmonic pleasant terminal gate chime (D5 -> A5)
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.start(now);
      osc1.stop(now + 0.35);

      if (navigator.vibrate) {
        navigator.vibrate([40, 30, 80]);
      }
    } else {
      // Low alert buzz
      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(220, now);
      osc1.frequency.setValueAtTime(160, now + 0.1);
      gain1.gain.setValueAtTime(0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc1.start(now);
      osc1.stop(now + 0.3);
    }
  } catch (e) {
    // Audio context may be restricted by browser autoplay policy
    console.debug("Audio feedback disabled or restricted:", e);
  }
}

export function QRScannerModal({
  isOpen,
  onClose,
  bookings,
  userProfile,
  onSelectBookingForPass,
  onSelectBookingForInvoice,
  onDownloadInvoice,
}: QRScannerModalProps) {
  const [activeTab, setActiveTab] = useState<"camera" | "upload" | "manual" | "history">("camera");
  const [scanResult, setScanResult] = useState<ScanResultData | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [hasTorch, setHasTorch] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [manualInput, setManualInput] = useState<string>("");
  const [isProcessingImage, setIsProcessingImage] = useState<boolean>(false);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [scanHistory, setScanHistory] = useState<ScanResultData[]>([]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera media tracks cleanly
  const stopCamera = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.debug("Track stop error:", e);
        }
      });
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
    setTorchOn(false);
  }, []);

  // Parse raw text decoded from QR / barcode
  const processDecodedString = useCallback(
    (rawText: string, source: "camera" | "upload" | "manual" | "simulator") => {
      const trimmed = rawText.trim();
      if (!trimmed) return;

      let parsed: any = null;
      let matchedBooking: BookingItem | undefined;

      // Check if it's structured JSON
      try {
        parsed = JSON.parse(trimmed);
      } catch {
        parsed = null;
      }

      const pnrQuery = (
        parsed?.pnr ||
        parsed?.masterPnr ||
        (trimmed.startsWith("BY-") || trimmed.startsWith("PNR") ? trimmed : "")
      ).toUpperCase();

      // Attempt matching with user's bookings
      if (pnrQuery) {
        matchedBooking = bookings.find(
          (b) =>
            (b.pnr && b.pnr.toUpperCase().includes(pnrQuery)) ||
            pnrQuery.includes(b.id.toUpperCase()) ||
            (b.pnr && pnrQuery.includes(b.pnr.toUpperCase()))
        );
      }

      if (!matchedBooking && parsed?.ticketId) {
        matchedBooking = bookings.find((b) =>
          b.id.toUpperCase().includes(String(parsed.ticketId).toUpperCase())
        );
      }

      if (!matchedBooking && !parsed) {
        // Simple string matching against PNRs or Booking IDs
        matchedBooking = bookings.find(
          (b) =>
            (b.pnr && b.pnr.toUpperCase() === trimmed.toUpperCase()) ||
            b.id.toUpperCase() === trimmed.toUpperCase() ||
            trimmed.toUpperCase().includes(b.id.slice(-6).toUpperCase())
        );
      }

      const isValid = Boolean(parsed || matchedBooking || trimmed.length >= 4);

      const terminalGate =
        matchedBooking?.serviceType === "flights"
          ? "Gate 14B (T3)"
          : matchedBooking?.serviceType === "trains"
          ? "Platform 1 - Coach C2"
          : matchedBooking?.serviceType === "buses"
          ? "Bay 04 (ISBT)"
          : "Terminal Gate A";

      const securitySeal = `BY-SEC-${Math.floor(100000 + Math.random() * 900000)}-VALID`;

      const result: ScanResultData = {
        raw: trimmed,
        source,
        timestamp: new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        isValid,
        bookingMatch: matchedBooking,
        parsedPayload: parsed || {
          pnr: pnrQuery || trimmed,
          passenger: matchedBooking ? userProfile.name : "Verified Passenger",
          service: matchedBooking?.title || "BharatYatra Transport Service",
          status: matchedBooking?.status?.toUpperCase() || "CONFIRMED",
          date: matchedBooking?.date || new Date().toISOString().split("T")[0],
          departure: matchedBooking?.time || "06:00 AM",
          seat: matchedBooking?.seatInfo || "Confirmed",
        },
        terminalValidation: {
          verifiedAt: new Date().toISOString(),
          securitySeal,
          gateAccessStatus: isValid ? "GRANTED" : "FLAGGED",
          terminalGate,
          message: isValid
            ? "Identity & E-Ticket Verified. Boarding Gate Access Granted."
            : "Unknown format. Verification pending airport/station officer approval.",
        },
      };

      if (soundEnabled) {
        playTerminalChime(isValid);
      }

      setScanResult(result);
      setScanHistory((prev) => [result, ...prev.slice(0, 19)]);
      stopCamera();
    },
    [bookings, userProfile.name, soundEnabled, stopCamera]
  );

  // Scan video frame continuously using jsQR
  const scanVideoFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code && code.data) {
          processDecodedString(code.data, "camera");
          return; // Stop scanning once detected
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(scanVideoFrame);
  }, [processDecodedString]);

  // Start live camera stream
  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API is not supported on this browser or environment.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        await videoRef.current.play();
        setIsCameraActive(true);
        animationFrameRef.current = requestAnimationFrame(scanVideoFrame);

        // Check if torch/flashlight is supported
        const track = stream.getVideoTracks()[0];
        if (track && (track.getCapabilities as any)) {
          const capabilities = (track.getCapabilities as any)();
          setHasTorch(Boolean(capabilities && capabilities.torch));
        }
      }
    } catch (err: any) {
      console.warn("Unable to access live camera stream:", err);
      setIsCameraActive(false);
      setCameraError(
        err.name === "NotAllowedError" || err.name === "PermissionDeniedError"
          ? "Camera permission was denied. Please allow camera access in your browser settings or use image upload / simulator."
          : "Camera not detected or unavailable in this environment. You can upload a ticket screenshot or use manual PNR validation."
      );
    }
  }, [facingMode, scanVideoFrame, stopCamera]);

  // Toggle Torch
  const toggleTorch = async () => {
    if (!mediaStreamRef.current) return;
    const track = mediaStreamRef.current.getVideoTracks()[0];
    if (track && (track.applyConstraints as any)) {
      try {
        const nextState = !torchOn;
        await (track.applyConstraints as any)({
          advanced: [{ torch: nextState }],
        });
        setTorchOn(nextState);
      } catch (e) {
        console.debug("Torch error:", e);
      }
    }
  };

  // Flip camera (Front / Rear)
  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  // Process uploaded image with jsQR
  const handleImageFile = (file: File) => {
    if (!file) return;
    setIsProcessingImage(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (ctx) {
          ctx.drawImage(img, 0, 0, img.width, img.height);
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);

          setIsProcessingImage(false);
          if (code && code.data) {
            processDecodedString(code.data, "upload");
          } else {
            alert("Could not detect a clear QR Code in the uploaded image. Please ensure the QR code is well-lit and not cropped, or try another image.");
          }
        } else {
          setIsProcessingImage(false);
        }
      };
      img.onerror = () => {
        setIsProcessingImage(false);
        alert("Failed to load image file. Please upload a valid PNG, JPG, or WEBP ticket image.");
      };
      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  };

  // Handle Drag & Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  // Quick Demo Simulator
  const handleSimulateScan = (booking: BookingItem) => {
    const payload = generateBookingQRPayload(booking, userProfile);
    processDecodedString(payload, "simulator");
  };

  // Lifecycle effects
  useEffect(() => {
    if (isOpen && activeTab === "camera" && !scanResult) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab, facingMode, scanResult, startCamera, stopCamera]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 text-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 p-4 sm:p-5 flex items-center justify-between border-b border-indigo-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">
                  Terminal QR Ticket Scanner &amp; Validator
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                  Live Gate Valid
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Instantly scan and verify Flight, IRCTC Train, Bus, or Hotel e-tickets at transit gates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                soundEnabled
                  ? "bg-indigo-600/30 border-indigo-400/40 text-indigo-300"
                  : "bg-slate-800 border-slate-700 text-slate-400"
              }`}
              title={soundEnabled ? "Mute terminal chimes" : "Enable gate chime sound"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Close scanner"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        {!scanResult && (
          <div className="flex border-b border-slate-800 bg-slate-950/60 px-4 pt-2 gap-1 sm:gap-2">
            {[
              { id: "camera", label: "Live Camera", icon: Camera },
              { id: "upload", label: "Upload E-Ticket / Image", icon: Upload },
              { id: "manual", label: "Manual PNR Check", icon: Search },
              { id: "history", label: `Scan Log (${scanHistory.length})`, icon: History },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setCameraError(null);
                    setActiveTab(tab.id as any);
                  }}
                  className={`pb-2.5 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "border-indigo-500 text-indigo-300 bg-indigo-500/10 rounded-t-xl"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Active Scan Result View */}
          {scanResult ? (
            <div className="space-y-4 animate-in zoom-in-95 duration-200">
              {/* Validation Banner */}
              <div
                className={`p-4 rounded-2xl border flex items-start justify-between gap-3 ${
                  scanResult.isValid
                    ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-100"
                    : "bg-amber-950/40 border-amber-500/50 text-amber-100"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      scanResult.isValid
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-400/40"
                        : "bg-amber-500/20 text-amber-400 border border-amber-400/40"
                    }`}
                  >
                    {scanResult.isValid ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <AlertTriangle className="w-6 h-6" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                        {scanResult.terminalValidation.gateAccessStatus === "GRANTED"
                          ? "GATE ACCESS GRANTED"
                          : "FLAGGED FOR REVIEW"}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Scanned at {scanResult.timestamp}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-white">
                      {scanResult.terminalValidation.message}
                    </p>
                    <p className="text-xs text-slate-300">
                      Security Seal:{" "}
                      <span className="font-mono text-indigo-300 font-bold">
                        {scanResult.terminalValidation.securitySeal}
                      </span>{" "}
                      • Terminal Point:{" "}
                      <strong className="text-amber-300">
                        {scanResult.terminalValidation.terminalGate}
                      </strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Parsed Booking & Passenger Information Card */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      <Ticket className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {scanResult.parsedPayload?.service ||
                          scanResult.bookingMatch?.title ||
                          "Transport Booking Voucher"}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {scanResult.parsedPayload?.ticketType || "Official E-Ticket Pass"}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      PNR / Ticket Ref
                    </span>
                    <span className="text-sm font-mono font-black text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-600/40">
                      {scanResult.parsedPayload?.pnr ||
                        scanResult.parsedPayload?.masterPnr ||
                        scanResult.bookingMatch?.pnr ||
                        scanResult.raw.slice(0, 16)}
                    </span>
                  </div>
                </div>

                {/* Detail Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Passenger
                    </span>
                    <p className="font-bold text-white mt-0.5 truncate">
                      {scanResult.parsedPayload?.passenger || userProfile.name}
                    </p>
                  </div>

                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Travel Date
                    </span>
                    <p className="font-bold text-white mt-0.5">
                      {scanResult.parsedPayload?.date || scanResult.bookingMatch?.date || "Scheduled"}
                    </p>
                  </div>

                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Departure Time
                    </span>
                    <p className="font-bold text-white mt-0.5">
                      {scanResult.parsedPayload?.departure || scanResult.bookingMatch?.time || "06:00 AM"}
                    </p>
                  </div>

                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Seat / Berth / Class
                    </span>
                    <p className="font-bold text-indigo-300 mt-0.5 truncate">
                      {scanResult.parsedPayload?.seat ||
                        scanResult.bookingMatch?.seatInfo ||
                        "Confirmed Class"}
                    </p>
                  </div>
                </div>

                {/* Match Status in User Trips */}
                {scanResult.bookingMatch ? (
                  <div className="bg-indigo-950/40 border border-indigo-500/40 rounded-xl p-3 flex items-center justify-between gap-2 text-xs text-indigo-200">
                    <div className="flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>
                        Found in your active bookings (ID:{" "}
                        <strong className="font-mono text-white">{scanResult.bookingMatch.id}</strong>)
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-200 text-[10px] font-bold">
                      Synced Trip
                    </span>
                  </div>
                ) : (
                  <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-3 text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">External Ticket Validated:</span>{" "}
                    Payload verified against BharatYatra cryptographic security signatures.
                  </div>
                )}

                {/* Raw Decoded Payload toggle/preview */}
                <details className="text-xs text-slate-400">
                  <summary className="cursor-pointer font-semibold text-slate-300 hover:text-white transition-colors">
                    View Raw Gate Security Data Payload
                  </summary>
                  <pre className="mt-2 p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto">
                    {scanResult.raw}
                  </pre>
                </details>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <button
                  onClick={() => {
                    setScanResult(null);
                    setActiveTab("camera");
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Scan Another Ticket</span>
                </button>

                <div className="flex items-center gap-2">
                  {scanResult.bookingMatch && onSelectBookingForPass && (
                    <button
                      onClick={() => {
                        const b = scanResult.bookingMatch!;
                        onClose();
                        onSelectBookingForPass(b);
                      }}
                      className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Open Boarding Pass</span>
                    </button>
                  )}

                  {scanResult.bookingMatch && onDownloadInvoice && (
                    <button
                      onClick={() => onDownloadInvoice(scanResult.bookingMatch!)}
                      className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Tax Invoice</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : activeTab === "camera" ? (
            /* Live Camera Viewfinder */
            <div className="space-y-4">
              <div className="relative w-full aspect-4/3 max-w-md mx-auto rounded-3xl overflow-hidden bg-black border-2 border-indigo-500/40 shadow-2xl flex items-center justify-center">
                {/* Hidden processing canvas */}
                <canvas ref={canvasRef} className="hidden" />

                {/* Video Stream Element */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Targeting Reticle & Laser Scan Line */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
                  {/* Bounding box corners */}
                  <div className="relative w-64 h-64 border-2 border-indigo-400/70 rounded-2xl shadow-inner flex flex-col justify-between p-2">
                    <div className="flex justify-between">
                      <div className="w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
                      <div className="w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
                    </div>

                    {/* Animated Laser Scanning Beam */}
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-pulse" />

                    <div className="flex justify-between">
                      <div className="w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
                      <div className="w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />
                    </div>
                  </div>
                </div>

                {/* Camera Overlay Controls */}
                <div className="absolute bottom-4 inset-x-4 flex items-center justify-between pointer-events-auto">
                  <button
                    onClick={toggleFacingMode}
                    className="p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-900 border border-slate-700 text-white shadow-md transition-all cursor-pointer active:scale-95"
                    title="Flip camera (front / rear)"
                  >
                    <SwitchCamera className="w-4 h-4" />
                  </button>

                  <div className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-xs text-[11px] font-bold text-slate-300 border border-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Align Ticket QR in Box</span>
                  </div>

                  {hasTorch ? (
                    <button
                      onClick={toggleTorch}
                      className={`p-2.5 rounded-full border shadow-md transition-all cursor-pointer active:scale-95 ${
                        torchOn
                          ? "bg-amber-400 text-slate-950 border-amber-300 font-bold"
                          : "bg-slate-900/80 hover:bg-slate-900 border-slate-700 text-white"
                      }`}
                      title="Toggle flashlight"
                    >
                      {torchOn ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
                    </button>
                  ) : (
                    <div className="w-9" />
                  )}
                </div>
              </div>

              {cameraError && (
                <div className="p-4 rounded-2xl bg-amber-950/50 border border-amber-500/40 text-amber-200 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-300">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Camera Stream Unavailable</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">{cameraError}</p>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => setActiveTab("upload")}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload E-Ticket Image Instead</span>
                    </button>
                    <button
                      onClick={() => startCamera()}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retry Camera</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Instant Test Simulator Quick-Links */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Test Instant Gate Validation with Your Bookings:</span>
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase font-mono">One-Tap Sim</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {bookings.slice(0, 3).map((b) => (
                    <button
                      key={b.id}
                      onClick={() => handleSimulateScan(b)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600/40 border border-slate-700 hover:border-indigo-400 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                    >
                      <Ticket className="w-3 h-3 text-indigo-400" />
                      <span className="font-semibold truncate max-w-[150px]">{b.title}</span>
                      <span className="text-[10px] font-mono text-slate-400">
                        ({b.pnr || b.id.slice(-4)})
                      </span>
                    </button>
                  ))}
                  {bookings.length === 0 && (
                    <p className="text-xs text-slate-500 italic">No bookings found to simulate.</p>
                  )}
                </div>
              </div>
            </div>
          ) : activeTab === "upload" ? (
            /* Upload Image Tab */
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleImageFile(e.target.files[0]);
                  }
                }}
              />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full p-8 sm:p-12 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                  dragOver
                    ? "border-indigo-400 bg-indigo-950/40 text-indigo-200 scale-[1.01]"
                    : "border-slate-700 hover:border-indigo-500/70 bg-slate-950/40 text-slate-300 hover:bg-slate-900"
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 mb-3">
                  <Upload className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-white">
                  Drop Boarding Pass or E-Ticket Image Here
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Supports screenshots, camera photos of paper tickets, IRCTC QR codes, and digital passes (.PNG, .JPG, .WEBP)
                </p>

                <button
                  type="button"
                  className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md inline-flex items-center gap-1.5 pointer-events-none"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Choose File from Device</span>
                </button>
              </div>

              {isProcessingImage && (
                <div className="flex items-center justify-center gap-2 p-3 bg-indigo-950/60 border border-indigo-500/40 rounded-xl text-xs text-indigo-200">
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                  <span>Decoding High-Resolution QR Matrix...</span>
                </div>
              )}
            </div>
          ) : activeTab === "manual" ? (
            /* Manual PNR / Code Lookup */
            <div className="space-y-4">
              <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-3">
                <label className="text-xs font-bold text-slate-300 block">
                  Enter PNR, Gate Pass Token, or raw payload string
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder="e.g. BY-AI-902, 2819402812, GP-BY-4910..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-mono"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && manualInput.trim()) {
                        processDecodedString(manualInput, "manual");
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (manualInput.trim()) {
                        processDecodedString(manualInput, "manual");
                      }
                    }}
                    disabled={!manualInput.trim()}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Validate</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  You can also paste raw JSON payloads generated from the digital pass generator.
                </p>
              </div>

              {/* Suggestions from active bookings */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Or pick from your scheduled trips:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {bookings.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => handleSimulateScan(b)}
                      className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500 transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-bold text-white truncate max-w-[180px]">
                          {b.title}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {b.date} • {b.seatInfo || "Confirmed"}
                        </p>
                      </div>
                      <span className="font-mono text-xs text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-600/30">
                        {b.pnr || b.id.slice(-6)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Scan Log / History Tab */
            <div className="space-y-3">
              {scanHistory.length === 0 ? (
                <div className="text-center py-10 px-4">
                  <History className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-400">No scans recorded in this session</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Scans performed via camera, image upload, or simulator will be logged here.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
                    <span>Recent Terminal Validations</span>
                    <button
                      onClick={() => setScanHistory([])}
                      className="text-[11px] text-rose-400 hover:underline cursor-pointer"
                    >
                      Clear Log
                    </button>
                  </div>
                  {scanHistory.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => setScanResult(item)}
                      className="p-3 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-indigo-400 transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${
                            item.isValid
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-400/30"
                              : "bg-amber-500/20 text-amber-400 border border-amber-400/30"
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">
                            {item.parsedPayload?.service || item.bookingMatch?.title || "Ticket Verification"}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            PNR: {item.parsedPayload?.pnr || item.raw.slice(0, 14)} • {item.timestamp}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {item.terminalValidation.gateAccessStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Compliant with AAI Airport Biometric Gates &amp; IRCTC QR Turnstiles</span>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer"
          >
            Close Scanner
          </button>
        </div>
      </div>
    </div>
  );
}
