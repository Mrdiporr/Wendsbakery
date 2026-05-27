import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Clock, 
  CheckCircle, 
  Package, 
  Bell,
  Trash2,
  ChefHat,
  Truck,
  XCircle,
  MessageCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled';

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: any;
  total: number;
  status: OrderStatus;
  created_at: string;
}

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: any }> = {
  pending: { label: 'Pending', color: 'bg-warning/20 text-warning border-warning/30', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-primary/20 text-primary border-primary/30', icon: CheckCircle },
  preparing: { label: 'Preparing', color: 'bg-accent/20 text-accent border-accent/30', icon: ChefHat },
  delivered: { label: 'Delivered', color: 'bg-success/20 text-success border-success/30', icon: Truck },
  cancelled: { label: 'Cancelled', color: 'bg-destructive/20 text-destructive border-destructive/30', icon: XCircle },
};

// Mock data for Phase 1
const mockOrders: Order[] = [
  {
    id: '1',
    customer_name: 'John Doe',
    customer_phone: '123-456-7890',
    customer_address: '123 Main St',
    items: [{ name: 'Sourdough Loaf', quantity: 2, price: 850 }],
    total: 1700,
    status: 'pending',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    customer_name: 'Jane Smith',
    customer_phone: '987-654-3210',
    customer_address: '456 Oak Ave',
    items: [{ name: 'Chocolate Croissant', quantity: 6, price: 400 }],
    total: 2400,
    status: 'preparing',
    created_at: new Date(Date.now() - 3600000).toISOString()
  }
];

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
    const intervalId = setInterval(fetchOrders, 15000); // Poll every 15s
    return () => clearInterval(intervalId);
  }, []);

  const fetchOrders = async () => {
    // Mocking API call to Laravel
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 500);
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    const order = orders.find(o => o.id === orderId);
    
    // Mock updating local state
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

    toast({
      title: 'Status Updated',
      description: `Order marked as ${statusConfig[newStatus].label}`,
    });

    // Mock WhatsApp notification trigger via Laravel
    if (order) {
      toast({
        title: 'WhatsApp Notification Triggered',
        description: `Sent status update to ${order.customer_phone} via Laravel API`,
        variant: 'default',
      });
    }
  };

  const deleteOrder = async (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    toast({
      title: 'Success',
      description: 'Order deleted',
    });
  };

  const triggerManualWhatsApp = (order: Order) => {
    // This will eventually call the Laravel endpoint to trigger a manual WhatsApp message
    toast({
      title: 'Manual WhatsApp Sent',
      description: `Message sent to ${order.customer_name} (${order.customer_phone})`,
      variant: 'default',
    });
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(o => o.status === filterStatus);

  const pendingCount = orders.filter(o => o.status === 'pending').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Order Board</h1>
        <div className="flex items-center gap-4">
          {pendingCount > 0 && (
            <Badge variant="destructive" className="text-sm animate-pulse">
              <Bell className="w-4 h-4 mr-1" />
              {pendingCount} Pending
            </Badge>
          )}
          <Badge variant="outline" className="text-sm">
            {orders.length} Total Orders
          </Badge>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filter by status:</span>
          <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as OrderStatus | 'all')}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Orders ({filteredOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No orders found</p>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const StatusIcon = statusConfig[order.status]?.icon || Clock;
                return (
                  <div key={order.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{order.customer_name}</h3>
                          <Badge className={`${statusConfig[order.status]?.color || ''} border`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig[order.status]?.label || order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          📞 {order.customer_phone}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          📍 {order.customer_address}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Select 
                          value={order.status} 
                          onValueChange={(v) => updateOrderStatus(order.id, v as OrderStatus)}
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="preparing">Preparing</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => triggerManualWhatsApp(order)}
                            variant="outline"
                            size="sm"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />
                            WhatsApp
                          </Button>
                          <Button
                            onClick={() => deleteOrder(order.id)}
                            variant="destructive"
                            size="sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      {order.items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span>{item.name} x {item.quantity}</span>
                          <span>${((item.price * item.quantity) / 100).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t">
                      <div className="font-semibold">
                        Total: ${(order.total / 100).toFixed(2)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
