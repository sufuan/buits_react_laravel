import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import {
    CheckCircle,
    XCircle,
    Award,
    User,
    Calendar,
    FileText,
    ExternalLink,
} from 'lucide-react';

export default function Verify({ certificate, error }) {
    return (
        <>
            <Head title="Certificate Verification" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Award className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Certificate Verification</h1>
                        <p className="text-gray-600">Verify the authenticity of issued certificates</p>
                    </div>

                    {/* Verification Result */}
                    {error ? (
                        <Card className="border-red-200 bg-red-50">
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                                    <h2 className="text-2xl font-semibold text-red-900 mb-2">Certificate Not Found</h2>
                                    <p className="text-red-700">{error}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : certificate ? (
                        <div className="space-y-6">
                            {/* Status Badge */}
                            <div className="text-center">
                                <Badge className="bg-green-100 text-green-800 border-green-300 px-6 py-2 text-lg">
                                    <CheckCircle className="w-5 h-5 mr-2 inline" />
                                    Valid Certificate
                                </Badge>
                            </div>

                            {/* Certificate Details */}
                            <Card>
                                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                                    <CardTitle className="flex items-center space-x-2">
                                        <Award className="w-6 h-6" />
                                        <span>Certificate Details</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {/* Left Column */}
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-600 flex items-center space-x-2">
                                                    <FileText className="w-4 h-4" />
                                                    <span>Certificate Number</span>
                                                </label>
                                                <p className="text-lg font-mono font-semibold text-gray-900 mt-1">
                                                    {certificate.number}
                                                </p>
                                            </div>

                                            <div>
                                                <label className="text-sm font-medium text-gray-600 flex items-center space-x-2">
                                                    <Award className="w-4 h-4" />
                                                    <span>Template</span>
                                                </label>
                                                <p className="text-lg font-semibold text-gray-900 mt-1">
                                                    {certificate.template_name}
                                                </p>
                                            </div>

                                            <div>
                                                <label className="text-sm font-medium text-gray-600 flex items-center space-x-2">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>Issued Date</span>
                                                </label>
                                                <p className="text-lg font-semibold text-gray-900 mt-1">
                                                    {certificate.issued_date}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Right Column - User Info */}
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-600 mb-2 block">
                                                    Issued To
                                                </label>
                                                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                        {certificate.user.image ? (
                                                            <img
                                                                src={certificate.user.image}
                                                                alt={certificate.user.name}
                                                                className="w-12 h-12 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <User className="w-6 h-6 text-blue-600" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-gray-900">{certificate.user.name}</p>
                                                        <p className="text-sm text-gray-600">{certificate.user.email}</p>
                                                        {certificate.user.member_id && (
                                                            <p className="text-xs text-gray-500 font-mono mt-1">
                                                                ID: {certificate.user.member_id}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* View Profile Button */}
                                            <Link href={certificate.user.profile_url}>
                                                <Button className="w-full" variant="outline">
                                                    <User className="w-4 h-4 mr-2" />
                                                    View User Profile
                                                    <ExternalLink className="w-4 h-4 ml-2" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Certificate Preview */}
                                    {certificate.certificate_path && (
                                        <div className="mt-6 pt-6 border-t">
                                            <label className="text-sm font-medium text-gray-600 mb-3 block">
                                                Certificate Preview
                                            </label>
                                            <div className="bg-gray-100 rounded-lg p-4 flex justify-center">
                                                <img
                                                    src={certificate.certificate_path}
                                                    alt="Certificate"
                                                    className="max-w-full h-auto rounded shadow-lg"
                                                    style={{ maxHeight: '400px' }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Verification Info */}
                            <Card className="bg-blue-50 border-blue-200">
                                <CardContent className="pt-6">
                                    <div className="flex items-start space-x-3">
                                        <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h3 className="font-semibold text-blue-900 mb-1">Verified Authentic</h3>
                                            <p className="text-sm text-blue-700">
                                                This certificate has been verified as authentic and was issued by the organization.
                                                The information displayed above matches our official records.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : null}

                    {/* Footer */}
                    <div className="text-center mt-8">
                        <Link href="/">
                            <Button variant="ghost">
                                Return to Home
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
