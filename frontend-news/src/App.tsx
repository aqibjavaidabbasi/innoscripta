import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { NewsProvider } from "./context/NewsContext";
import Header from "./components/header/Header";
import Home from "./pages/home/Home";
import Login from "./pages/auth/Login";
import News from "./pages/news/News";
import Footer from "./components/footer/Footer";
import SignUp from "./pages/auth/SignUp";
import { AuthProvider } from "./context/AuthContext";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <NewsProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto p-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/news" element={<News />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </NewsProvider>
    </AuthProvider>
  );
}

export default App;