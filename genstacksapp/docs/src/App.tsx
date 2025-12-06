import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Home } from "@/pages/Home";
import { DocsLayout } from "@/pages/DocsLayout";
import { Introduction } from "@/pages/Introduction";
import { Installation } from "@/pages/Installation";
import { Components } from "@/pages/Components";
import { Examples } from "@/pages/Examples";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="docs-theme">
      <BrowserRouter>
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/docs" element={<DocsLayout />}>
                <Route
                  index
                  element={<Navigate to="/docs/introduction" replace />}
                />
                <Route path="introduction" element={<Introduction />} />
                <Route path="installation" element={<Installation />} />
                <Route path="quick-start" element={<Introduction />} />
                <Route
                  path="documentation/overview"
                  element={<Introduction />}
                />
                <Route
                  path="documentation/configuration"
                  element={<Installation />}
                />
                <Route path="documentation/api" element={<Introduction />} />
              </Route>
              <Route path="/components" element={<DocsLayout />}>
                <Route index element={<Components />} />
                <Route path="button" element={<Components />} />
                <Route path="card" element={<Components />} />
                <Route path="table" element={<Components />} />
              </Route>
              <Route path="/examples" element={<DocsLayout />}>
                <Route index element={<Examples />} />
                <Route path="basic" element={<Examples />} />
                <Route path="advanced" element={<Examples />} />
              </Route>
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
