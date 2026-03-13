import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import useAppStore from "../../store/appStore";
import useAuthStore from "../../store/authStore";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import MonitorPanel from "./MonitorPanel";
import CreateAppModal from "../../features/apps/CreateAppModal";
import CreateLabModal from "../../features/labs/CreateLabModal";

export default function Layout() {
  const { isAuthenticated } = useAuthStore();
  const showNewApp = useAppStore((s) => s.showNewApp);
  const showNewLab = useAppStore((s) => s.showNewLab);
  const setShowNewApp = useAppStore((s) => s.setShowNewApp);
  const setShowNewLab = useAppStore((s) => s.setShowNewLab);
  const addApp = useAppStore((s) => s.addApp);
  const addLab = useAppStore((s) => s.addLab);
  const toast = useAppStore((s) => s.toast);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Redirect to login if not authenticated
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const showMonitor = ["/", "/monitoring"].includes(location.pathname);

  return (
    <div className="flex h-full overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm md:hidden animate-fadeIn"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 md:relative md:flex transition-transform duration-300 ease-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          onNewApp={() => setShowNewApp(true)}
          onNewLab={() => setShowNewLab(true)}
        />

        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 md:p-6 xl:p-7">
            <Outlet />
          </main>
          {showMonitor && (
            <div className="hidden xl:flex shrink-0">
              <MonitorPanel />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateAppModal
        open={showNewApp}
        onClose={() => setShowNewApp(false)}
        onCreate={(a) => { addApp(a); toast("Deploying!", `${a.name} build started.`); }}
        toast={toast}
      />
      <CreateLabModal
        open={showNewLab}
        onClose={() => setShowNewLab(false)}
        onCreate={(l) => { addLab(l); toast("Lab created!", `${l.name} is starting.`); }}
        toast={toast}
      />
    </div>
  );
}
