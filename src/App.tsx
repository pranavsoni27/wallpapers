import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from '@/components/layout';
import { AuthProvider } from '@/contexts/AuthProvider';
import { AuthModal } from '@/components/features/AuthModal';
import { AdminRoute } from '@/components/auth/AdminRoute';
import { useRedirectOnLogout, useScrollToTop } from '@/hooks';
import {
  HomePage,
  AllWallpapersPage,
  FavoritesPage,
  PopularPage,
  LatestPage,
  CategoriesPage,
  AdminPage,
} from '@/pages';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AppRoutes() {
  // Hook to redirect to home when user logs out
  useRedirectOnLogout();
  
  // Hook to scroll to top when route changes
  useScrollToTop();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/all-wallpapers" element={<AllWallpapersPage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
      <Route path="/popular" element={<PopularPage />} />
      <Route path="/latest" element={<LatestPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Layout>
            <AppRoutes />
          </Layout>
          <AuthModal />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
