import { useEffect } from 'react';
import { Head } from '@inertiajs/react';

export default function PaymentRedirect({ redirect_url }) {
    useEffect(() => {
        // Redirect to payment gateway immediately
        if (redirect_url) {
            window.location.href = redirect_url;
        }
    }, [redirect_url]);

    return (
        <>
            <Head title="Redirecting to Payment..." />
            
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Redirecting to Payment Gateway
                    </h2>
                    
                    <p className="text-gray-600 mb-6">
                        Please wait while we redirect you to PipraPay to complete your payment...
                    </p>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                            <strong>Note:</strong> If you are not redirected automatically, 
                            <a 
                                href={redirect_url} 
                                className="text-blue-600 hover:text-blue-800 underline ml-1"
                            >
                                click here
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
