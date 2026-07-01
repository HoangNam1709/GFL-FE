import { useState, useRef, useEffect } from "react";

export interface ImageState {
  file: File | null;
  preview: string;
}

export function useVehicleImages() {
  const plateInputRef = useRef<HTMLInputElement>(null);
  const vehicleInputRef = useRef<HTMLInputElement>(null);
  const faceInputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<{
    plate: ImageState;
    vehicle: ImageState;
    face: ImageState;
  }>({
    plate: { file: null, preview: "" },
    vehicle: { file: null, preview: "" },
    face: { file: null, preview: "" },
  });

  // Tự động dọn dẹp bộ nhớ cache ảnh khi unmount hoặc thay đổi ảnh
  useEffect(() => {
    return () => {
      if (images.plate.preview) URL.revokeObjectURL(images.plate.preview);
      if (images.vehicle.preview) URL.revokeObjectURL(images.vehicle.preview);
      if (images.face.preview) URL.revokeObjectURL(images.face.preview);
    };
  }, [images.plate.preview, images.vehicle.preview, images.face.preview]);

  const handleImageChange = (type: "plate" | "vehicle" | "face") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (images[type].preview) URL.revokeObjectURL(images[type].preview);
      setImages((prev) => ({
        ...prev,
        [type]: { file, preview: URL.createObjectURL(file) },
      }));
    }
  };

  const handleRemoveImage = (type: "plate" | "vehicle" | "face") => {
    if (images[type].preview) URL.revokeObjectURL(images[type].preview);
    setImages((prev) => ({ ...prev, [type]: { file: null, preview: "" } }));
  };

  const resetImages = () => {
    if (images.plate.preview) URL.revokeObjectURL(images.plate.preview);
    if (images.vehicle.preview) URL.revokeObjectURL(images.vehicle.preview);
    if (images.face.preview) URL.revokeObjectURL(images.face.preview);
    setImages({
      plate: { file: null, preview: "" },
      vehicle: { file: null, preview: "" },
      face: { file: null, preview: "" },
    });
  };

  return {
    images,
    refs: { plateInputRef, vehicleInputRef, faceInputRef },
    handleImageChange,
    handleRemoveImage,
    resetImages
  };
}