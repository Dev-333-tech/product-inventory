import { useState, useEffect } from 'react';
import { createProduct, getCategories } from '../api/productApi';
import MultiSelectDropdown from './MultiSelectDropdown';
import './ProductForm.css';

export default function ProductForm({ onProductAdded }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', quantity: '', categories: [] });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data));
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (form.quantity === '' || isNaN(form.quantity) || Number(form.quantity) < 0)
      errs.quantity = 'Quantity must be 0 or more';
    if (form.categories.length === 0) errs.categories = 'Select at least one category';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setErrors({});
    setLoading(true);
    try {
      await createProduct({ ...form, quantity: Number(form.quantity) });
      setForm({ name: '', description: '', quantity: '', categories: [] });
      onProductAdded();
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>Add Product</h2>

      {serverError && <p className="server-error">{serverError}</p>}

      <div className="form-row">
        <label>Name</label>
        <input
          className="input-field"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Product name"
        />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>

      <div className="form-row">
        <label>Description</label>
        <textarea
          className="textarea-field"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        {errors.description && <span className="field-error">{errors.description}</span>}
      </div>

      <div className="form-row">
        <label>Quantity</label>
        <input
          className="input-field"
          type="number"
          min="0"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
        />
        {errors.quantity && <span className="field-error">{errors.quantity}</span>}
      </div>

      <div className="form-row">
        <label>Categories</label>
        <MultiSelectDropdown
          options={categories}
          selected={form.categories}
          onChange={(cats) => setForm({ ...form, categories: cats })}
          placeholder="Select categories"
        />
        {errors.categories && <span className="field-error">{errors.categories}</span>}
      </div>

      <div className="submit-row">
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </div>
    </form>
  );
}