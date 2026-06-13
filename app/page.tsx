"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  Upload,
  Pill,
  FileText,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import Header from "@/components/header";
import Hero from "@/components/hero";
import FeatureCards from "@/components/feature-cards";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

type MediSnapResult = {
  name?: string;
  use?: string;
  dosage_general?: string;
  timing_general?: string;
  with_alcohol?: string;
  alternatives?: string[] | string; // 👈 new
  common_side_effects?: string[] | string;
  warnings?: string[] | string;
  disclaimer?: string;
};


type PrescriptionMedicine = {
  name?: string;
  dose?: string;
  frequency?: string;
  timing?: string;
  duration?: string;
};

type PrescriptionResult = {
  patient_name?: string;
  medicines?: PrescriptionMedicine[];
  notes?: string;
  disclaimer?: string;
};

export default function Home() {
  const [isDark, setIsDark] = useState(true);

  // MediSnap state
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MediSnapResult | null>(null);

  // Prescription Reader state
  const [rxFile, setRxFile] = useState<File | null>(null);
  const [rxUploading, setRxUploading] = useState(false);
  const [rxError, setRxError] = useState<string | null>(null);
  const [rxResult, setRxResult] = useState<PrescriptionResult | null>(null);

  const toggleTheme = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newDarkMode);
  };

  // ---------------- MediSnap handlers ----------------

  const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setError("Please choose an image before uploading.");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      setResult(null);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/medisnap", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Unable to analyze image.");
      }

      setResult(data);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong analyzing the image."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const normalizedWarnings = useMemo(() => {
    if (!result?.warnings) return [];
    return Array.isArray(result.warnings)
      ? result.warnings
      : result.warnings
          .split(/[,•]/)
          .map((item) => item.trim())
          .filter(Boolean);
  }, [result]);

  const normalizedSideEffects = useMemo(() => {
    if (!result?.common_side_effects) return [];
    return Array.isArray(result.common_side_effects)
      ? result.common_side_effects
      : result.common_side_effects
          .split(/[,•]/)
          .map((item) => item.trim())
          .filter(Boolean);
  }, [result]); 
  const normalizedAlternatives = useMemo(() => {
    if (!result?.alternatives) return [];
    return Array.isArray(result.alternatives)
      ? result.alternatives
      : result.alternatives
          .split(/[,•]/)
          .map((item) => item.trim())
          .filter(Boolean);
  }, [result]);
  

  // ---------------- Prescription handlers ----------------

  const handleRxUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!rxFile) {
      setRxError("Please choose a prescription image before uploading.");
      return;
    }

    try {
      setRxUploading(true);
      setRxError(null);
      setRxResult(null);

      const formData = new FormData();
      formData.append("file", rxFile);

      const response = await fetch("/api/prescription-reader", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Unable to read prescription.");
      }

      setRxResult(data);
    } catch (err) {
      console.error(err);
      setRxError(
        err instanceof Error
          ? err.message
          : "Something went wrong reading the prescription."
      );
    } finally {
      setRxUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Header isDark={isDark} toggleTheme={toggleTheme} />
      <Hero />
      <FeatureCards />

      {/* -------- MediSnap Section -------- */}
      <section
        id="medisnap"
        className="px-4 py-16 sm:px-6 lg:px-8 bg-muted/30"
      >
        <div className="mx-auto max-w-5xl space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Pill className="h-5 w-5 text-primary" />
                Upload a medicine photo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleUpload}
                className="flex flex-col gap-4 sm:flex-row sm:items-end"
              >
                <div className="flex-1 space-y-2">
                  <Label htmlFor="medisnap-file">Medicine image</Label>
                  <Input
                    id="medisnap-file"
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const selectedFile = event.target.files?.[0] ?? null;
                      setFile(selectedFile);
                      setResult(null);
                      setError(null);
                    }}
                  />
                </div>
                <Button
                  type="submit"
                  className="inline-flex min-w-[180px] items-center justify-center gap-2"
                  disabled={!file || isUploading}
                >
                  <Upload className="h-4 w-4" />
                  {isUploading ? "Analyzing..." : "Send to MediSnap"}
                </Button>
              </form>
              {error && (
                <p className="mt-3 text-sm text-destructive">{error}</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Sparkles className="h-5 w-5 text-primary" />
                All About the Medicine

              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!result && !isUploading && (
                <p className="text-sm text-muted-foreground">
                  Upload a clear photo of a pill strip, blister pack, or bottle
                  label to see general information about the medicine.
                </p>
              )}

              {isUploading && (
                <p className="text-sm text-muted-foreground">
                  Analyzing your image… hang tight!
                </p>
              )}

              {result && (
                <>
                 <div className="grid gap-4 sm:grid-cols-2">
  <div>
    <p className="text-xs font-semibold uppercase text-muted-foreground">
      Name
    </p>
    <p className="text-base font-medium">
      {result.name || "Unknown"}
    </p>
  </div>
  <div>
    <p className="text-xs font-semibold uppercase text-muted-foreground">
      General use
    </p>
    <p className="text-base">
      {result.use || "Not provided"}
    </p>
  </div>
  <div>
    <p className="text-xs font-semibold uppercase text-muted-foreground">
      Dosage guidance
    </p>
    <p className="text-base">
      {result.dosage_general || "As directed by the physician"}
    </p>
  </div>
  <div>
    <p className="text-xs font-semibold uppercase text-muted-foreground">
      Timing guidance
    </p>
    <p className="text-base">
      {result.timing_general || "Follow the schedule advised by your doctor"}
    </p>
  </div>
  <div>
    <p className="text-xs font-semibold uppercase text-muted-foreground">
      With alcohol
    </p>
    <p className="text-base">
      {result.with_alcohol ||
        "Avoid heavy alcohol use with most medicines unless your doctor says otherwise."}
    </p>
  </div>
</div>


<div className="space-y-3">
  {/* Alternatives */}
  <div>
    <p className="text-xs font-semibold uppercase text-muted-foreground">
      Possible alternatives (same / similar salts)
    </p>
    {normalizedAlternatives.length ? (
      <div className="mt-2 flex flex-wrap gap-2">
        {normalizedAlternatives.map((alt) => (
          <Badge key={alt} variant="outline">
            {alt}
          </Badge>
        ))}
      </div>
    ) : (
      <p className="text-sm text-muted-foreground">
        Not provided
      </p>
    )}
  </div>

  {/* Common side effects */}
  <div>
    <p className="text-xs font-semibold uppercase text-muted-foreground">
      Common side effects
    </p>
    {normalizedSideEffects.length ? (
      <div className="mt-2 flex flex-wrap gap-2">
        {normalizedSideEffects.map((effect) => (
          <Badge key={effect} variant="secondary">
            {effect}
          </Badge>
        ))}
      </div>
    ) : (
      <p className="text-sm text-muted-foreground">
        Not provided
      </p>
    )}
  </div>

  {/* Warnings */}
  <div>
    <p className="text-xs font-semibold uppercase text-muted-foreground">
      Warnings
    </p>
    {normalizedWarnings.length ? (
      <ul className="mt-2 list-disc space-y-1 pl-4 text-sm">
        {normalizedWarnings.map((warning) => (
          <li key={warning}>{warning}</li>
        ))}
      </ul>
    ) : (
      <p className="text-sm text-muted-foreground">
        Not provided
      </p>
    )}
  </div>
</div>


                  <div className="flex items-start gap-2 rounded-lg bg-muted p-3 text-sm">
                    <AlertTriangle className="mt-0.5 h-4 w-4 text-yellow-500" />
                    <p>
                      {result.disclaimer ||
                        "This is AI-generated educational information, not a medical prescription. Always follow your doctor's advice."}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* -------- Prescription Reader Section -------- */}
      <section
        id="prescription"
        className="px-4 py-16 sm:px-6 lg:px-8 bg-background"
      >
        <div className="mx-auto max-w-5xl space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <FileText className="h-5 w-5 text-primary" />
                Upload a prescription photo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleRxUpload}
                className="flex flex-col gap-4 sm:flex-row sm:items-end"
              >
                <div className="flex-1 space-y-2">
                  <Label htmlFor="prescription-file">Prescription image</Label>
                  <Input
                    id="prescription-file"
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const selectedFile = event.target.files?.[0] ?? null;
                      setRxFile(selectedFile);
                      setRxResult(null);
                      setRxError(null);
                    }}
                  />
                </div>
                <Button
                  type="submit"
                  className="inline-flex min-w-[210px] items-center justify-center gap-2"
                  disabled={!rxFile || rxUploading}
                >
                  <Upload className="h-4 w-4" />
                  {rxUploading ? "Reading..." : "Read Prescription"}
                </Button>
              </form>
              {rxError && (
                <p className="mt-3 text-sm text-destructive">{rxError}</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-accent/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Sparkles className="h-5 w-5 text-accent" />
                Clean Medicine Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!rxResult && !rxUploading && (
                <p className="text-sm text-muted-foreground">
                  Upload a photo of your doctor&apos;s prescription to see a
                  clear, structured list of medicines, doses, and timings.
                </p>
              )}

              {rxUploading && (
                <p className="text-sm text-muted-foreground">
                  Reading and organizing your prescription…
                </p>
              )}

              {rxResult && (
                <>
                  {rxResult.patient_name && (
                    <div>
                      <p className="text-xs font-semibold uppercase text-muted-foreground">
                        Patient
                      </p>
                      <p className="text-base font-medium">
                        {rxResult.patient_name}
                      </p>
                    </div>
                  )}

                  {Array.isArray(rxResult.medicines) &&
                    rxResult.medicines.length > 0 && (
                      <div className="overflow-x-auto rounded-lg border">
                        <table className="min-w-full text-sm">
                          <thead className="bg-muted">
                            <tr>
                              <th className="px-3 py-2 text-left font-semibold">
                                Medicine
                              </th>
                              <th className="px-3 py-2 text-left font-semibold">
                                Dose
                              </th>
                              <th className="px-3 py-2 text-left font-semibold">
                                Frequency
                              </th>
                              <th className="px-3 py-2 text-left font-semibold">
                                Timing
                              </th>
                              <th className="px-3 py-2 text-left font-semibold">
                                Duration
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {rxResult.medicines.map((med, idx) => (
                              <tr
                                key={idx}
                                className="border-t last:border-b-0"
                              >
                                <td className="px-3 py-2">
                                  {med.name || "Unclear"}
                                </td>
                                <td className="px-3 py-2">
                                  {med.dose || "Unclear"}
                                </td>
                                <td className="px-3 py-2">
                                  {med.frequency || "Unclear"}
                                </td>
                                <td className="px-3 py-2">
                                  {med.timing || "Unclear"}
                                </td>
                                <td className="px-3 py-2">
                                  {med.duration || "Unclear"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                  {rxResult.notes && (
                    <div>
                      <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">
                        Notes
                      </p>
                      <p className="text-sm">{rxResult.notes}</p>
                    </div>
                  )}

                  <div className="flex items-start gap-2 rounded-lg bg-muted p-3 text-sm">
                    <AlertTriangle className="mt-0.5 h-4 w-4 text-yellow-500" />
                    <p>
                      {rxResult.disclaimer ||
                        "This is AI-generated educational information based on your prescription image. Always follow instructions written by your doctor and pharmacist."}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <Contact />
      <Footer />
    </main>
  );
}
