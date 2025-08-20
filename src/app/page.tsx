// app/page.jsx (homepage)
'use client';

import Link from "next/link";
import Image from "next/image";
import Header from '@/components/Header';
import { useEffect } from "react";
import { Wallet, TrendingUp, BarChart, PiggyBank, LineChart } from "lucide-react";

export default function Home() {
  // Smooth scroll
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.style.scrollBehavior = "smooth";
    }
  }, []);

  return (
    <main className="bg-gray-50 flex flex-col items-center justify-center">
      <section className="bg-white w-full overflow-hidden">

        {/* Navbar */}
        <Header />

        <div className="relative">
          {/* Layer blur (z-0) */}
          <div className="absolute inset-0 bg-gradient-to-b from-green-100/70 to-white blur-3xl z-0"></div>

          {/* Hero content (z-10) */}
          <div
            className="relative z-10 text-center px-8 py-16 min-h-[500px] flex items-center justify-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1605902711622-cfb43c4437d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/70 inline-block px-4 py-1 rounded-full text-sm mb-4">
                Trusted by 50,000+ smart savers
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
                <span className="bg-green-200 px-2 rounded-lg">Reconnect</span> With Your Finances
              </h1>
              <p className="text-gray-700 mb-6">
                From tracking expenses to achieving big goals, discover a system
                where your money works for you — and every decision feels right.
              </p>

              <Link href="/auth/login">
                <button className="bg-green-700 text-white px-6 py-3 rounded-full hover:bg-green-800">
                  Start Tracking
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-green-800 mb-8">Features</h2>
            <div className="grid md:grid-cols-3 gap-8">

              {/* Feature 1 */}
              <div className="p-6 bg-gray-50 rounded-lg shadow flex flex-col items-center">
                <Wallet className="h-12 w-12 text-green-700 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Expense Tracking</h3>
                <p className="text-gray-600">Easily track daily expenses and see where your money goes.</p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 bg-gray-50 rounded-lg shadow flex flex-col items-center">
                <TrendingUp className="h-12 w-12 text-green-700 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Income Management</h3>
                <p className="text-gray-600">Manage multiple income sources in one dashboard.</p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 bg-gray-50 rounded-lg shadow flex flex-col items-center">
                <BarChart className="h-12 w-12 text-green-700 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Financial Reports</h3>
                <p className="text-gray-600">Generate monthly reports to keep your finances on track.</p>
              </div>

            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-white">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-green-800 mb-8">Pricing</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-white rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-2">Free</h3>
                <p className="text-gray-600 mb-4">$0/month</p>
                <ul className="text-gray-500 mb-6 space-y-1">
                  <li>Basic expense tracking</li>
                  <li>Limited reports</li>
                </ul>
                <button className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800">
                  Choose Plan
                </button>
              </div>
              <div className="p-6 bg-white rounded-lg shadow border-2 border-green-700">
                <h3 className="text-xl font-semibold mb-2">Pro</h3>
                <p className="text-gray-600 mb-4">$9.99/month</p>
                <ul className="text-gray-500 mb-6 space-y-1">
                  <li>Unlimited tracking</li>
                  <li>Custom reports</li>
                  <li>Priority support</li>
                </ul>
                <button className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800">
                  Choose Plan
                </button>
              </div>
              <div className="p-6 bg-white rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
                <p className="text-gray-600 mb-4">Custom</p>
                <ul className="text-gray-500 mb-6 space-y-1">
                  <li>All Pro features</li>
                  <li>Dedicated account manager</li>
                </ul>
                <button className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800">
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-green-800 mb-8">About Us</h2>
            <p className="text-gray-600">
              FinanceTrack Co. is dedicated to helping individuals and businesses
              achieve financial freedom. With intuitive tools and clear insights,
              we make money management easy and effective.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-6 bg-gray-100 text-center bg-white">
          &copy; {new Date().getFullYear()} FinanceTrack Co. All rights reserved.
        </footer>
      </section>
    </main>
  );
}

