import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { AppLayout } from "@/components/layout/AppLayout";

// Public pages
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import PricingPage from "./pages/PricingPage";
import NotFound from "./pages/NotFound";

// Retailer pages
import RetailerHome from "./pages/retailer/RetailerHome";
import SearchResults from "./pages/retailer/SearchResults";
import SupplierProfile from "./pages/retailer/SupplierProfile";
import RetailerFavorites from "./pages/retailer/RetailerFavorites";
import RetailerQuotes from "./pages/retailer/RetailerQuotes";
import RetailerProfile from "./pages/retailer/RetailerProfile";

// Supplier pages
import SupplierDashboard from "./pages/supplier/SupplierDashboard";
import SupplierInventory from "./pages/supplier/SupplierInventory";
import SupplierPOS from "./pages/supplier/SupplierPOS";
import SupplierCustomers from "./pages/supplier/SupplierCustomers";
import SupplierAnalytics from "./pages/supplier/SupplierAnalytics";
import SupplierOnboarding from "./pages/supplier/SupplierOnboarding";
import SupplierSubscription from "./pages/supplier/SupplierSubscription";
import SupplierSettings from "./pages/supplier/SupplierSettings";
import ReceiptImport from "./pages/supplier/ReceiptImport";
import InvoicesList from "./pages/supplier/InvoicesList";
import InvoiceForm from "./pages/supplier/InvoiceForm";
import InvoiceDetail from "./pages/supplier/InvoiceDetail";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminVerify from "./pages/admin/AdminVerify";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/auth/:role/:mode" element={<AuthPage />} />

            {/* Retailer routes */}
            <Route path="/retailer" element={<AppLayout><RetailerHome /></AppLayout>} />
            <Route path="/retailer/search" element={<AppLayout><SearchResults /></AppLayout>} />
            <Route path="/retailer/supplier/:id" element={<AppLayout><SupplierProfile /></AppLayout>} />
            <Route path="/retailer/favorites" element={<AppLayout><RetailerFavorites /></AppLayout>} />
            <Route path="/retailer/quotes" element={<AppLayout><RetailerQuotes /></AppLayout>} />
            <Route path="/retailer/profile" element={<AppLayout><RetailerProfile /></AppLayout>} />

            {/* Supplier routes */}
            <Route path="/supplier" element={<AppLayout><SupplierDashboard /></AppLayout>} />
            <Route path="/supplier/inventory" element={<AppLayout><SupplierInventory /></AppLayout>} />
            <Route path="/supplier/pos" element={<AppLayout><SupplierPOS /></AppLayout>} />
            <Route path="/supplier/customers" element={<AppLayout><SupplierCustomers /></AppLayout>} />
            <Route path="/supplier/analytics" element={<AppLayout><SupplierAnalytics /></AppLayout>} />
            <Route path="/supplier/onboarding" element={<SupplierOnboarding />} />
            <Route path="/supplier/subscription" element={<AppLayout><SupplierSubscription /></AppLayout>} />
            <Route path="/supplier/settings" element={<AppLayout><SupplierSettings /></AppLayout>} />
            <Route path="/supplier/import" element={<AppLayout><ReceiptImport /></AppLayout>} />
            <Route path="/supplier/invoices" element={<AppLayout><InvoicesList /></AppLayout>} />
            <Route path="/supplier/invoices/new" element={<AppLayout><InvoiceForm /></AppLayout>} />
            <Route path="/supplier/invoices/:id" element={<AppLayout><InvoiceDetail /></AppLayout>} />
            <Route path="/supplier/invoices/:id/edit" element={<AppLayout><InvoiceForm /></AppLayout>} />

            {/* Admin routes */}
            <Route path="/admin" element={<AppLayout><AdminDashboard /></AppLayout>} />
            <Route path="/admin/verify" element={<AppLayout><AdminVerify /></AppLayout>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
