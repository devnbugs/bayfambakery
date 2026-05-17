'use client';

import { useEffect, useState } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const [user, loading] = useAuthState(auth);
  const [orders, setOrders] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function checkAdminAndFetch() {
      if (!user) {
        setFetching(false);
        return;
      }
      
      try {
        // Check if user is admin
        const adminDoc = await getDoc(doc(db, 'admins', user.uid));
        const userIsAdmin = adminDoc.exists();
        setIsAdmin(userIsAdmin);

        let q;
        if (userIsAdmin) {
          q = collection(db, 'orders'); // Fetch all
        } else {
          q = query(collection(db, 'orders'), where('userId', '==', user.uid));
        }

        const querySnapshot = await getDocs(q);
        const fetchedOrders = querySnapshot.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
        // Sort by created at descending
        fetchedOrders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setOrders(fetchedOrders);
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    }

    if (!loading) {
      checkAdminAndFetch();
    }
  }, [user, loading]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error(err);
      alert('Failed to update status. Only admins can update status.');
    }
  };

  if (loading || fetching) return <div className="p-12 text-center">Loading dashboard...</div>;

  if (!user) {
    return (
      <div className="p-12 text-center min-h-screen">
        <h2 className="text-2xl font-serif">Please Sign In</h2>
        <p className="mt-4">You need an account to view your orders.</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 min-h-screen bg-[#FDFBF7]">
      <h1 className="text-4xl font-serif mb-8 text-[#2D241E]">
        {isAdmin ? 'Admin Dashboard' : 'My Orders'}
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    {isAdmin && <TableHead>Customer</TableHead>}
                    <TableHead>Product</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    {isAdmin && <TableHead>Action</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}</TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      {isAdmin && <TableCell>{order.userEmail}</TableCell>}
                      <TableCell>{order.productName}</TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={order.status === 'fulfilled' ? 'default' : 'secondary'}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      {isAdmin && (
                        <TableCell>
                          <div className="flex gap-2">
                            {order.status !== 'fulfilled' && (
                              <Button size="sm" onClick={() => updateStatus(order.id, 'fulfilled')}>
                                Mark Fulfilled
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
