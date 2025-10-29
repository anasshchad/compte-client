"use client"

import { useState } from "react"
import axios from "axios"
import API_BASE_URL from "../config"

function CompteForm({ onAccountCreated }) {
    const [compte, setCompte] = useState({ solde: "", dateCreation: "", type: "" })
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setCompte({ ...compte, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        console.log(compte)
        axios
            .post(`${API_BASE_URL}/comptes`, compte)
            .then((response) => {
                alert("Compte ajouté avec succès!")
                setCompte({ solde: "", dateCreation: "", type: "" })
                setLoading(false)
                if (onAccountCreated) {
                    onAccountCreated(response.data)
                }
            })
            .catch((error) => {
                console.error(error)
                alert("Erreur lors de l'ajout du compte")
                setLoading(false)
            })
    }

    return (
        <div className="card border-0 shadow-lg rounded-4 h-100 overflow-hidden">
            {/* Header */}
            <div
                className="card-header text-white py-3 px-4"
                style={{
                    background: "linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%)",
                }}
            >
                <h5 className="mb-0 fw-semibold d-flex align-items-center">
                    <i className="bi bi-plus-circle me-2 fs-5"></i>
                    Ajouter un Compte
                </h5>
            </div>

            {/* Body */}
            <div className="card-body p-4 bg-white">
                <form onSubmit={handleSubmit}>
                    {/* Solde */}
                    <div className="mb-4">
                        <label className="form-label fw-semibold text-secondary">
                            <i className="bi bi-cash-coin me-2 text-warning"></i>Solde (€)
                        </label>
                        <div className="input-group shadow-sm">
                            <span className="input-group-text bg-white border-0 text-muted">€</span>
                            <input
                                type="number"
                                name="solde"
                                className="form-control bg-light border-0"
                                placeholder="0.00"
                                onChange={handleChange}
                                value={compte.solde}
                                required
                            />
                        </div>
                    </div>

                    {/* Date de création */}
                    <div className="mb-4">
                        <label className="form-label fw-semibold text-secondary">
                            <i className="bi bi-calendar-event me-2 text-primary"></i>Date de Création
                        </label>
                        <input
                            type="date"
                            name="dateCreation"
                            className="form-control bg-light border-0 shadow-sm"
                            onChange={handleChange}
                            value={compte.dateCreation}
                            required
                        />
                    </div>

                    {/* Type de compte */}
                    <div className="mb-4">
                        <label className="form-label fw-semibold text-secondary">
                            <i className="bi bi-card-list me-2 text-success"></i>Type de Compte
                        </label>
                        <select
                            name="type"
                            className="form-select bg-light border-0 shadow-sm"
                            onChange={handleChange}
                            value={compte.type}
                            required
                        >
                            <option value="">Sélectionner un type...</option>
                            <option value="COURANT">COURANT</option>
                            <option value="EPARGNE">EPARGNE</option>
                        </select>
                    </div>

                    {/* Submit */}
                    <div className="mt-4">
                        <button
                            type="submit"
                            className="btn w-100 fw-semibold text-white py-3 shadow-sm"
                            disabled={loading}
                            style={{
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                border: "none",
                                transition: "all 0.3s ease",
                            }}
                        >
                            {loading ? (
                                <>
                <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                ></span>
                                    Ajout en cours...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-check-circle me-2"></i>Ajouter le Compte
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

}

export default CompteForm