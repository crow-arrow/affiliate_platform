import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";
import { uploadAvatar, resetAvatarStatus, deleteAvatar } from "../../redux/features/auth/authSlice";
import { CustomFileInput } from "./CustomFileInput";
import "react-advanced-cropper/dist/themes/corners.css";
import { Button, buttonVariants } from "@/components/ui/button";
import { Loader2Icon, Trash2Icon, UploadIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn, getAvatarUrl } from "@/lib/utils";

export const CropAvatar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const dispatch = useAppDispatch();
  const { avatarStatus, status, message, errors, avatar, user } = useAppSelector((state) => ({
    avatarStatus: state.auth.avatarStatus,
    status: state.auth.status,
    message: state.auth.message,
    errors: state.auth.errors,
    avatar: state.auth.user?.avatarUrl,
    user: state.auth.user,
  }));
  const currentAvatarUrl = avatar ? getAvatarUrl(avatar) : null;
  const fallbackInitials =
    [user?.first_name?.[0], user?.last_name?.[0]].filter(Boolean).join("").toUpperCase() || "JT";
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(resetAvatarStatus());
  }, [dispatch, isOpen]);

  useEffect(() => {
    if (avatarStatus === "succeeded" && message) {
      toast.success(message);
    }
  }, [avatarStatus, message]);

  const handleImageSelected = (imageDataUrl: string) => {
    setPreview(imageDataUrl);
  };

  const handleClose = () => {
    dispatch(resetAvatarStatus());
    onClose();
  };

  const handleUploadAvatar = async () => {
    if (!preview) {
      toast.error("Choose and crop an image first");
      return;
    }
    setLoading(true);
    const blob = await fetch(preview).then((res) => res.blob());
    const file = new File([blob], "avatar.webp", { type: "image/webp" });
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      await dispatch(uploadAvatar(formData)).unwrap();
      dispatch(resetAvatarStatus());
      onClose();
    } catch (error: unknown) {
      console.error("Error during avatar upload:", error);
      toast.error((error as { message?: string })?.message || "Error during uploading avatar");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      if (!avatar) {
        toast.error("No avatar to delete");
        return;
      }
      await dispatch(deleteAvatar()).unwrap();
      dispatch(resetAvatarStatus());
      onClose();
      toast.success("Avatar deleted successfully");
    } catch (error: unknown) {
      toast.error((error as { message?: string })?.message || "Error during deleting avatar");
    } finally {
      setIsAlertDialogOpen(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent
        className={cn(
          "w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] sm:max-w-lg md:max-w-2xl lg:max-w-3xl",
          "max-h-[calc(100dvh-2rem)] overflow-y-auto overflow-x-hidden",
          "p-4 sm:p-5 md:p-6 gap-4 sm:gap-5 md:gap-6",
          "rounded-xl border-border",
          "flex flex-col"
        )}
      >
        <DialogHeader className="flex-shrink-0 text-center sm:text-left space-y-1 sm:space-y-1.5">
          <DialogTitle className="text-lg sm:text-xl">Change avatar</DialogTitle>
          <DialogDescription className="text-sm">
            Choose an image, adjust the crop, then upload or delete the current avatar.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 min-h-0 flex-1">
          <CustomFileInput
            mimeTypes="image/jpeg, image/png, image/webp, image/avif"
            onImageSelected={handleImageSelected}
            allowedFileTypes={["image/jpeg", "image/png", "image/webp", "image/avif"]}
            currentAvatarUrl={currentAvatarUrl}
            fallbackInitials={fallbackInitials}
          />
          <DialogFooter className="flex flex-row gap-4 justify-end flex-shrink-0">
            <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="icon"
                  disabled={!avatar}
                  className="shrink-0 h-9 w-9 sm:h-9 sm:w-9"
                >
                  <Trash2Icon className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="sm:max-w-sm max-w-[calc(100vw-2rem)] items-center justify-center">
                <AlertDialogHeader className="flex flex-col gap-2">
                  <div className="flex flex-wrap gap-2 self-center">
                    <Badge variant="destructive" className="w-10 h-10">
                      <Trash2Icon />
                    </Badge>
                  </div>
                  <AlertDialogTitle className="text-center">Delete avatar?</AlertDialogTitle>
                  <AlertDialogDescription className="text-center">
                    This will permanently delete your avatar.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex w-full justify-center">
                  <AlertDialogCancel className="w-full">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className={`${buttonVariants({ variant: "destructive" })} flex w-full justify-center`}
                    onClick={handleDeleteAvatar}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button
              onClick={handleUploadAvatar}
              disabled={loading}
              className="w-fit flex-1 sm:flex-none sm:self-end sm:w-auto min-w-[150px] disabled:cursor-progress"
            >
              {loading ? (
                <>
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <UploadIcon className="h-4 w-4" />
                  Upload Avatar
                </>
              )}
            </Button>
          </DialogFooter>
        </div>
        {status === "failed" && (
          <p className="text-sm text-destructive flex-shrink-0">
            {Array.isArray(errors) && (errors[0] as { message?: string })?.message
              ? (errors[0] as { message?: string }).message
              : "Upload failed"}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};
