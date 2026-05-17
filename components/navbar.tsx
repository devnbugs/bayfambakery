'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { AuthDialog } from '@/components/auth-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <nav className="px-6 md:px-12 h-20 flex items-center justify-between border-b border-[#E8E2D9] bg-[#FDFBF7]">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#D4A373] rounded-full flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45"></div>
          </div>
          <span className="text-xl font-semibold tracking-tight font-serif text-[#2D241E]">BayFam Bakery</span>
        </Link>
      </div>
      <div className="hidden md:flex gap-8 text-sm font-medium uppercase tracking-widest text-[#6B5E54]">
        <Link href="/products" className="hover:text-[#D4A373] transition-colors">Menu</Link>
        <Link href="#" className="hover:text-[#D4A373] transition-colors">Our Story</Link>
        <Link href="#" className="hover:text-[#D4A373] transition-colors">Locations</Link>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.photoURL} alt={user.email} />
                  <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem asChild>
                <Link href="/dashboard">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut(auth)}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="outline" className="text-[#D4A373] border-[#D4A373] hover:bg-[#D4A373] hover:text-white" onClick={() => setAuthOpen(true)}>
            Sign In
          </Button>
        )}
        <Button asChild className="hidden sm:inline-flex bg-[#2D241E] text-white hover:bg-[#2D241E]/90">
          <Link href="/products">Order Online</Link>
        </Button>
      </div>
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </nav>
  );
}
