import { useCallback, useRef, useState } from "react";
import { pickVerdict, Verdict } from "@/features/home/components/content";

export type Phase = "idle" | "scanning" | "camera" | "preview" | "result";

export function useCornoCheck() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [aborted, setAborted] = useState(false);

  // Guarda a fase atual para o abortScan ler sem depender de closures antigas
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const startScan = useCallback(() => {
    setAborted(false);
    setPhase("scanning");
  }, []);

  const abortScan = useCallback(() => {
    // Só aborta se ainda estiver a analisar (ignora o "levantar o dedo"
    // que chega logo depois de a análise terminar e a câmara abrir)
    if (phaseRef.current !== "scanning") return;
    setAborted(true);
    setPhase("idle");
  }, []);

  const finishScan = useCallback(() => setPhase("camera"), []);

  const takePhoto = useCallback((uri: string) => {
    setPhotoUri(uri);
    setPhase("preview");
  }, []);

  const retake = useCallback(() => {
    setPhotoUri(null);
    setPhase("camera");
  }, []);

  const confirm = useCallback(() => {
    setVerdict(pickVerdict());
    setPhase("result");
  }, []);

  const cancel = useCallback(() => {
    setPhotoUri(null);
    setPhase("idle");
  }, []);

  const reset = useCallback(() => {
    setPhotoUri(null);
    setVerdict(null);
    setAborted(false);
    setPhase("idle");
  }, []);

  return {
    phase,
    photoUri,
    verdict,
    aborted,
    startScan,
    abortScan,
    finishScan,
    takePhoto,
    retake,
    confirm,
    cancel,
    reset,
  };
}
