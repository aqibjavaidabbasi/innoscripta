import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from "./components/header/Header";
import Login from "./pages/auth/Login";
import Footer from "./components/footer/Footer";
import SignUp from "./pages/auth/SignUp";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import NewsPage from "./pages/newsPage/NewsPage";
import PersonalizedNewsPage from "./pages/newsPage/PersonalizedNewsPage";
import Home from "./pages/home/Home";
import Settings from "./pages/settings/Settings";

const App: React.FC = () => {
  return (
    <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="container flex-grow p-4 mx-auto">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                {/* Private Routes */}
                <Route element={<PrivateRoute />}>
                <Route path="/preferences" element={<Settings />} />
                  <Route path="/news-page" element={<NewsPage />} />
                  <Route path="/personalized-news" element={<PersonalizedNewsPage />} />
                </Route>
              </Routes>
            </main>
            <Footer />
          </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
