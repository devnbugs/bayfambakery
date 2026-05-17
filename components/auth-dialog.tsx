'use client';

import { useState } from 'react';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function AuthDialog({ open, onOpenChange }: { open?: boolean; onOpenChange?: (open: boolean) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (type: 'signin' | 'signup') => {
    try {
      setLoading(true);
      setError('');
      if (type === 'signin') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      onOpenChange?.(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      setError('');
      await signInWithPopup(auth, googleProvider);
      onOpenChange?.(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Account Login</DialogTitle>
          <DialogDescription>
            Log in to your account or create a new one to place orders.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="hello@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button className="w-full" onClick={() => handleAuth('signin')} disabled={loading}>
              {loading ? 'Logging in...' : 'Sign In'}
            </Button>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input id="signup-email" type="email" placeholder="hello@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button className="w-full" onClick={() => handleAuth('signup')} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </TabsContent>
        </Tabs>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button variant="outline" type="button" onClick={handleGoogleAuth} disabled={loading}>
            Sign In with Google
          </Button>
          <Button variant="outline" type="button" onClick={() => alert('Passkey support coming soon!')}>
            Sign In with Passkey (Recommended)
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
