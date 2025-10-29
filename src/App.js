"use client"

import CompteList from "./components/CompteList"
import CompteForm from "./components/CompteForm"
import { useState, useCallback } from "react"

function App() {
    const [refreshTrigger] = useState(0)
    const [newAccount, setNewAccount] = useState(null)

    const handleAccountCreated = useCallback((account) => {
        setNewAccount(account)
    }, [])

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 via-white to-slate-200">
            {/* Navbar */}
            <nav className="bg-gradient-to-r from-indigo-600 to-purple-700 shadow-md">
                <div className="container mx-auto flex items-center justify-between px-6 py-3">
                    <h1 className="text-white text-xl font-semibold tracking-wide flex items-center">
                        <i className="bi bi-bank me-2 text-2xl"></i>
                        <span>Bank Account Manager</span>
                    </h1>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="bg-white shadow-xl rounded-2xl p-6 mb-10 transition-all hover:shadow-2xl">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                        Create a New Account
                    </h2>
                    <CompteForm onAccountCreated={handleAccountCreated} />
                </div>

                <section className="bg-white shadow-xl rounded-2xl p-6 transition-all hover:shadow-2xl">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                        Account List
                    </h2>
                    <CompteList refreshTrigger={refreshTrigger} newAccount={newAccount} />
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 text-center py-5 mt-10 shadow-inner">
                <p className="text-sm tracking-wide">
                    © {new Date().getFullYear()} Bank Account Management System — All rights reserved.
                </p>
            </footer>
        </div>
    );
}

export default App