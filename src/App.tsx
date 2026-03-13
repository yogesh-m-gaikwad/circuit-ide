import { useEffect } from "react";
import AppShell from "./components/ui/AppShell";
import { useHistory } from "./hooks/useHistory";
import { useAppDispatch } from "./hooks/hooks";
import { closeCommandBar, openCommandBar } from "./store/commandSlice";

function App() {
  const dispatch = useAppDispatch();
  useHistory();

  // open on '/' or ':' keypress from anywhere in the app
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      console.log("key pressed:", e.key, "target:", e.target);
      if (e.key === "/" || e.key === ":") {
        e.preventDefault();
        dispatch(openCommandBar());
      } else if (e.key === "Escape") {
        dispatch(closeCommandBar());
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [dispatch]);

  return <AppShell />;
}

export default App;
