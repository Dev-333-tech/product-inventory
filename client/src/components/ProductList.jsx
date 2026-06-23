import { useState, useEffect } from 'react';
import { getProducts, deleteProduct, getCategories } from '../api/productApi';
import MultiSelectDropdown from './MultiSelectDropdown';
import './ProductList.css';

export default function ProductList({ refreshKey, onRefresh }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCats, setSelectedCats] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await getProducts({
          page,
          limit: 5,
          search,
          categories: selectedCats.join(','),
        });
        if (!cancelled) {
          setProducts(res.data.products);
          setTotalPages(res.data.totalPages);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProducts();

    return () => { cancelled = true; };

  }, [page, search, selectedCats, refreshKey]);

  const handleSearchChange = (e) => { setSearch(e.target.value); setPage(1); };
  const handleCatChange = (cats) => { setSelectedCats(cats); setPage(1); };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    onRefresh();
  };

  return (
    <div>
      <div className="filters">
        <input
          className="search-input"
          placeholder="Search by name..."
          value={search}
          onChange={handleSearchChange}
        />
        <MultiSelectDropdown
          options={categories}
          selected={selectedCats}
          onChange={handleCatChange}
          placeholder="Filter by category"
        />
      </div>

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : products.length === 0 ? (
        <p className="empty-text">No products found.</p>
      ) : (
        <table className="product-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Categories</th>
              <th>Added On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>
                  {p.categories.map((c) => (
                    <span key={c._id} className="product-pill">
                      {c.name}
                    </span>
                  ))}
                </td>
                <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleDelete(p._id)} className="delete-button">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => setPage(num)}
            className={`page-button ${page === num ? 'active' : ''}`}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
}