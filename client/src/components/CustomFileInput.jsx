import { useState, useRef } from "react";
import { toast } from "react-toastify";
import "react-advanced-cropper/dist/style.css";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import PropTypes from "prop-types";
import { Cropper, CircleStencil } from "react-advanced-cropper";
import "react-advanced-cropper/dist/themes/corners.css";
import profileBlank from "../assets/profile_blank.webp";

export const CustomFileInput = ({
  width = 390,
  height = 290,
  mimeTypes = "image/jpeg, image/png",
  onImageSelected,
  maxFileSize = 5 * 1024 * 1024,
  allowedFileTypes = ["image/jpeg", "image/png"],
}) => {
  const dropAreaRef = useRef(null);
  const fileInputRef = useRef(null);
  const cropperRef = useRef(null);

  const [image, setImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [croppedImagePreview, setCroppedImagePreview] = useState(null);

  const onInteractionEnd = () => {
    const cropper = cropperRef.current;
    if (cropper) {
      const canvas = cropper.getCanvas();
      if (canvas) {
        const previewDataUrl = canvas.toDataURL("image/jpeg", 1.0);
        setCroppedImagePreview(previewDataUrl);
        if (onImageSelected) {
          onImageSelected(previewDataUrl);
        }
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!allowedFileTypes.includes(file.type)) {
        toast.error(
          `Invalid format. Please choose one of: ${allowedFileTypes.join(", ")}`
        );
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

  const handleFile = (file) => {
    const allowedTypes = mimeTypes.split(",").map((type) => type.trim());
    if (!allowedTypes.includes(file.type)) {
      toast.error(
        `Invalid format. Please choose one of: ${allowedTypes.join(", ")}`
      );
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setCroppedImagePreview(null);
      setTimeout(() => {
        const cropper = cropperRef.current;
        if (cropper) {
          const canvas = cropper.getCanvas();
          if (canvas) {
            setCroppedImagePreview(canvas.toDataURL("image/jpeg", 1.0));
          }
        }
      }, 100);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleCloseImage = () => {
    setImage(null);
    setCroppedImagePreview(null);
  };

  return (
    <div className="flex gap-16 items-start">
      <div
        ref={dropAreaRef}
        className={`relative border-2 border-dashed overflow-hidden 
					border-gray-400 rounded-xl flex items-center justify-center cursor-pointer 
					${isDragging ? "bg-gray-100" : "bg-white"}`}
        style={{ width: `${width}px`, height: `${height}px` }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {image ? (
          <div className="relative w-full h-full">
            <img
              src={image}
              alt="Image"
              className="absolute top-0 left-0 w-full h-full object-contain opacity-10"
            />
            <button
              className="absolute top-4 right-4 text-xl z-30"
              onClick={handleCloseImage}
            >
              <CloseOutlinedIcon />
            </button>
            <Cropper
              ref={cropperRef}
              src={image}
              onInteractionEnd={onInteractionEnd}
              aspectRatio={1 / 1}
              stencilComponent={CircleStencil}
              className="z-20"
            />
          </div>
        ) : (
          <button
            onClick={triggerFileInput}
            className="text-gray-400 font-bold w-full h-full"
          >
            <span>Choose a file</span>
          </button>
        )}
        <input
          type="file"
          accept={mimeTypes}
          onChange={handleFileChange}
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          ref={fileInputRef}
        />
      </div>
      <div className="flex flex-col gap-6 justify-between items-center">
        <span className="text-center text-xl">Preview</span>
        {croppedImagePreview ? (
          <img
            className="w-48 h-auto object-cover rounded-full"
            src={croppedImagePreview}
            alt="Preview"
          />
        ) : (
          <img
            className="w-48 h-auto object-cover rounded-full"
            src={profileBlank}
            alt="Preview"
          />
        )}
      </div>
    </div>
  );
};

CustomFileInput.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  mimeTypes: PropTypes.string,
  onImageSelected: PropTypes.func,
  maxFileSize: PropTypes.number,
  allowedFileTypes: PropTypes.arrayOf(PropTypes.string),
};
