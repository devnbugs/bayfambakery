'use client'

import { useEffect, useState } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useAuthState } from 'react-firebase-hooks/auth';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);
  
  // Order state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [orderStauts, setOrderStatus] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as any)
        })) as Product[];
        setProducts(productsData);
        
        // Mock data fallback if empty
        if (productsData.length === 0) {
          setProducts([
            { id: '1', name: 'Sourdough Loaf', price: 12, description: '48-hour slow fermentation', imageUrl: 'https://picsum.photos/seed/sourdough/400/300' },
            { id: '2', name: 'Strawberry Cake', price: 45, description: 'Fresh local berries', imageUrl: 'https://picsum.photos/seed/cake/400/300' },
            { id: '3', name: 'Croissant Box', price: 24, description: '6 buttery croissants', imageUrl: 'https://picsum.photos/seed/croissant/400/300' }
          ]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const handleOrder = async () => {
    if (!user) {
      alert("Please sign in to place an order.");
      return;
    }
    if (!selectedProduct) return;
    
    setOrderStatus('Placing order...');
    try {
      await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        userEmail: user.email,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        quantity: quantity,
        price: selectedProduct.price,
        total: selectedProduct.price * quantity,
        notes: notes,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      setOrderStatus('Order placed successfully!');
      setTimeout(() => {
        setIsDialogOpen(false);
        setOrderStatus('');
        setQuantity(1);
        setNotes('');
      }, 2000);
    } catch (error) {
      console.error("Error ordering", error);
      setOrderStatus('Failed to place order.');
    }
  };

  if (loading) return <div className="p-12 text-center text-lg">Loading products...</div>;

  return (
    <div className="p-6 md:p-12 min-h-screen bg-[#FDFBF7]">
      <h1 className="text-4xl md:text-5xl font-serif mb-12 text-[#2D241E]">Our Artisanal Collection</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map(product => (
          <Card key={product.id} className="overflow-hidden border-[#E8E2D9] hover:shadow-lg transition-shadow flex flex-col justify-between">
            <div>
              <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover" />
              <CardHeader>
                <CardTitle className="font-serif text-xl">{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[#6B5E54] mb-4">{product.description}</p>
                <span className="text-2xl font-serif text-[#D4A373]">${(typeof product.price === 'number' ? product.price : 0).toFixed(2)}</span>
              </CardContent>
            </div>
            <div className="p-6 pt-0 mt-auto">
               <Button className="w-full" onClick={() => {
                 setSelectedProduct(product);
                 setIsDialogOpen(true);
               }}>Place Order</Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order {selectedProduct?.name}</DialogTitle>
            <DialogDescription>
              ${selectedProduct?.price.toFixed(2)} each
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input type="number" min={1} value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} />
            </div>
            <div className="space-y-2">
              <Label>Special Notes</Label>
              <Input placeholder="E.g. allergies, specific pickup time..." value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <div className="text-lg font-bold">
              Total: ${(selectedProduct ? selectedProduct.price * quantity : 0).toFixed(2)}
            </div>
            {orderStauts && <p className="text-sm text-blue-600 font-medium">{orderStauts}</p>}
            <Button className="w-full" onClick={handleOrder}>Confirm Order</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
