import { useState, useRef } from "react";
import { toast } from "react-toastify";
import 'react-advanced-cropper/dist/style.css';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import PropTypes from 'prop-types';
import { Cropper, CircleStencil } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/themes/corners.css';

export const CustomFileInput = ({
    width = 390,
    height = 290,
    mimeTypes = "image/jpeg, image/png",
    onImageSelected,
    maxFileSize = 5 * 1024 * 1024,
    allowedFileTypes = ['image/jpeg', 'image/png'],
    onImageCropped,
}) => {
    const dropAreaRef = useRef(null);
    const fileInputRef = useRef(null);
    const cropperRef = useRef(null);
    const [cropImage, setCropImage] = useState(null);
    const [croppedPreview, setCroppedPreview] = useState(null);

    const [image, setImage] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

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
                toast.error(`Invalid format. Please, choise folowing format: ${allowedFileTypes.join(', ')}`);
                event.target.value = "";
                return;
            }

            if (file.size > maxFileSize) {
                const maxSizeMB = (maxFileSize / (1024 * 1024)).toFixed(0);
                toast.error(`File is to big! Max size is: ${maxSizeMB}MB.`);
                event.target.value = "";
                return;
            }

            handleFile(file);
        } else {
            setImage(null);
            setCropImage(null);
            setCroppedPreview(null);
        }
    };

    const handleFile = (file) => {
        const allowedTypes = mimeTypes.split(',').map(type => type.trim());
        if (!allowedTypes.includes(file.type)) {
            toast.error(`Invalid format. Please, choise folowing format: ${allowedTypes.join(', ')}`);
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result);
            setCropImage(reader.result);
            if (onImageSelected) {
                onImageSelected(reader.result);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleCrop = () => {
        if (cropperRef.current && cropperRef.current.cropper) {
            const canvas = cropperRef.current.cropper.getCroppedCanvas();
            if (canvas) {
                const croppedImageDataUrl = canvas.toDataURL('image/png');
                setCroppedPreview(croppedImageDataUrl); // Устанавливаем локальный превью
                if (onImageCropped) {
                    onImageCropped(croppedImageDataUrl); // Передаем обрезанное изображение родителю
                }
            }
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleCloseImage = () => {
        setImage(null);
        setCropImage(null);
        setCroppedPreview(null);
    };

    return (
        <div className="flex gap-16 items-start">
            <div
                ref={dropAreaRef}
                className={`relative w-[${width}px] h-[${height}px] border-2 border-dashed border-gray-400 rounded-xl flex items-center justify-center cursor-pointer ${isDragging ? 'bg-gray-100' : 'bg-white'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {image ? (
                    <div className="relative w-full h-full">
                        <img src={image} alt="Image" className="absolute top-0 left-0 w-full h-full object-contain"/>
                        <button className="absolute top-4 right-4 text-xl z-30" onClick={handleCloseImage}>
                            <CloseOutlinedIcon />
                        </button>
                        <Cropper
                            ref={cropperRef}
                            src={cropImage}
                            aspectRatio={1 / 1}
                            stencilComponent={CircleStencil}
                            onCrop={handleCrop}
                            className="z-20"
                        />
                    </div>
                ) : (
                <button onClick={triggerFileInput} className="text-gray-400 font-bold w-full h-full">
                    <span>Выберите файл</span>
                </button>
                )}
                <input
                type="file"
                accept={mimeTypes}
                onChange={handleFileChange}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                ref={fileInputRef} // Привязываем ref к скрытому инпуту
                />
            </div>
            {croppedPreview && (
                <div className="flex flex-col items-center">
                    <span className="text-sm mb-1">Превью</span>
                    <div className="w-24 h-24 rounded-full overflow-hidden shadow-md">
                        <img src={croppedPreview} alt="Обрезанный аватар" className="w-full h-full object-cover" />
                    </div>
                </div>
            )}
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
    onImageCropped: PropTypes.func,
};