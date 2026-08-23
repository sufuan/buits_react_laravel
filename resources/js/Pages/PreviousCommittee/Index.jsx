import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import NavBar from '@/Components/HomePage/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, UsersIcon, ClockIcon, StarIcon } from '@heroicons/react/24/outline';

export default function Index({
    currentMembers = [],
    currentCommitteeNumber,
    previousCommittees = [],
    totalCurrentMembers = 0
}) {
    const [selectedPreviousCommittee, setSelectedPreviousCommittee] = useState(
        previousCommittees.length > 0 ? previousCommittees[0].committee_number : null
    );

    const selectedCommitteeData = previousCommittees.find(
        committee => committee.committee_number === selectedPreviousCommittee
    );

    return (
        <>
            <Head title="Committee Members" />
            <NavBar />

            <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50">
                {/* Professional Header */}
                <div className="relative overflow-hidden">
                    {/* Soft Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-100/60 via-indigo-100/40 to-purple-100/40"></div>
                    <div className="absolute inset-0 opacity-40">
                        <div className="w-full h-full" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234f46e5' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                        }}></div>
                    </div>

                    <div className="relative px-8 py-20">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-8 shadow-xl">
                                <UsersIcon className="w-10 h-10 text-white" />
                            </div>
                            <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-slate-800 mb-6 tracking-tight">
                                Committee Portal
                            </h1>
                            <p className="text-2xl text-slate-500 max-w-4xl mx-auto leading-relaxed font-light">
                                Advanced committee management system with comprehensive member oversight and historical analytics
                            </p>
                            <div className="flex items-center justify-center gap-8 mt-8">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-slate-800">{totalCurrentMembers}</div>
                                    <div className="text-sm text-slate-500 uppercase tracking-wider">Active Members</div>
                                </div>
                                <div className="w-px h-12 bg-slate-300"></div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-slate-800">{previousCommittees.length}</div>
                                    <div className="text-sm text-slate-500 uppercase tracking-wider">Committees</div>
                                </div>
                                <div className="w-px h-12 bg-slate-300"></div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-slate-800">
                                        {previousCommittees.reduce((sum, committee) => sum + committee.member_count, 0) + totalCurrentMembers}
                                    </div>
                                    <div className="text-sm text-slate-500 uppercase tracking-wider">Total Members</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Professional Content */}
                <div className="px-8 py-12 relative">
                    {/* Floating Background Elements */}
                    <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
                    <Tabs defaultValue="current" className="w-full relative z-10">
                        <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-2 bg-white/90 backdrop-blur-xl shadow-lg rounded-2xl p-2 mb-16 h-20 border border-slate-200">
                            <TabsTrigger
                                value="current"
                                className="flex items-center gap-4 text-lg font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-xl text-slate-500 hover:text-slate-800 transition-all duration-300 h-16 rounded-xl"
                            >
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20">
                                    <StarIcon className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <div className="font-bold">Current Committee</div>
                                    <div className="text-xs opacity-75">Active Members</div>
                                </div>
                                {totalCurrentMembers > 0 && (
                                <Badge className="ml-auto bg-blue-500/10 text-blue-600 border-blue-300 text-sm font-bold px-3 py-1">
                                        {totalCurrentMembers}
                                    </Badge>
                                )}
                            </TabsTrigger>
                            <TabsTrigger
                                value="previous"
                                className="flex items-center gap-4 text-lg font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-600 data-[state=active]:to-slate-800 data-[state=active]:text-white data-[state=active]:shadow-xl text-slate-500 hover:text-slate-800 transition-all duration-300 h-16 rounded-xl"
                            >
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-500/10">
                                    <ClockIcon className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <div className="font-bold">Previous Committees</div>
                                    <div className="text-xs opacity-75">Historical Archive</div>
                                </div>
                                {previousCommittees.length > 0 && (
                                    <Badge className="ml-auto bg-slate-500/10 text-slate-600 border-slate-300 text-sm font-bold px-3 py-1">
                                        {previousCommittees.length}
                                    </Badge>
                                )}
                            </TabsTrigger>
                        </TabsList>

                        {/* Current Committee Tab */}
                        <TabsContent value="current" className="space-y-8">
                            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
                                <div className="relative px-8 py-8 border-b border-slate-200/80">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50/60 to-indigo-50/40"></div>
                                    <div className="relative flex items-center justify-between">
                                        <div>
                                            <h2 className="text-3xl font-black text-slate-800 mb-2">Current Committee</h2>
                                            <p className="text-slate-500 text-lg">
                                                {currentCommitteeNumber ? `Committee ${currentCommitteeNumber}` : 'Active Committee'}
                                                • {totalCurrentMembers} executive members
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                                <Badge className="bg-green-100 text-green-700 border-green-300 px-4 py-2 text-sm font-bold">
                                                    ACTIVE
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8">
                                    {totalCurrentMembers === 0 ? (
                                        <div className="text-center py-24">
                                            <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-100 rounded-full mb-8">
                                                <UsersIcon className="w-12 h-12 text-slate-400" />
                                            </div>
                                            <h3 className="text-3xl font-bold text-slate-800 mb-4">No Active Committee</h3>
                                            <p className="text-slate-400 text-xl">Committee members will appear here when appointed.</p>
                                        </div>
                                    ) : (
                                        <div className="overflow-hidden">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                                                {currentMembers.map((member, index) => (
                                                    <div key={member.id} className="group relative">
                                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-300/20 to-indigo-300/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                                                        <div className="relative bg-white/90 border border-slate-200/80 rounded-2xl p-6 text-center hover:border-blue-400/50 hover:shadow-lg transition-all duration-300 group-hover:transform group-hover:scale-105">
                                                            <div className="relative mb-6">
                                                                <Avatar className="w-20 h-20 mx-auto ring-4 ring-blue-200 group-hover:ring-blue-400 transition-all duration-300">
                                                                    <AvatarImage
                                                                        src={member.user_image ? `/storage/${member.user_image}` : null}
                                                                        alt={member.user_name}
                                                                    />
                                                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl font-bold">
                                                                        {member.user_name.charAt(0)}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                            </div>
                                                            <h3 className="font-bold text-slate-800 mb-3 text-lg group-hover:text-blue-600 transition-colors">
                                                                {member.user_name}
                                                            </h3>
                                                            <Badge className="bg-blue-100 text-blue-700 border-blue-200 mb-3 px-3 py-1 font-semibold">
                                                                {member.designation_name}
                                                            </Badge>
                                                            <div className="text-xs text-slate-400 mt-2">
                                                                Executive Member
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        {/* Previous Committees Tab */}
                        <TabsContent value="previous" className="space-y-8">
                            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
                                <div className="relative px-8 py-8 border-b border-slate-200/80">
                                    <div className="absolute inset-0 bg-gradient-to-r from-slate-50/80 to-indigo-50/40"></div>
                                    <div className="relative flex items-center justify-between">
                                        <div>
                                            <h2 className="text-3xl font-black text-slate-800 mb-2">Previous Committees</h2>
                                            <p className="text-slate-500 text-lg">
                                                Historical archive of committee members • {previousCommittees.length} committees total
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Badge className="bg-slate-100 text-slate-600 border-slate-300 px-4 py-2 text-sm font-bold">
                                                ARCHIVE
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8">
                                    {previousCommittees.length === 0 ? (
                                        <div className="text-center py-24">
                                            <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-100 rounded-full mb-8">
                                                <CalendarIcon className="w-12 h-12 text-slate-400" />
                                            </div>
                                            <h3 className="text-3xl font-bold text-slate-800 mb-4">No Previous Committees</h3>
                                            <p className="text-slate-400 text-xl">Committee history will appear here as tenures conclude.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-12">
                                            {/* Committee Selector */}
                                            <div className="flex flex-wrap gap-4 justify-center">
                                                {previousCommittees.map((committee) => (
                                                    <button
                                                        key={committee.committee_number}
                                                        onClick={() => setSelectedPreviousCommittee(committee.committee_number)}
                                                        className={`group relative px-8 py-4 rounded-2xl font-bold transition-all duration-300 ${selectedPreviousCommittee === committee.committee_number
                                                                ? 'bg-gradient-to-r from-slate-700 to-slate-900 text-white shadow-xl scale-105'
                                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 hover:scale-105 border border-slate-200'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex items-center justify-center w-10 h-10 bg-slate-500/10 rounded-full">
                                                                <CalendarIcon className="w-5 h-5" />
                                                            </div>
                                                            <div className="text-left">
                                                                <div className="text-lg font-bold">Committee {committee.committee_number}</div>
                                                                <div className="text-xs opacity-75">{committee.member_count} members</div>
                                                            </div>
                                                            <Badge className="ml-2 bg-slate-200 text-slate-600 border-slate-300 font-bold">
                                                                {committee.member_count}
                                                            </Badge>
                                                        </div>
                                                        {selectedPreviousCommittee === committee.committee_number && (
                                                            <div className="absolute inset-0 bg-gradient-to-r from-slate-600/10 to-slate-800/10 rounded-2xl blur-xl"></div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Selected Committee Members */}
                                            {selectedCommitteeData && (
                                                <div>
                                                    <div className="mb-12 pb-8 border-b border-slate-200/80">
                                                        <div className="text-center">
                                                            <h3 className="text-2xl font-bold text-slate-800 mb-3">
                                                                Committee {selectedCommitteeData.committee_number}
                                                            </h3>
                                                            <p className="text-slate-500 flex items-center justify-center gap-3 text-lg">
                                                                <UsersIcon className="w-6 h-6" />
                                                                {selectedCommitteeData.member_count} archived members
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                                                        {selectedCommitteeData.members.map((member) => (
                                                            <div key={member.id} className="group relative">
                                                                <div className="absolute inset-0 bg-gradient-to-br from-slate-300/20 to-slate-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                                                                <div className="relative bg-white/90 border border-slate-200/80 rounded-2xl p-6 text-center hover:border-slate-400/50 hover:shadow-lg transition-all duration-300 group-hover:transform group-hover:scale-105">
                                                                    <div className="relative mb-6">
                                                                        <Avatar className="w-20 h-20 mx-auto ring-4 ring-slate-200 group-hover:ring-slate-400 transition-all duration-300">
                                                                            <AvatarImage
                                                                                src={member.photo ? `/storage/${member.photo}` : null}
                                                                                alt={member.name}
                                                                            />
                                                                            <AvatarFallback className="bg-gradient-to-br from-slate-500 to-slate-700 text-white text-xl font-bold">
                                                                                {member.name.charAt(0)}
                                                                            </AvatarFallback>
                                                                        </Avatar>
                                                                    </div>
                                                                    <h3 className="font-bold text-slate-800 mb-3 text-lg group-hover:text-slate-600 transition-colors">
                                                                        {member.name}
                                                                    </h3>
                                                                    <Badge className="bg-slate-100 text-slate-600 border-slate-300 mb-3 px-3 py-1 font-semibold">
                                                                        {member.designation}
                                                                    </Badge>
                                                                    {member.tenure_start && member.tenure_end && (
                                                                        <div className="text-xs text-slate-400 mt-3 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                                                                            {new Date(member.tenure_start).getFullYear()} - {new Date(member.tenure_end).getFullYear()}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    );
}
