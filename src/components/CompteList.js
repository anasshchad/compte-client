"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import API_BASE_URL from "../config"

export default function CompteList({ refreshTrigger, newAccount }) {
    const [comptes, setComptes] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchId, setSearchId] = useState("")
    const [filteredComptes, setFilteredComptes] = useState([])
    const [editingCompte, setEditingCompte] = useState(null)
    const [showModal, setShowModal] = useState(false)

    // Fetch all comptes
    const fetchComptes = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${API_BASE_URL}/comptes`)
            const data = Array.isArray(response.data) ? response.data : [response.data]
            setComptes(data)
            setFilteredComptes(data)
        } catch (error) {
            console.error("Error fetching comptes:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (newAccount) {
            setComptes((prev) => [newAccount, ...prev])
            setFilteredComptes((prev) => [newAccount, ...prev])
        }
    }, [newAccount])

    const handleSearchChange = (e) => {
        const value = e.target.value
        setSearchId(value)

        if (!value.trim()) {
            setFilteredComptes(comptes)
            return
        }

        const filtered = comptes.filter((compte) =>
            compte.id?.toString().includes(value)
        )
        setFilteredComptes(filtered)
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this account?")) return
        try {
            await axios.delete(`${API_BASE_URL}/comptes/${id}`)
            setComptes((prev) => prev.filter((c) => c.id !== id))
            setFilteredComptes((prev) => prev.filter((c) => c.id !== id))
            alert("Account deleted successfully")
        } catch (error) {
            console.error("Error deleting compte:", error)
            alert("Error deleting account")
        }
    }

    const handleEditClick = (compte) => {
        setEditingCompte(compte)
        setShowModal(true)
    }

    const handleClearSearch = () => {
        setSearchId("")
        setFilteredComptes(comptes)
    }

    useEffect(() => {
        fetchComptes()
    }, [refreshTrigger])

    return (
        <div className="container-fluid py-5 bg-light min-vh-100">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                {/* Header */}
                <div
                    className="card-header py-3 px-4 text-white"
                    style={{
                        background: "linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%)",
                    }}
                >
                    <div className="d-flex justify-content-between align-items-center">
                        <h2 className="mb-0 fw-semibold">
                            <i className="bi bi-list-ul me-2"></i>Accounts Overview
                        </h2>
                        <span className="badge bg-light text-dark fs-6 px-3 py-2">
            {filteredComptes.length} Accounts
          </span>
                    </div>
                </div>

                {/* Body */}
                <div className="card-body bg-white">
                    {/* Search Section */}
                    <div className="mb-4">
                        <div className="row g-3 align-items-center">
                            <div className="col-md-8">
                                <div className="input-group shadow-sm">
                <span className="input-group-text bg-white border-0">
                  <i className="bi bi-search text-secondary"></i>
                </span>
                                    <input
                                        type="text"
                                        className="form-control border-0 bg-light"
                                        placeholder="Search by Account ID..."
                                        value={searchId}
                                        onChange={handleSearchChange}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4 text-md-end">
                                {searchId && (
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary shadow-sm"
                                        onClick={handleClearSearch}
                                    >
                                        <i className="bi bi-x-circle me-1"></i> Clear Search
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Loading / Empty / Table */}
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : !filteredComptes.length ? (
                        <div className="alert alert-light border text-center shadow-sm" role="alert">
                            <i className="bi bi-info-circle me-2"></i>
                            No accounts found
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table align-middle table-hover text-center">
                                <thead className="table-primary">
                                <tr>
                                    <th>ID</th>
                                    <th>Balance</th>
                                    <th>Creation Date</th>
                                    <th>Type</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredComptes.map((compte) => (
                                    <tr key={compte.id}>
                                        <td>
                      <span className="badge bg-primary bg-gradient px-3 py-2">
                        {compte.id}
                      </span>
                                        </td>
                                        <td className="fw-semibold text-success">
                                            ${compte.solde?.toFixed(2) || "0.00"}
                                        </td>
                                        <td>{compte.dateCreation}</td>
                                        <td>
                      <span className="badge bg-info text-dark px-3 py-2">
                        {compte.type}
                      </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-warning me-2"
                                                onClick={() => handleEditClick(compte)}
                                            >
                                                <i className="bi bi-pencil-square me-1"></i>Edit
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDelete(compte.id)}
                                            >
                                                <i className="bi bi-trash me-1"></i>Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && editingCompte && (
                <div
                    className="modal fade show d-block"
                    style={{
                        backgroundColor: "rgba(0,0,0,0.6)",
                        backdropFilter: "blur(3px)",
                    }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4">
                            <div className="modal-header bg-warning text-dark">
                                <h5 className="modal-title fw-semibold">
                                    <i className="bi bi-pencil me-2"></i>Edit Account
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body bg-light">
                                <EditCompteForm
                                    compte={editingCompte}
                                    onSuccess={() => {
                                        setEditingCompte(null);
                                        setShowModal(false);
                                        fetchComptes();
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

}

function EditCompteForm({ compte, onSuccess }) {
    const [formData, setFormData] = useState({
        solde: Number(compte.solde).toFixed(2) || "",
        dateCreation: compte.dateCreation || "",
        type: compte.type || "",
    })
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        console.log(formData)
        axios
            .put(`${API_BASE_URL}/comptes/${compte.id}`, formData)
            .then((res) => {
                alert("Account updated successfully")
                setLoading(false)
                onSuccess(res.data)
            })
            .catch((error) => {
                console.error("Error updating compte:", error)
                alert("Error updating account")
                setLoading(false)
            })
    }


    return (
        <form onSubmit={handleSubmit} className="p-3">
            {/* Balance */}
            <div className="mb-4">
                <label className="form-label fw-semibold text-secondary">
                    <i className="bi bi-cash-coin me-2 text-warning"></i>Balance
                </label>
                <input
                    type="number"
                    step="0.01"
                    className="form-control form-control-lg bg-light border-0 shadow-sm"
                    name="solde"
                    value={formData.solde}
                    onChange={handleChange}
                    placeholder="Enter account balance..."
                    required
                />
            </div>

            {/* Creation Date */}
            <div className="mb-4">
                <label className="form-label fw-semibold text-secondary">
                    <i className="bi bi-calendar-event me-2 text-primary"></i>Creation Date
                </label>
                <input
                    type="date"
                    className="form-control form-control-lg bg-light border-0 shadow-sm"
                    name="dateCreation"
                    value={formData.dateCreation}
                    onChange={handleChange}
                    required
                />
            </div>

            {/* Type */}
            <div className="mb-4">
                <label className="form-label fw-semibold text-secondary">
                    <i className="bi bi-card-list me-2 text-success"></i>Account Type
                </label>
                <select
                    className="form-select form-select-lg bg-light border-0 shadow-sm"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Type</option>
                    <option value="COURANT">COURANT</option>
                    <option value="EPARGNE">EPARGNE</option>
                </select>
            </div>

            {/* Submit Button */}
            <div className="mt-4">
                <button
                    type="submit"
                    className="btn btn-gradient w-100 py-3 fw-semibold text-white"
                    style={{
                        background: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
                        border: "none",
                        transition: "all 0.3s ease",
                    }}
                    disabled={loading}
                >
                    {loading ? (
                        <>
            <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
            ></span>
                            Updating...
                        </>
                    ) : (
                        <>
                            <i className="bi bi-check2-circle me-2"></i>Update Account
                        </>
                    )}
                </button>
            </div>
        </form>
    );

}