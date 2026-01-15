import { useState } from 'react';
import { Upload, FileSpreadsheet, Camera, Check, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock parsed receipt data
const mockParsedProducts = [
  { name: 'Samsung A32 Case', quantity: 50, confidence: 0.95 },
  { name: 'iPhone 14 Charger', quantity: 30, confidence: 0.88 },
  { name: 'USB-C Cable 2m', quantity: 100, confidence: 0.92 },
  { name: 'Screen Protector A52', quantity: 25, confidence: 0.78 },
];

export default function ReceiptImport() {
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'processing' | 'review'>('idle');
  const [parsedProducts, setParsedProducts] = useState(mockParsedProducts);

  const handleUpload = () => {
    setUploadState('uploading');
    setTimeout(() => {
      setUploadState('processing');
      setTimeout(() => {
        setUploadState('review');
      }, 2000);
    }, 1500);
  };

  const handleConfirm = () => {
    // Would save products
    setUploadState('idle');
    setParsedProducts(mockParsedProducts);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-2xl font-bold text-foreground">Import Products</h1>
        <p className="mb-6 text-muted-foreground">
          Add products quickly by uploading a receipt or CSV file.
        </p>

        <Tabs defaultValue="receipt">
          <TabsList className="w-full">
            <TabsTrigger value="receipt" className="flex-1 gap-2">
              <Camera className="h-4 w-4" />
              Receipt Scan
            </TabsTrigger>
            <TabsTrigger value="csv" className="flex-1 gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              CSV / Excel
            </TabsTrigger>
          </TabsList>

          <TabsContent value="receipt" className="mt-6">
            {uploadState === 'idle' && (
              <Card>
                <CardContent className="pt-6">
                  <div
                    className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 p-12 text-center transition-colors hover:border-primary hover:bg-muted"
                    onClick={handleUpload}
                  >
                    <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="mb-2 font-medium text-foreground">
                      Upload receipt photo
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Take a photo or upload an image of your purchase receipt
                    </p>
                    <Button className="mt-4" onClick={(e) => { e.stopPropagation(); handleUpload(); }}>
                      Choose File
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {(uploadState === 'uploading' || uploadState === 'processing') && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary" />
                  <p className="font-medium text-foreground">
                    {uploadState === 'uploading' ? 'Uploading...' : 'Processing receipt with AI...'}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    This may take a few seconds
                  </p>
                </CardContent>
              </Card>
            )}

            {uploadState === 'review' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Check className="h-5 w-5 text-primary" />
                    Products Detected
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Review and edit the detected products before adding to inventory.
                  </p>

                  <div className="space-y-3">
                    {parsedProducts.map((product, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-lg border border-border p-3"
                      >
                        <div className="flex-1">
                          <Input
                            defaultValue={product.name}
                            className="font-medium"
                          />
                        </div>
                        <div className="w-20">
                          <Input
                            type="number"
                            defaultValue={product.quantity}
                            min="0"
                          />
                        </div>
                        <Badge
                          variant={product.confidence > 0.9 ? 'secondary' : 'outline'}
                          className="w-16 justify-center"
                        >
                          {Math.round(product.confidence * 100)}%
                        </Badge>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {parsedProducts.some((p) => p.confidence < 0.85) && (
                    <div className="mt-4 flex items-start gap-2 rounded-lg bg-accent p-3 text-sm">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent-foreground" />
                      <p className="text-accent-foreground">
                        Some items have low confidence. Please review before confirming.
                      </p>
                    </div>
                  )}

                  <div className="mt-6 flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setUploadState('idle')}
                    >
                      Cancel
                    </Button>
                    <Button className="flex-1" onClick={handleConfirm}>
                      Add {parsedProducts.length} Products
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="csv" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 p-12 text-center">
                  <FileSpreadsheet className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="mb-2 font-medium text-foreground">
                    Upload CSV or Excel file
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports .csv, .xlsx formats
                  </p>
                  <Button className="mt-4" variant="outline">
                    Download Template
                  </Button>
                  <Button className="mt-2">
                    Choose File
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
