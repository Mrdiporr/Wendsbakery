import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PenTool } from "lucide-react";

export default function Blog() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Blog Management</h1>
      </div>
      
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool className="w-5 h-5" />
            Blog Posts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground py-8 text-center">
            Blog management module will be implemented in Phase 2. This will connect to the Laravel API for WordPress Posts.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
