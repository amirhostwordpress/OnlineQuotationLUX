import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { FormField } from '../../types/admin';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Eye, 
  EyeOff,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const FormFieldManager: React.FC = () => {
  const { settings, updateFormField, deleteFormField, addFormField } = useAdmin();
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [isAddingField, setIsAddingField] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [newField, setNewField] = useState<Partial<FormField>>({
    type: 'text',
    label: '',
    required: false,
    step: 1,
    category: '',
    order: settings.formFields.length + 1,
    visible: true
  });

  const fieldTypes = [
    { value: 'text', label: 'Text Input' },
    { value: 'select', label: 'Dropdown' },
    { value: 'radio', label: 'Radio Buttons' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'textarea', label: 'Text Area' },
    { value: 'number', label: 'Number' },
    { value: 'file', label: 'File Upload' }
  ];

  const handleSaveField = async (field: FormField) => {
    try {
      setSaving(true);
      setMessage(null);
      await updateFormField(field);
    setEditingField(null);
      setMessage({ type: 'success', text: 'Field saved successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Failed to save field:', error);
      setMessage({ type: 'error', text: 'Failed to save field' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddField = async () => {
    if (newField.label && newField.type) {
      try {
        setSaving(true);
        setMessage(null);
        
      const field: FormField = {
        id: `custom_${Date.now()}`,
        type: newField.type as any,
        label: newField.label,
        placeholder: newField.placeholder,
        required: newField.required || false,
        options: newField.options,
        validation: newField.validation,
        step: newField.step || 1,
        category: newField.category || 'Custom',
        order: newField.order || settings.formFields.length + 1,
        visible: newField.visible !== false
      };
        
        await addFormField(field);
      setIsAddingField(false);
      setNewField({
        type: 'text',
        label: '',
        required: false,
        step: 1,
        category: '',
        order: settings.formFields.length + 2,
        visible: true
      });
        
        setMessage({ type: 'success', text: 'Field added successfully!' });
        setTimeout(() => setMessage(null), 3000);
      } catch (error) {
        console.error('Failed to add field:', error);
        setMessage({ type: 'error', text: 'Failed to add field' });
      } finally {
        setSaving(false);
      }
    }
  };

  const handleDeleteField = async (fieldId: string) => {
    try {
      setSaving(true);
      setMessage(null);
      await deleteFormField(fieldId);
      setMessage({ type: 'success', text: 'Field deleted successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Failed to delete field:', error);
      setMessage({ type: 'error', text: 'Failed to delete field' });
    } finally {
      setSaving(false);
    }
  };

  const handleMoveField = async (fieldId: string, direction: 'up' | 'down') => {
    try {
      setSaving(true);
    const field = settings.formFields.find(f => f.id === fieldId);
    if (!field) return;

    const newOrder = direction === 'up' ? field.order - 1 : field.order + 1;
    const swapField = settings.formFields.find(f => f.order === newOrder);

    if (swapField) {
        await updateFormField({ ...field, order: newOrder });
        await updateFormField({ ...swapField, order: field.order });
      }
    } catch (error) {
      console.error('Failed to move field:', error);
      setMessage({ type: 'error', text: 'Failed to move field' });
    } finally {
      setSaving(false);
    }
  };

  const sortedFields = [...settings.formFields].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg text-center font-semibold ${message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
          {message.text}
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Form Field Management</h3>
        <button
          onClick={() => setIsAddingField(true)}
          disabled={saving}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
        >
          <Plus size={16} />
          <span>{saving ? 'Saving...' : 'Add Field'}</span>
        </button>
      </div>

      {/* Add New Field Modal */}
      {isAddingField && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-gray-900">Add New Field</h4>
              <button
                onClick={() => setIsAddingField(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Field Type
                </label>
                <select
                  value={newField.type}
                  onChange={(e) => setNewField({ ...newField, type: e.target.value as any })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {fieldTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Label
                </label>
                <input
                  type="text"
                  value={newField.label}
                  onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Placeholder
                </label>
                <input
                  type="text"
                  value={newField.placeholder || ''}
                  onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Step
                </label>
                <select
                  value={newField.step}
                  onChange={(e) => setNewField({ ...newField, step: parseInt(e.target.value) })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(step => (
                    <option key={step} value={step}>Step {step}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={newField.category || ''}
                  onChange={(e) => setNewField({ ...newField, category: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newField.required}
                    onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                    className="mr-2"
                  />
                  Required
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newField.visible}
                    onChange={(e) => setNewField({ ...newField, visible: e.target.checked })}
                    className="mr-2"
                  />
                  Visible
                </label>
              </div>
            </div>

            {(newField.type === 'select' || newField.type === 'radio') && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Options (one per line)
                </label>
                <textarea
                  value={newField.options?.join('\n') || ''}
                  onChange={(e) => setNewField({ 
                    ...newField, 
                    options: e.target.value.split('\n').filter(o => o.trim()) 
                  })}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setIsAddingField(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddField}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                <Save size={16} />
                <span>Add Field</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fields List */}
      <div className="space-y-3">
        {sortedFields.map((field) => (
          <div key={field.id} className="bg-white border border-gray-200 rounded-lg p-4">
            {editingField?.id === field.id ? (
              <EditFieldForm
                field={editingField}
                onSave={handleSaveField}
                onCancel={() => setEditingField(null)}
                onChange={setEditingField}
              />
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                      Step {field.step}
                    </span>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {field.type}
                    </span>
                    <h4 className="font-medium text-gray-900">{field.label}</h4>
                    {field.required && (
                      <span className="text-red-500 text-sm">*</span>
                    )}
                    {!field.visible && (
                      <EyeOff size={16} className="text-gray-400" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Category: {field.category} | Order: {field.order}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleMoveField(field.id, 'up')}
                    className="text-gray-500 hover:text-gray-700"
                    disabled={field.order === 1}
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    onClick={() => handleMoveField(field.id, 'down')}
                    className="text-gray-500 hover:text-gray-700"
                    disabled={field.order === settings.formFields.length}
                  >
                    <ArrowDown size={16} />
                  </button>
                  <button
                    onClick={() => setEditingField(field)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteField(field.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const EditFieldForm: React.FC<{
  field: FormField;
  onSave: (field: FormField) => void;
  onCancel: () => void;
  onChange: (field: FormField) => void;
}> = ({ field, onSave, onCancel, onChange }) => {
  const fieldTypes = [
    { value: 'text', label: 'Text Input' },
    { value: 'select', label: 'Dropdown' },
    { value: 'radio', label: 'Radio Buttons' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'textarea', label: 'Text Area' },
    { value: 'number', label: 'Number' },
    { value: 'file', label: 'File Upload' }
  ];

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Field Type
          </label>
          <select
            value={field.type}
            onChange={(e) => onChange({ ...field, type: e.target.value as any })}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          >
            {fieldTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Label
          </label>
          <input
            type="text"
            value={field.label}
            onChange={(e) => onChange({ ...field, label: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Placeholder
          </label>
          <input
            type="text"
            value={field.placeholder || ''}
            onChange={(e) => onChange({ ...field, placeholder: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Step
          </label>
          <select
            value={field.step}
            onChange={(e) => onChange({ ...field, step: parseInt(e.target.value) })}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(step => (
              <option key={step} value={step}>Step {step}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <input
            type="text"
            value={field.category || ''}
            onChange={(e) => onChange({ ...field, category: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) => onChange({ ...field, required: e.target.checked })}
              className="mr-2"
            />
            Required
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={field.visible}
              onChange={(e) => onChange({ ...field, visible: e.target.checked })}
              className="mr-2"
            />
            Visible
          </label>
        </div>
      </div>

      {(field.type === 'select' || field.type === 'radio') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Options (one per line)
          </label>
          <textarea
            value={field.options?.join('\n') || ''}
            onChange={(e) => onChange({ 
              ...field, 
              options: e.target.value.split('\n').filter(o => o.trim()) 
            })}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(field)}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          <Save size={16} />
          <span>Save</span>
        </button>
      </div>
    </div>
  );
};

export default FormFieldManager;