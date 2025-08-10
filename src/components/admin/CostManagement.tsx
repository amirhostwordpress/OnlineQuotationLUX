import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Edit, 
  Save, 
  X, 
  DollarSign,
  Plus,
  Trash2,
  Package,
  Calculator,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { apiRequest } from '../../utils/apiUtils';
import { useAuth } from '../../context/AuthContext';
import { 
  fetchCostCategories,
  createCostCategory,
  updateCostCategory,
  deleteCostCategory,
  addCostField,
  updateCostField,
  deleteCostField,
  calculateTotalCost,
  getFieldTypeLabel,
  getFieldTypeIcon,
  FIELD_TYPES,
  AVAILABLE_UNITS,
  type CostCategory,
  type CostField
} from '../../services/costManagementService';

// Use types from service
type CostField = CostField;
type CostCategory = CostCategory;

const CostManagement: React.FC = () => {
  const { user } = useAuth();
  const [costCategories, setCostCategories] = useState<CostCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<CostCategory | null>(null);
  const [editingField, setEditingField] = useState<CostField | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddField, setShowAddField] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CostCategory | null>(null);
  const [newCategory, setNewCategory] = useState<Partial<CostCategory>>({});
  const [newField, setNewField] = useState<Partial<CostField>>({});

  const fieldTypes = FIELD_TYPES;
  const units = AVAILABLE_UNITS;

  useEffect(() => {
    loadCostCategories();
  }, []);

  const loadCostCategories = async () => {
    try {
      setLoading(true);
      const response = await fetchCostCategories();
      setCostCategories(response || []);
    } catch (error) {
      console.error('Error fetching cost categories:', error);
      setMessage({ type: 'error', text: 'Failed to fetch cost categories' });
      setCostCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    try {
      setSaving(true);
      setMessage(null);

      await createCostCategory(newCategory);

             setMessage({ type: 'success', text: 'Cost category added successfully!' });
       setShowAddCategory(false);
       setNewCategory({});
       loadCostCategories();
    } catch (error) {
      console.error('Error adding cost category:', error);
      setMessage({ type: 'error', text: 'Failed to add cost category' });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory?.id) return;

    try {
      setSaving(true);
      setMessage(null);

      await updateCostCategory(editingCategory.id, editingCategory);

             setMessage({ type: 'success', text: 'Cost category updated successfully!' });
       setEditingCategory(null);
       loadCostCategories();
    } catch (error) {
      console.error('Error updating cost category:', error);
      setMessage({ type: 'error', text: 'Failed to update cost category' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm('Are you sure you want to delete this cost category? This will also delete all associated cost fields.')) {
      return;
    }

    try {
      setSaving(true);
      setMessage(null);

      await deleteCostCategory(categoryId);

             setMessage({ type: 'success', text: 'Cost category deleted successfully!' });
       loadCostCategories();
    } catch (error) {
      console.error('Error deleting cost category:', error);
      setMessage({ type: 'error', text: 'Failed to delete cost category' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddField = async () => {
    if (!selectedCategory?.id) return;

    try {
      setSaving(true);
      setMessage(null);

      await addCostField(selectedCategory.id, newField);

             setMessage({ type: 'success', text: 'Cost field added successfully!' });
       setShowAddField(false);
       setNewField({});
       loadCostCategories();
    } catch (error) {
      console.error('Error adding cost field:', error);
      setMessage({ type: 'error', text: 'Failed to add cost field' });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateField = async () => {
    if (!editingField?.id) return;

    try {
      setSaving(true);
      setMessage(null);

      await updateCostField(editingField.id, editingField);

             setMessage({ type: 'success', text: 'Cost field updated successfully!' });
       setEditingField(null);
       loadCostCategories();
    } catch (error) {
      console.error('Error updating cost field:', error);
      setMessage({ type: 'error', text: 'Failed to update cost field' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteField = async (fieldId: number) => {
    if (!confirm('Are you sure you want to delete this cost field?')) {
      return;
    }

    try {
      setSaving(true);
      setMessage(null);

      await deleteCostField(fieldId);

             setMessage({ type: 'success', text: 'Cost field deleted successfully!' });
       loadCostCategories();
    } catch (error) {
      console.error('Error deleting cost field:', error);
      setMessage({ type: 'error', text: 'Failed to delete cost field' });
    } finally {
      setSaving(false);
    }
  };

  const getFieldTypeIcon = (type: string) => {
    const fieldType = (fieldTypes || []).find(ft => ft.value === type);
    return fieldType ? fieldType.icon : DollarSign;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading cost management...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Cost Management</h2>
        <div className="flex space-x-2">
                     <button
             onClick={loadCostCategories}
             className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
           >
            <Settings size={16} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowAddCategory(true)}
            className="flex items-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
          >
            <Plus size={16} />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Add Category Form */}
      {showAddCategory && (
        <div className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Cost Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Name *
              </label>
              <input
                type="text"
                value={newCategory.category_name || ''}
                onChange={(e) => setNewCategory(prev => ({ ...prev, category_name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter category name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={newCategory.description || ''}
                onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter description"
              />
            </div>
          </div>
          <div className="flex space-x-2 mt-4">
            <button
              onClick={handleAddCategory}
              disabled={saving || !newCategory.category_name}
              className="flex items-center space-x-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <Save size={16} />
              <span>{saving ? 'Adding...' : 'Add Category'}</span>
            </button>
            <button
              onClick={() => {
                setShowAddCategory(false);
                setNewCategory({});
              }}
              className="flex items-center space-x-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              <X size={16} />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}

      {/* Add Field Form */}
      {showAddField && selectedCategory && (
        <div className="mb-6 p-4 border border-green-200 rounded-lg bg-green-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Add Cost Field to "{selectedCategory.category_name}"
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field Name *
              </label>
              <input
                type="text"
                value={newField.field_name || ''}
                onChange={(e) => setNewField(prev => ({ ...prev, field_name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter field name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field Type *
              </label>
              <select
                value={newField.field_type || ''}
                onChange={(e) => setNewField(prev => ({ ...prev, field_type: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select field type</option>
                                 {(fieldTypes || []).map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base Cost *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={newField.base_cost || ''}
                onChange={(e) => setNewField(prev => ({ ...prev, base_cost: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter base cost"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit *
              </label>
              <select
                value={newField.unit || ''}
                onChange={(e) => setNewField(prev => ({ ...prev, unit: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select unit</option>
                                 {(units || []).map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newField.description || ''}
                onChange={(e) => setNewField(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter description"
              />
            </div>
          </div>
          <div className="flex space-x-2 mt-4">
            <button
              onClick={handleAddField}
              disabled={saving || !newField.field_name || !newField.field_type || !newField.base_cost || !newField.unit}
              className="flex items-center space-x-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <Save size={16} />
              <span>{saving ? 'Adding...' : 'Add Field'}</span>
            </button>
            <button
              onClick={() => {
                setShowAddField(false);
                setNewField({});
                setSelectedCategory(null);
              }}
              className="flex items-center space-x-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              <X size={16} />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {(costCategories || []).map((category) => (
          <div key={category.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <DollarSign size={20} className="text-green-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">{category.category_name}</h3>
                  {category.description && (
                    <p className="text-sm text-gray-600">{category.description}</p>
                  )}
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-500">
                      {category.fields?.length || 0} fields
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      Total: ${calculateTotalCost(category.fields || []).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                {editingCategory?.id === category.id ? (
                  <>
                    <button
                      onClick={handleUpdateCategory}
                      disabled={saving}
                      className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                    >
                      <Save size={14} />
                      <span>{saving ? 'Saving...' : 'Save'}</span>
                    </button>
                    <button
                      onClick={() => setEditingCategory(null)}
                      className="flex items-center space-x-1 bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                    >
                      <X size={14} />
                      <span>Cancel</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setSelectedCategory(category);
                        setShowAddField(true);
                      }}
                      className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      <Plus size={14} />
                      <span>Add Field</span>
                    </button>
                    <button
                      onClick={() => setEditingCategory(category)}
                      className="flex items-center space-x-1 bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                    >
                      <Edit size={14} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id!)}
                      className="flex items-center space-x-1 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Category Edit Form */}
            {editingCategory?.id === category.id && (
              <div className="mb-4 p-3 border border-yellow-200 rounded-lg bg-yellow-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category Name
                    </label>
                    <input
                      type="text"
                      value={editingCategory.category_name || ''}
                      onChange={(e) => setEditingCategory(prev => prev ? { ...prev, category_name: e.target.value } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={editingCategory.description || ''}
                      onChange={(e) => setEditingCategory(prev => prev ? { ...prev, description: e.target.value } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Cost Fields */}
                         <div className="space-y-3">
               {(category.fields || []).map((field) => (
                <div key={field.id} className="border border-gray-100 rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {React.createElement(getFieldTypeIcon(field.field_type), { size: 16, className: "text-blue-600" })}
                      <div>
                        <h4 className="font-medium text-gray-900">{field.field_name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{getFieldTypeLabel(field.field_type)}</span>
                          <span>${field.base_cost?.toFixed(2)} {field.unit}</span>
                          {field.description && (
                            <span className="italic">{field.description}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {editingField?.id === field.id ? (
                        <>
                          <button
                            onClick={handleUpdateField}
                            disabled={saving}
                            className="flex items-center space-x-1 bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50"
                          >
                            <Save size={12} />
                            <span>{saving ? 'Saving...' : 'Save'}</span>
                          </button>
                          <button
                            onClick={() => setEditingField(null)}
                            className="flex items-center space-x-1 bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700"
                          >
                            <X size={12} />
                            <span>Cancel</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingField(field)}
                            className="flex items-center space-x-1 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                          >
                            <Edit size={12} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteField(field.id!)}
                            className="flex items-center space-x-1 bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                          >
                            <Trash2 size={12} />
                            <span>Delete</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Field Edit Form */}
                  {editingField?.id === field.id && (
                    <div className="mt-3 p-3 border border-blue-200 rounded-lg bg-blue-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Field Name
                          </label>
                          <input
                            type="text"
                            value={editingField.field_name || ''}
                            onChange={(e) => setEditingField(prev => prev ? { ...prev, field_name: e.target.value } : null)}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Field Type
                          </label>
                          <select
                            value={editingField.field_type || ''}
                            onChange={(e) => setEditingField(prev => prev ? { ...prev, field_type: e.target.value as any } : null)}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          >
                            {(fieldTypes || []).map(type => (
                              <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Base Cost
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={editingField.base_cost || ''}
                            onChange={(e) => setEditingField(prev => prev ? { ...prev, base_cost: parseFloat(e.target.value) || 0 } : null)}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Unit
                          </label>
                          <select
                            value={editingField.unit || ''}
                            onChange={(e) => setEditingField(prev => prev ? { ...prev, unit: e.target.value } : null)}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          >
                            {(units || []).map(unit => (
                              <option key={unit} value={unit}>{unit}</option>
                            ))}
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            value={editingField.description || ''}
                            onChange={(e) => setEditingField(prev => prev ? { ...prev, description: e.target.value } : null)}
                            rows={2}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {(!category.fields || category.fields.length === 0) && (
              <div className="text-center py-4 text-gray-500">
                <AlertCircle size={20} className="mx-auto mb-2 text-gray-400" />
                <p>No cost fields added yet.</p>
                <button
                  onClick={() => {
                    setSelectedCategory(category);
                    setShowAddField(true);
                  }}
                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                >
                  Add your first cost field
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

             {(costCategories || []).length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <DollarSign size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Cost Categories</h3>
          <p className="text-gray-600 mb-4">Start by creating your first cost category to manage your costs.</p>
          <button
            onClick={() => setShowAddCategory(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Create First Category
          </button>
        </div>
      )}
    </div>
  );
};

export default CostManagement;