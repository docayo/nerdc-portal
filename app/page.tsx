"use client";

import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Fixed Navigation Bar */}
      <nav className="w-full bg-blue-900 text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-xl">
            <BookOpen className="h-6 w-6" />
            NERDC E-Lesson Portal
          </div>
          <div className="flex gap-4">
            <Link href="/portal" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md font-semibold text-sm transition-colors">
              User Login
            </Link>
            {/* The Developer link is hidden from the main nav for security. You will access it via a secret URL. */}
          </div>
        </div>
      </nav>

      {/* Main Content - Your Flyers */}
      <main className="w-full max-w-4xl flex flex-col items-center gap-8 py-8 px-4">
        
        {/* Flyer 1 */}
        <div className="relative w-full shadow-2xl rounded-lg overflow-hidden border border-gray-200 group">
          <Image 
            src="/images/flyer1.jpg" 
            alt="NERDC Curriculum Flyer 1" 
            width={1000} 
            height={1400} 
            className="w-full h-auto"
            priority
          />
          {/* Invisible Clickable Overlay for the "Access" Button */}
          <Link 
            href="/portal" 
            className="absolute bottom-[8%] right-[10%] w-[30%] h-[8%] cursor-pointer z-10"
            title="Click to Access Portal"
          >
            <span className="sr-only">Access Portal</span>
          </Link>
        </div>

        {/* Flyer 2 */}
        <div className="relative w-full shadow-2xl rounded-lg overflow-hidden border border-gray-200 group">
          <Image 
            src="/images/flyer2.jpg" 
            alt="NERDC Curriculum Flyer 2" 
            width={1000} 
            height={1400} 
            className="w-full h-auto"
          />
          {/* Invisible Clickable Overlay for the "Access" Button */}
          <Link 
            href="/portal" 
            className="absolute bottom-[8%] right-[10%] w-[30%] h-[8%] cursor-pointer z-10"
            title="Click to Access Portal"
          >
            <span className="sr-only">Access Portal</span>
          </Link>
        </div>

        {/* Flyer 3 */}
        <div className="relative w-full shadow-2xl rounded-lg overflow-hidden border border-gray-200 group">
          <Image 
            src="/images/flyer3.jpg" 
            alt="NERDC Curriculum Flyer 3" 
            width={1000} 
            height={1400} 
            className="w-full h-auto"
          />
          {/* Invisible Clickable Overlay for the "Access" Button */}
          <Link 
            href="/portal" 
            className="absolute bottom-[8%] right-[10%] w-[30%] h-[8%] cursor-pointer z-10"
            title="Click to Access Portal"
          >
            <span className="sr-only">Access Portal</span>
          </Link>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full bg-blue-900 text-white text-center py-6 mt-10">
        <p className="text-sm">© {new Date().getFullYear()} Nature Nurture Educational Consult. All rights reserved.</p>
      </footer>
    </div>
  );
}