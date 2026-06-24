import { Navigate, Route, Routes } from 'react-router-dom';
import { TenantProvider } from './tenant/TenantProvider';
import { SessionProvider } from './session/SessionProvider';
import { ApiProvider } from './api/ApiProvider';
import { ThemedApp } from './ThemedApp';
import { AppLayout } from './components/AppLayout';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { BillingPage } from './pages/BillingPage';

export function App() {
  return (
    <TenantProvider>
      <SessionProvider>
        <ApiProvider>
          <ThemedApp>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/auth/login" element={<LoginPage />} />
                <Route path="/account/billing" element={<BillingPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </ThemedApp>
        </ApiProvider>
      </SessionProvider>
    </TenantProvider>
  );
}
