import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register({ success }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        department: '',
        session: '',
        gender: 'male',
        class_roll: '',
        father_name: '',
        mother_name: '',
        current_address: '',
        permanent_address: '',
        transaction_id: '',
        to_account: '01939378080',
    });

    // Departments from your controller
    const departments = [
        'Marketing',
        'Law',
        'Mathematics',
        'Physics',
        'History & Civilization',
        'Soil & Environmental Sciences',
        'Economics',
        'Geology & Mining',
        'Management Studies',
        'Statistics',
        'Chemistry',
        'Coastal Studies and Disaster Management',
        'Accounting & Information Systems',
        'Computer Science and Engineering',
        'Sociology',
        'Botany',
        'Public Administration',
        'Philosophy',
        'Political Science',
        'Biochemistry and Biotechnology',
        'Finance and Banking',
        'Mass Communication and Journalism',
        'English',
        'Bangla',
    ];

    // Dynamic sessions from 2015 to current year
    const generateSessions = () => {
        const currentYear = new Date().getFullYear();
        const startYear = 2015;
        const sessions = [];
        for (let year = startYear; year <= currentYear; year++) {
            sessions.push(`${year}-${year + 1}`);
        }
        return sessions;
    };

    const sessions = generateSessions();

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            {success && (
                <div className="mb-4 font-medium text-sm text-green-600 bg-green-100 border border-green-300 rounded-md p-3">
                    {success}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="phone" value="Phone" />
                    <TextInput
                        id="phone"
                        type="text"
                        name="phone"
                        value={data.phone}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('phone', e.target.value)}
                        required
                    />
                    <InputError message={errors.phone} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="department" value="Department" />
                    <select
                        id="department"
                        name="department"
                        value={data.department}
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm bg-white"
                        onChange={(e) => setData('department', e.target.value)}
                        required
                    >
                        <option value="">Select Department</option>
                        {departments.map((department) => (
                            <option key={department} value={department}>
                                {department}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors.department} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="session" value="Session" />
                    <select
                        id="session"
                        name="session"
                        value={data.session}
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm bg-white"
                        onChange={(e) => setData('session', e.target.value)}
                        required
                    >
                        <option value="">Select Session</option>
                        {sessions.map((session) => (
                            <option key={session} value={session}>
                                {session}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors.session} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="gender" value="Gender" />
                    <select
                        id="gender"
                        name="gender"
                        value={data.gender}
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm bg-white"
                        onChange={(e) => setData('gender', e.target.value)}
                        required
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    <InputError message={errors.gender} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="class_roll" value="Class Roll" />
                    <TextInput
                        id="class_roll"
                        type="text"
                        name="class_roll"
                        value={data.class_roll}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('class_roll', e.target.value)}
                        required
                    />
                    <InputError message={errors.class_roll} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="father_name" value="Father's Name" />
                    <TextInput
                        id="father_name"
                        type="text"
                        name="father_name"
                        value={data.father_name}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('father_name', e.target.value)}
                        required
                    />
                    <InputError message={errors.father_name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="mother_name" value="Mother's Name" />
                    <TextInput
                        id="mother_name"
                        type="text"
                        name="mother_name"
                        value={data.mother_name}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('mother_name', e.target.value)}
                        required
                    />
                    <InputError message={errors.mother_name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="permanent_address" value="Permanent Address" />
                    <TextInput
                        id="permanent_address"
                        type="text"
                        name="permanent_address"
                        value={data.permanent_address}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('permanent_address', e.target.value)}
                        required
                    />
                    <InputError message={errors.permanent_address} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="current_address" value="Current Address" />
                    <TextInput
                        id="current_address"
                        type="text"
                        name="current_address"
                        value={data.current_address}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('current_address', e.target.value)}
                        required
                    />
                    <InputError message={errors.current_address} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="transaction_id" value="Transaction ID" />
                    <TextInput
                        id="transaction_id"
                        type="text"
                        name="transaction_id"
                        value={data.transaction_id}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('transaction_id', e.target.value)}
                        required
                    />
                    <InputError message={errors.transaction_id} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="to_account" value="Select Payment Method" />
                    <div className="mt-2 space-y-2">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="to_account"
                                value="01939378080"
                                checked={data.to_account === '01939378080'}
                                onChange={(e) => setData('to_account', e.target.value)}
                                className="mr-2"
                            />
                            01939378080 (Bkash)
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="to_account"
                                value="018483166543"
                                checked={data.to_account === '018483166543'}
                                onChange={(e) => setData('to_account', e.target.value)}
                                className="mr-2"
                            />
                            018483166543 (Rocket)
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="to_account"
                                value="01848316654"
                                checked={data.to_account === '01848316654'}
                                onChange={(e) => setData('to_account', e.target.value)}
                                className="mr-2"
                            />
                            01848316654 (Nagad)
                        </label>
                    </div>
                    <InputError message={errors.to_account} className="mt-2" />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <Link
                        href={route('login')}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Already registered?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Register
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
