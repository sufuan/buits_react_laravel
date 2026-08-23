import React, { useRef, useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Upload, Trash2 } from 'lucide-react';

export default function ProfilePhotoUpload({ user }) {
    const fileInputRef = useRef(null);
    const [processingPhoto, setProcessingPhoto] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    const handlePhotoSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            router.post(route('profile.photo.upload'), {
                photo: file
            }, {
                preserveScroll: true,
                onBefore: () => {
                    setProcessingPhoto(true);
                    setUploadError(null);
                },
                onSuccess: () => {
                    setProcessingPhoto(false);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                },
                onError: (errs) => {
                    setProcessingPhoto(false);
                    if (errs.photo) {
                        setUploadError(errs.photo);
                    }
                },
                onFinish: () => {
                    setProcessingPhoto(false);
                }
            });
        }
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete your profile photo?')) {
            router.delete(route('profile.photo.delete'), {
                preserveScroll: true,
                onBefore: () => setProcessingPhoto(true),
                onFinish: () => setProcessingPhoto(false)
            });
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <Card id="photo-upload-section">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Profile Photo
                </CardTitle>
                <CardDescription>
                    Update your avatar. Recommended size: 500x500px.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Photo Preview */}
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg flex items-center justify-center">
                            {user?.image ? (
                                <img 
                                    src={`/storage/${user.image}`} 
                                    alt={user.name} 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <UserPlaceholder />
                            )}
                        </div>
                        
                        {/* Overlay for quick upload */}
                        <button 
                            onClick={triggerFileInput}
                            disabled={processingPhoto}
                            className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                        >
                            <Upload className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 flex-1 w-full sm:w-auto">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handlePhotoSelect}
                            className="hidden"
                            accept="image/jpeg, image/png, image/webp"
                        />
                        
                        <Button 
                            onClick={triggerFileInput} 
                            disabled={processingPhoto}
                            className="w-full sm:w-auto"
                        >
                            {processingPhoto ? 'Uploading...' : 'Upload New Photo'}
                        </Button>

                        {user?.image && (
                            <Button 
                                variant="outline" 
                                className="w-full sm:w-auto text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={handleDelete}
                                disabled={processingPhoto}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove Photo
                            </Button>
                        )}
                        
                        {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

const UserPlaceholder = () => (
    <svg className="w-16 h-16 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);
