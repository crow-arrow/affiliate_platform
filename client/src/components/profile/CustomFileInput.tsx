import { useState, useRef } from "react";
import { toast } from "sonner";
import "react-advanced-cropper/dist/style.css";
import { Cropper, CircleStencil, type CropperRef } from "react-advanced-cropper";
import "react-advanced-cropper/dist/themes/corners.css";
import { X, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import profileBlank from "@/assets/avatar.webp";

export interface CustomFileInputProps {
  width?: number;
  height?: number;
  mimeTypes?: string;
  onImageSelected?: (dataUrl: string) => void;
  maxFileSize?: number;
  allowedFileTypes?: string[];
  /** URL текущего аватара — показывается в превью, пока не выбран новый кроп */
  currentAvatarUrl?: string | null;
  /** Инициалы пользователя для fallback, когда нет картинки (например "JD") */
  fallbackInitials?: string;
  /** На мобильных: открыть камеру (user = фронтальная, environment = задняя). Не задано = галерея/файлы */
  capture?: "user" | "environment";
}

export const CustomFileInput = ({
  mimeTypes = "image/jpeg, image/png",
  onImageSelected,
  maxFileSize = 5 * 1024 * 1024,
  allowedFileTypes = ["image/jpeg", "image/png"],
  currentAvatarUrl = null,
  fallbackInitials = "",
  capture,
}: CustomFileInputProps) => {
  const dropAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<CropperRef>(null);

  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [croppedImagePreview, setCroppedImagePreview] = useState<string | null>(null);

  const onInteractionEnd = () => {
    const cropper = cropperRef.current;
    if (cropper) {
      const canvas = cropper.getCanvas();
      if (canvas) {
        const previewDataUrl = canvas.toDataURL("image/jpeg", 1.0);
        setCroppedImagePreview(previewDataUrl);
        onImageSelected?.(previewDataUrl);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;
    if (files?.length) {
      handleFile(files[0]);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!allowedFileTypes.includes(file.type)) {
        toast.error(`Invalid format. Please choose one of: ${allowedFileTypes.join(", ")}`);
        event.target.value = "";
        return;
      }
      if (file.size > maxFileSize) {
        const maxSizeMB = (maxFileSize / (1024 * 1024)).toFixed(0);
        toast.error(`File is too big! Max size is: ${maxSizeMB}MB.`);
        event.target.value = "";
        return;
      }
      handleFile(file);
    } else {
      setImage(null);
      setCroppedImagePreview(null);
    }
  };

  const handleFile = (file: File) => {
    const allowedTypes = mimeTypes.split(",").map((t) => t.trim());
    if (!allowedTypes.includes(file.type)) {
      toast.error(`Invalid format. Please choose one of: ${allowedTypes.join(", ")}`);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      setImage(typeof result === "string" ? result : null);
      setCroppedImagePreview(null);
      const applyInitialCrop = () => {
        const cropper = cropperRef.current;
        if (cropper) {
          const canvas = cropper.getCanvas();
          if (canvas) {
            const dataUrl = canvas.toDataURL("image/jpeg", 1.0);
            setCroppedImagePreview(dataUrl);
            onImageSelected?.(dataUrl);
            return true;
          }
        }
        return false;
      };
      setTimeout(() => {
        if (!applyInitialCrop()) {
          setTimeout(applyInitialCrop, 150);
        }
      }, 100);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleCloseImage = () => {
    setImage(null);
    setCroppedImagePreview(null);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 sm:gap-5 md:gap-6 justify-between items-stretch md:items-center w-full min-w-0">
      {/* Зона загрузки: flex-[2] — занимает 2/3 ширины на десктопе */}
      <Card
        ref={dropAreaRef}
        className={cn(
          "relative overflow-hidden border-2 border-dashed rounded-xl cursor-pointer transition-colors touch-manipulation min-w-0",
          "w-full h-full",
          "md:flex-[2] md:basis-0",
          "lg:flex-[3]",
          "order-1 md:-order-1",
          isDragging && "bg-muted border-primary/50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="relative p-0 w-full h-full min-h-[180px] md:min-h-[242px] lg:min-h-[274px] flex items-center justify-center">
          {image ? (
            <div className="absolute inset-0 w-full h-full z-10">
              <img
                src={image}
                alt="Crop area"
                className="absolute inset-0 w-full h-full object-contain opacity-10 pointer-events-none"
              />
              <Cropper
                ref={cropperRef}
                src={image}
                onInteractionEnd={onInteractionEnd}
                aspectRatio={() => 1}
                stencilComponent={CircleStencil}
                className="z-20 h-full w-full"
              />
            </div>
          ) : (
            <button
              type="button"
              className="h-full min-h-[180px] md:min-h-[242px] lg:min-h-[274px] w-full flex flex-col gap-2 sm:gap-3 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 active:bg-muted touch-manipulation p-4 rounded-xl"
              onClick={triggerFileInput}
            >
              <Upload className="h-10 w-10 sm:h-8 sm:w-8 shrink-0" aria-hidden />
              <span className="text-sm sm:text-base font-medium">Tap to choose photo</span>
              <span className="text-xs text-muted-foreground/80">or drag file here</span>
            </button>
          )}
          {/* Когда есть image, не перехватываем тапы — работают кнопка «Очистить» и кроппер */}
          <span className={cn("absolute inset-0 z-0", image && "pointer-events-none")}>
            <input
              type="file"
              accept={mimeTypes}
              capture={capture}
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-[0] file:border-0 file:bg-transparent"
              ref={fileInputRef}
              aria-label="Choose or take a photo"
            />
          </span>
        </CardContent>
      </Card>

      {/* Превью: flex-1 — занимает 1/3 ширины на десктопе */}
      <Card className="w-full md:flex-[1] md:basis-0 md:min-w-0 lg:flex-[2] flex flex-col items-center shrink-0 md:shrink">
        <CardContent className="flex flex-col gap-3 md:gap-4 items-center py-4 md:pt-6">
          <Badge variant="outline">
            <Label className="text-muted-foreground text-xs md:text-sm">Preview</Label>
          </Badge>
          <Avatar className="h-28 w-28 md:h-40 md:w-40 lg:h-48 lg:w-48 rounded-full border border-border shrink-0 max-w-full">
            <AvatarImage
              src={croppedImagePreview ?? currentAvatarUrl ?? undefined}
              alt="Preview"
              className="object-cover"
            />
            <AvatarFallback className="text-4xl sm:text-5xl font-medium rounded-full">
              {fallbackInitials}
            </AvatarFallback>
          </Avatar>
        </CardContent>
      </Card>
    </div>
  );
};
