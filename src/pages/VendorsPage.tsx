import type React from "react"
import { useState } from "react"
import { Plus, Search, Edit, Trash2, Mail, Building, User, Loader2, X } from "lucide-react"
import Loading from "../components/common/Loading"
import ErrorMessage from "../components/common/ErrorMessage"
import { useVendors, useDeleteVendor, useCreateVendor, useUpdateVendor } from "../hooks/useVendors"
import { formatDate } from "../utils/formatters"
import { validateVendorData } from "../utils/validators"
import type { CreateVendorRequest, Vendor } from "../types/vendor.types"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const VendorsPage: React.FC = () => {
  const { data: vendorsData, isLoading, error, refetch } = useVendors()
  const createVendor = useCreateVendor()
  const updateVendor = useUpdateVendor()
  const deleteVendor = useDeleteVendor()

  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null)
  const [deletingVendorId, setDeletingVendorId] = useState<string | null>(null)
  const [formData, setFormData] = useState<CreateVendorRequest>({
    name: "",
    email: "",
    notes: "",
  })
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const vendors = vendorsData?.data || []

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validation = validateVendorData(formData)
    if (!validation.isValid) {
      setValidationErrors(validation.errors)
      return
    }

    setValidationErrors([])

    try {
      if (editingVendor) {
        await updateVendor.mutateAsync({
          id: editingVendor.id,
          data: formData,
        })
      } else {
        await createVendor.mutateAsync(formData)
      }

      setFormData({ name: "", email: "", notes: "" })
      setShowForm(false)
      setEditingVendor(null)
    } catch (error) {
      // Error is handled by the hook
    }
  }

  const handleEdit = (vendor: Vendor) => {
    setEditingVendor(vendor)
    setFormData({
      name: vendor.name,
      email: vendor.email,
      notes: vendor.notes || "",
    })
    setShowForm(true)
    setValidationErrors([])
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingVendor(null)
    setFormData({ name: "", email: "", notes: "" })
    setValidationErrors([])
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      setDeletingVendorId(id)
      try {
        await deleteVendor.mutateAsync(id)
      } catch (error) {
        // Error is handled by the hook
      } finally {
        setDeletingVendorId(null)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Loading size="lg" text="Loading vendors..." />
      </div>
    )
  }

  if (error) {
    return <ErrorMessage title="Failed to load vendors" message={error.message} onRetry={() => refetch()} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vendors</h1>
          <p className="text-muted-foreground mt-2">Manage your vendor contacts and relationships</p>
        </div>
        <Button
          size="lg"
          onClick={() => {
            setEditingVendor(null)
            setShowForm(!showForm)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Vendor
        </Button>
      </div>

      {/* Add/Edit Vendor Form */}
      {showForm && (
        <Card className="border-primary/20 bg-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <h2 className="text-lg font-semibold text-foreground">
              {editingVendor ? "Edit Vendor" : "Add New Vendor"}
            </h2>
            <button onClick={handleCancel} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Vendor Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Enter vendor name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  placeholder="Additional notes about the vendor (optional)"
                />
              </div>

              {validationErrors.length > 0 && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3">
                  <ul className="text-sm text-destructive space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <Button 
                  type="submit"
                  disabled={createVendor.isPending || updateVendor.isPending}
                >
                  {(createVendor.isPending || updateVendor.isPending) && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {editingVendor ? "Update Vendor" : "Add Vendor"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search vendors by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Vendors List */}
      <div className="space-y-4">
        {filteredVendors.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
                <Building className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchTerm ? "No matching vendors found" : "No vendors yet"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm ? "Try adjusting your search criteria" : "Add your first vendor to start sending RFPs"}
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Vendor
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredVendors.map((vendor) => (
            <Card key={vendor.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg flex-shrink-0">
                      <Building className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-foreground">{vendor.name}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-4 w-4" />
                          <span className="truncate">{vendor.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>Added {formatDate(vendor.createdAt)}</span>
                        </div>
                      </div>
                      {vendor.notes && (
                        <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{vendor.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(vendor)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(vendor.id)}
                      disabled={deletingVendorId === vendor.id}
                    >
                      {deletingVendorId === vendor.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default VendorsPage