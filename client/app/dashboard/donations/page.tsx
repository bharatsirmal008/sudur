import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CreditCard, Download, ExternalLink } from "lucide-react";

export default async function UserDonationsPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/login");
    }

    // Fetch real donations for the logged-in user from the Express Server
    let API_BASE = (process.env.NEXTAUTH_URL === "http://localhost:3000" || !process.env.NEXTAUTH_URL)
        ? "http://localhost:5000"
        : (process.env.BACKEND_API_URL || "");

    // Fallback if environment variable is not yet set in Vercel
    if (!API_BASE) {
        API_BASE = "https://sudurapi.vercel.app";
    }

    const res = await fetch(`${API_BASE}/api/user/donations?email=${encodeURIComponent(session.user.email || '')}`, {
        cache: 'no-store'
    });

    let donations: any[] = [];
    if (res.ok) {
        donations = await res.json();
    }

    const totalDonatedAmount = donations.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);
    const totalDonated = `$${totalDonatedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const myDonations = donations.map((d: any) => ({
        id: d._id?.toString() || d.id || Math.random().toString(),
        amount: `$${(d.amount || 0).toFixed(2)}`,
        date: new Date(d.createdAt).toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        campaign: d.purpose || "General Fund",
        method: d.paymentMethod || "Credit Card",
        status: d.status || "Completed",
    }));

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                <div className="mb-8">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                                Donation History
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">
                                View and manage your financial contributions.
                            </p>
                        </div>
                        <Link
                            href="/donate"
                            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
                        >
                            <CreditCard className="w-4 h-4 mr-2" />
                            Make a New Donation
                        </Link>
                    </div>
                </div>

                {myDonations.length > 0 ? (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                                    Lifetime Impact
                                </p>
                                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                                    {totalDonated}
                                </p>
                            </div>
                            <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                                <CreditCard className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
                                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                                        <tr>
                                            <th scope="col" className="px-6 py-4 font-semibold">Date</th>
                                            <th scope="col" className="px-6 py-4 font-semibold">Campaign</th>
                                            <th scope="col" className="px-6 py-4 font-semibold">Amount</th>
                                            <th scope="col" className="px-6 py-4 font-semibold">Method</th>
                                            <th scope="col" className="px-6 py-4 font-semibold">Status</th>
                                            <th scope="col" className="px-6 py-4 font-semibold text-right">Receipt</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                        {myDonations.map((donation) => (
                                            <tr key={donation.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-slate-900 dark:text-white">
                                                    {donation.date}
                                                </td>
                                                <td className="px-6 py-4 text-slate-900 dark:text-white font-medium">
                                                    {donation.campaign}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap font-bold text-indigo-600 dark:text-indigo-400">
                                                    {donation.amount}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {donation.method}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400">
                                                        {donation.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <button className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" title="Download Receipt">
                                                        <Download className="w-5 h-5 inline-block" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-12 text-center">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CreditCard className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No donations yet</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                            Your support helps SUDUR uplift communities. Consider making a donation to fund our active campaigns.
                        </p>
                        <Link
                            href="/donate"
                            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
                        >
                            Donate Now
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
