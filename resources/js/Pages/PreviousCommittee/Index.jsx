import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
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

            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
                {/* Insane Professional Header */}
                <div className="relative overflow-hidden">
                    {/* Animated Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20"></div>
                    <div className="absolute inset-0 opacity-40">
                        <div className="w-full h-full" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                        }}></div>
                    </div>

                    <div className="relative px-8 py-20">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-8 shadow-2xl">
                                <UsersIcon className="w-10 h-10 text-white" />
                            </div>
                            <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-purple-100 mb-6 tracking-tight">
                                Committee Portal
                            </h1>
                            <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
                                Advanced committee management system with comprehensive member oversight and historical analytics
                            </p>
                            <div className="flex items-center justify-center gap-8 mt-8">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-white">{totalCurrentMembers}</div>
                                    <div className="text-sm text-gray-400 uppercase tracking-wider">Active Members</div>
                                </div>
                                <div className="w-px h-12 bg-gray-600"></div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-white">{previousCommittees.length}</div>
                                    <div className="text-sm text-gray-400 uppercase tracking-wider">Committees</div>
                                </div>
                                <div className="w-px h-12 bg-gray-600"></div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-white">
                                        {previousCommittees.reduce((sum, committee) => sum + committee.member_count, 0) + totalCurrentMembers}
                                    </div>
                                    <div className="text-sm text-gray-400 uppercase tracking-wider">Total Members</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Insane Professional Content */}
                <div className="px-8 py-12 relative">
                    {/* Floating Background Elements */}
                    <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
                    <Tabs defaultValue="current" className="w-full relative z-10">
                        <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-2 bg-gray-800/90 backdrop-blur-xl shadow-2xl rounded-2xl p-2 mb-16 h-20 border border-gray-700">
                            <TabsTrigger
                                value="current"
                                className="flex items-center gap-4 text-lg font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-xl text-gray-300 hover:text-white transition-all duration-300 h-16 rounded-xl"
                            >
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20">
                                    <StarIcon className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <div className="font-bold">Current Committee</div>
                                    <div className="text-xs opacity-75">Active Members</div>
                                </div>
                                {totalCurrentMembers > 0 && (
                                    <Badge className="ml-auto bg-blue-500/20 text-blue-300 border-blue-500/30 text-sm font-bold px-3 py-1">
                                        {totalCurrentMembers}
                                    </Badge>
                                )}
                            </TabsTrigger>
                            <TabsTrigger
                                value="previous"
                                className="flex items-center gap-4 text-lg font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-600 data-[state=active]:to-gray-800 data-[state=active]:text-white data-[state=active]:shadow-xl text-gray-300 hover:text-white transition-all duration-300 h-16 rounded-xl"
                            >
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-500/20">
                                    <ClockIcon className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <div className="font-bold">Previous Committees</div>
                                    <div className="text-xs opacity-75">Historical Archive</div>
                                </div>
                                {previousCommittees.length > 0 && (
                                    <Badge className="ml-auto bg-gray-500/20 text-gray-300 border-gray-500/30 text-sm font-bold px-3 py-1">
                                        {previousCommittees.length}
                                    </Badge>
                                )}
                            </TabsTrigger>
                        </TabsList>

                        {/* Current Committee Tab */}
                        <TabsContent value="current" className="space-y-8">
                            <div className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50 overflow-hidden">
                                <div className="relative px-8 py-8 border-b border-gray-700/50">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
                                    <div className="relative flex items-center justify-between">
                                        <div>
                                            <h2 className="text-3xl font-black text-white mb-2">Current Committee</h2>
                                            <p className="text-gray-300 text-lg">
                                                {currentCommitteeNumber ? `Committee ${currentCommitteeNumber}` : 'Active Committee'}
                                                • {totalCurrentMembers} executive members
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                                <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-2 text-sm font-bold">
                                                    ACTIVE
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8">
                                    {totalCurrentMembers === 0 ? (
                                        <div className="text-center py-24">
                                            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-700/50 rounded-full mb-8">
                                                <UsersIcon className="w-12 h-12 text-gray-400" />
                                            </div>
                                            <h3 className="text-3xl font-bold text-white mb-4">No Active Committee</h3>
                                            <p className="text-gray-400 text-xl">Committee members will appear here when appointed.</p>
                                        </div>
                                    ) : (
                                        <div className="overflow-hidden">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                                                {currentMembers.map((member, index) => (
                                                    <div key={member.id} className="group relative">
                                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                                                        <div className="relative bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 text-center hover:border-blue-500/50 transition-all duration-300 group-hover:transform group-hover:scale-105">
                                                            <div className="relative mb-6">
                                                                <Avatar className="w-20 h-20 mx-auto ring-4 ring-blue-500/20 group-hover:ring-blue-500/40 transition-all duration-300">
                                                                    <AvatarImage
                                                                        src={member.user_image ? `/storage/${member.user_image}` : null}
                                                                        alt={member.user_name}
                                                                    />
                                                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-bold">
                                                                        {member.user_name.charAt(0)}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                                                                    {member.member_order}
                                                                </div>
                                                            </div>
                                                            <h3 className="font-bold text-white mb-3 text-lg group-hover:text-blue-300 transition-colors">
                                                                {member.user_name}
                                                            </h3>
                                                            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 mb-3 px-3 py-1 font-semibold">
                                                                {member.designation_name}
                                                            </Badge>
                                                            <div className="text-xs text-gray-400 mt-2">
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
                            <div className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50 overflow-hidden">
                                <div className="relative px-8 py-8 border-b border-gray-700/50">
                                    <div className="absolute inset-0 bg-gradient-to-r from-gray-600/10 to-gray-800/10"></div>
                                    <div className="relative flex items-center justify-between">
                                        <div>
                                            <h2 className="text-3xl font-black text-white mb-2">Previous Committees</h2>
                                            <p className="text-gray-300 text-lg">
                                                Historical archive of committee members • {previousCommittees.length} committees total
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30 px-4 py-2 text-sm font-bold">
                                                ARCHIVE
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8">
                                    {previousCommittees.length === 0 ? (
                                        <div className="text-center py-24">
                                            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-700/50 rounded-full mb-8">
                                                <CalendarIcon className="w-12 h-12 text-gray-400" />
                                            </div>
                                            <h3 className="text-3xl font-bold text-white mb-4">No Previous Committees</h3>
                                            <p className="text-gray-400 text-xl">Committee history will appear here as tenures conclude.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-12">
                                            {/* Committee Selector */}
                                            <div className="flex flex-wrap gap-4 justify-center">
                                                {previousCommittees.map((committee) => (
                                                    <button
                                                        key={committee.committee_number}
                                                        onClick={() => setSelectedPreviousCommittee(committee.committee_number)}
                                                        className={`group relative px-8 py-4 rounded-2xl font-bold transition-all duration-300 ${
                                                            selectedPreviousCommittee === committee.committee_number
                                                                ? 'bg-gradient-to-r from-gray-600 to-gray-800 text-white shadow-2xl scale-105'
                                                                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white hover:scale-105'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex items-center justify-center w-10 h-10 bg-gray-500/30 rounded-full">
                                                                <CalendarIcon className="w-5 h-5" />
                                                            </div>
                                                            <div className="text-left">
                                                                <div className="text-lg font-bold">Committee {committee.committee_number}</div>
                                                                <div className="text-xs opacity-75">{committee.member_count} members</div>
                                                            </div>
                                                            <Badge className="ml-2 bg-gray-500/20 text-gray-300 border-gray-500/30 font-bold">
                                                                {committee.member_count}
                                                            </Badge>
                                                        </div>
                                                        {selectedPreviousCommittee === committee.committee_number && (
                                                            <div className="absolute inset-0 bg-gradient-to-r from-gray-600/20 to-gray-800/20 rounded-2xl blur-xl"></div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Selected Committee Members */}
                                            {selectedCommitteeData && (
                                                <div>
                                                    <div className="mb-12 pb-8 border-b border-gray-700/50">
                                                        <div className="text-center">
                                                            <h3 className="text-2xl font-bold text-white mb-3">
                                                                Committee {selectedCommitteeData.committee_number}
                                                            </h3>
                                                            <p className="text-gray-300 flex items-center justify-center gap-3 text-lg">
                                                                <UsersIcon className="w-6 h-6" />
                                                                {selectedCommitteeData.member_count} archived members
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                                                        {selectedCommitteeData.members.map((member) => (
                                                            <div key={member.id} className="group relative">
                                                                <div className="absolute inset-0 bg-gradient-to-br from-gray-600/20 to-gray-800/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                                                                <div className="relative bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 text-center hover:border-gray-500/50 transition-all duration-300 group-hover:transform group-hover:scale-105">
                                                                    <div className="relative mb-6">
                                                                        <Avatar className="w-20 h-20 mx-auto ring-4 ring-gray-600/20 group-hover:ring-gray-500/40 transition-all duration-300">
                                                                            <AvatarImage
                                                                                src={member.photo ? `/storage/${member.photo}` : null}
                                                                                alt={member.name}
                                                                            />
                                                                            <AvatarFallback className="bg-gradient-to-br from-gray-600 to-gray-800 text-white text-xl font-bold">
                                                                                {member.name.charAt(0)}
                                                                            </AvatarFallback>
                                                                        </Avatar>
                                                                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                                                                            {member.member_order}
                                                                        </div>
                                                                    </div>
                                                                    <h3 className="font-bold text-white mb-3 text-lg group-hover:text-gray-300 transition-colors">
                                                                        {member.name}
                                                                    </h3>
                                                                    <Badge className="bg-gray-600/20 text-gray-300 border-gray-600/30 mb-3 px-3 py-1 font-semibold">
                                                                        {member.designation}
                                                                    </Badge>
                                                                    {member.tenure_start && member.tenure_end && (
                                                                        <div className="text-xs text-gray-400 mt-3 bg-gray-700/30 rounded-lg px-3 py-2">
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
