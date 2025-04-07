"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

interface DialogImagePreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  title: string;
}

export function DialogImagePreview({
  open,
  onOpenChange,
  imageUrl,
  title,
}: DialogImagePreviewProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center">
          <div className="relative h-80 w-64 overflow-hidden rounded-md shadow-sm">
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
