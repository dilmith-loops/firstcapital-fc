import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { QuizFlow, ProfileInfo, ProfileKey } from "@/components/quiz/QuizFlow";

interface QuizModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: (result: ProfileInfo, answers: Record<number, ProfileKey>) => void;
}

export function QuizModal({ open, onOpenChange, onComplete }: QuizModalProps) {
  const handleExploreMatch = (result: ProfileInfo) => {
    onOpenChange(false);
    setTimeout(() => {
      const optionsEl = document.getElementById("options");
      if (optionsEl) {
        optionsEl.scrollIntoView({ behavior: "smooth" });
      }
    }, 150);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl w-[95vw] max-h-[96vh] flex flex-col p-0 !rounded-[28px] sm:!rounded-[32px] bg-white border-0 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden">
        <DialogTitle className="sr-only">Investor Personality Quiz</DialogTitle>
        <DialogDescription className="sr-only">
          Interactive quiz to find your investor personality and investment match
        </DialogDescription>

        {/* Modal Scrollable Body with hidden scrollbar */}
        <div
          className="flex-1 overflow-y-auto no-scrollbar px-4 sm:px-6 pt-5 sm:pt-6 pb-3 sm:pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <QuizFlow
            showCardContainer={false}
            onExploreMatch={handleExploreMatch}
            onComplete={(result, answers) => {
              if (onComplete) onComplete(result, answers);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
