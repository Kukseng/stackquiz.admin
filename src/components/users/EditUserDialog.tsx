import React, { useState, useRef } from 'react';
import { Pencil, Upload, X, Loader2, Image, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UpdateUserForm } from '@/types/user.types';
import { useUploadSingleMediaMutation } from '@/services/adminApi';
import { useToast } from "@/hooks/use-toast";

interface EditUserDialogProps {
  open: boolean;
  formData: UpdateUserForm;
  onOpenChange: (open: boolean) => void;
  onFormChange: (data: UpdateUserForm) => void;
  onSave: () => void;
}

export const EditUserDialog: React.FC<EditUserDialogProps> = ({
  open,
  formData,
  onOpenChange,
  onFormChange,
  onSave,
}) => {
  const [uploadSingleMedia, { isLoading: isUploading }] = useUploadSingleMediaMutation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError("");

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError("Please select a valid image file (JPG, PNG, GIF, or WebP)");
      toast({
        title: "Invalid File",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
      setUploadError(`File is too large (${fileSizeMB}MB). Maximum size is 5MB.`);
      toast({
        title: "File Too Large",
        description: `Please select an image smaller than 5MB (current: ${fileSizeMB}MB)`,
        variant: "destructive",
      });
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file to /api/v1/medias/upload-single
    try {
      const response = await uploadSingleMedia(file).unwrap();
      
      // Response structure: { name, extension, mimeTypeFile, uri, size }
      if (response.uri) {
        onFormChange({ 
          ...formData, 
          avatarUrl: response.uri 
        });

        toast({
          title: "✅ Success",
          description: "Avatar uploaded successfully",
          className: "bg-green-50 border-green-200",
        });
      } else {
        throw new Error("No URI returned from upload");
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      setPreviewUrl(""); // Clear preview on error
      
      const errorMessage = error?.data?.message || error?.message || "Failed to upload image. Please try again.";
      setUploadError(errorMessage);
      
      toast({
        title: "❌ Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleRemoveAvatar = () => {
    onFormChange({ ...formData, avatarUrl: "" });
    setPreviewUrl("");
    setUploadError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  // Update preview when dialog opens with existing avatar
  React.useEffect(() => {
    if (open && formData.avatarUrl) {
      setPreviewUrl(formData.avatarUrl);
    } else if (!open) {
      setPreviewUrl("");
      setUploadError("");
    }
  }, [open, formData.avatarUrl]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-5 w-5" />
            Edit User
          </DialogTitle>
          <DialogDescription>
            Update user information. Changes will be reflected immediately.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => onFormChange({ ...formData, firstName: e.target.value })}
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => onFormChange({ ...formData, lastName: e.target.value })}
                placeholder="Doe"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => onFormChange({ ...formData, email: e.target.value })}
              placeholder="john.doe@example.com"
            />
          </div>
          
          {/* Avatar Upload Section */}
          <div className="space-y-2">
            <Label>Avatar Image</Label>
            
            {uploadError && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}
            
            <div className="flex items-start gap-4">
              {/* Preview */}
              <div className="flex-shrink-0">
                {previewUrl || formData.avatarUrl ? (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200 bg-white">
                    <img
                      src={previewUrl || formData.avatarUrl}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                      onError={() => setUploadError("Failed to load image")}
                    />
                    {!isUploading && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
                        title="Remove avatar"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="h-6 w-6 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                    <Image className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-1 space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isUploading}
                />
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBrowseClick}
                  disabled={isUploading}
                  className="w-full"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Image
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500">
                  JPG, PNG, GIF or WebP (max. 5MB)
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profileUser">Profile Bio</Label>
            <Input
              id="profileUser"
              value={formData.profileUser}
              onChange={(e) => onFormChange({ ...formData, profileUser: e.target.value })}
              placeholder="A brief description about the user"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button 
            onClick={onSave}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};