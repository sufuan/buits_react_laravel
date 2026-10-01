import { useEffect, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { AlertCircle, Camera } from 'lucide-react';

export default function BarcodeScanner({ onDetected }) {
    const scannerRef = useRef(null);
    const detectedRef = useRef(false);
    const onDetectedRef = useRef(onDetected);

    useEffect(() => {
        onDetectedRef.current = onDetected;
    }, [onDetected]);

    useEffect(() => {
        const scanner = new Html5Qrcode('registration-barcode-reader');
        scannerRef.current = scanner;

        scanner.start(
            { facingMode: 'environment' },
            {
                fps: 10,
                qrbox: { width: 280, height: 120 },
                formatsToSupport: [Html5QrcodeSupportedFormats.CODE_128],
            },
            (decodedText) => {
                if (detectedRef.current) return;
                detectedRef.current = true;
                onDetectedRef.current(decodedText.trim());
            },
            () => {}
        ).catch(() => {});

        return () => {
            if (scannerRef.current?.isScanning) {
                scannerRef.current.stop().catch(() => {});
            }
        };
    }, []);

    return (
        <div className="space-y-3">
            <div id="registration-barcode-reader" className="overflow-hidden rounded-lg border border-gray-200" />
            <p className="flex items-center gap-2 text-xs text-gray-500">
                <Camera className="h-4 w-4" />
                Point the camera at the barcode in the registration email.
            </p>
            <p className="flex items-center gap-2 text-xs text-amber-700">
                <AlertCircle className="h-4 w-4" />
                Camera access requires HTTPS or localhost.
            </p>
        </div>
    );
}