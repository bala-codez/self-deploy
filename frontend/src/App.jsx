import AppRouter from "./routes/AppRouter.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { BrowserRouter } from "react-router-dom";
import Toast from "./components/ui/Toast.jsx";
import useToastStore from "./store/toastStore.js";

export default function App() {
    const { toasts, removeToast } = useToastStore();

    return (
        <BrowserRouter>
            <ThemeProvider>
                <AppRouter />
                <Toast toasts={toasts} remove={removeToast} />
            </ThemeProvider>
        </BrowserRouter>
    );
}
