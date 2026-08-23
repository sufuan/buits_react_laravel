import React from 'react';
import { AlertCircle, Camera } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export default function ProfilePhotoPrompt({ user }) {
    if (!user || user.usertype !== 'executive' || user.image) {
        return null;
    }

    return (
        <Alert variant="default" className="mb-6 bg-purple-50 border-purple-200 text-purple-900">
            <AlertCircle className="h-5 w-5 text-purple-600" />
            <AlertTitle className="font-semibold text-purple-800 text-lg">Action Required: Profile Photo</AlertTitle>
            <AlertDescription className="mt-2 text-purple-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span>
                    You are listed as an Executive Committee Member. Please upload your profile photo so members can recognise you on the committee page!
                </span>
                <Button 
                    size="sm" 
                    className="bg-purple-600 hover:bg-purple-700 text-white shrink-0"
                    onClick={() => {
                        document.getElementById('photo-upload-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                >
                    <Camera className="w-4 h-4 mr-2" />
                    Upload Photo Now
                </Button>
            </AlertDescription>
        </Alert>
    );
}
