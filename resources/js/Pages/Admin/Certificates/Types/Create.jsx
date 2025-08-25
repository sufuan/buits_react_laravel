import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import { useForm, Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function CertificateTypeCreate({ shortCodes, staffShortCodes }) {
    const { data, setData, post, errors, processing } = useForm({
        name: '',
        usertype: '',
        short_code: [],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.certificate.types.store'));
    };

    return (
        <AdminAuthenticatedLayout header="Create Certificate Type">
            <Head title="Create Certificate Type" />

            <div className="space-y-6">
                {/* Header with back button */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.history.back()}
                        className="gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Create Certificate Type</CardTitle>
                        <CardDescription>
                            Create a new certificate type with the form below.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Enter certificate type name"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">{errors.name}</p>
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="usertype">User Type</Label>
                                    <Select
                                        value={data.usertype}
                                        onValueChange={(value) => setData('usertype', value)}
                                        required
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select user type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="student">Student</SelectItem>
                                            <SelectItem value="staff">Staff</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.usertype && (
                                        <p className="text-sm text-destructive">{errors.usertype}</p>
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <Label>Short Codes</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Select the short codes that will be available for this certificate type.
                                    </p>
                                    <Card>
                                        <ScrollArea className="h-72 rounded-md border">
                                            <div className="p-4">
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                    {(data.usertype === 'staff' ? staffShortCodes : shortCodes).map(code => (
                                                        <div key={code} className="flex items-start space-x-2">
                                                            <Checkbox
                                                                id={code}
                                                                checked={data.short_code.includes(code)}
                                                                onCheckedChange={(checked) => {
                                                                    const selected = [...data.short_code];
                                                                    if (checked) {
                                                                        selected.push(code);
                                                                    } else {
                                                                        selected.splice(selected.indexOf(code), 1);
                                                                    }
                                                                    setData('short_code', selected);
                                                                }}
                                                            />
                                                            <Label
                                                                htmlFor={code}
                                                                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                            >
                                                                {code}
                                                            </Label>
                                                        </div>
                                                    ))}
                                                </div>
                                                {data.usertype && (data.usertype === 'staff' ? staffShortCodes : shortCodes).length === 0 && (
                                                    <p className="text-sm text-muted-foreground text-center py-4">
                                                        No short codes available for {data.usertype} type.
                                                    </p>
                                                )}
                                            </div>
                                        </ScrollArea>
                                    </Card>
                                    {errors.short_code && (
                                        <p className="text-sm text-destructive">{errors.short_code}</p>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating...' : 'Create Certificate Type'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
