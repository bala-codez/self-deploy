import AppRouter from "./routes/AppRouter.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { BrowserRouter } from "react-router-dom";
import Toast from "./components/ui/Toast.jsx";
import useAppStore from "./store/appStore.js";

export default function App() {
  const toasts = useAppStore((s) => s.toasts);
  const removeToast = useAppStore((s) => s.removeToast);

  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppRouter />
        <Toast toasts={toasts} remove={removeToast} />
      </ThemeProvider>
    </BrowserRouter>
  );
}
