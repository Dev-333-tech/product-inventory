// src/pages/HomePage.jsx
import { useState } from 'react';
import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList';
import './HomePage.css';

export default function HomePage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="page-container">
      <h1 className="page-title">Product Inventory</h1>
      <div className="page-grid">
        <section className="section-card left-panel">
          <ProductForm onProductAdded={() => setRefreshKey((k) => k + 1)} />
        </section>
        <section className="section-card right-panel">
          <ProductList refreshKey={refreshKey} onRefresh={() => setRefreshKey((k) => k + 1)} />
        </section>
      </div>
    </div>
  );
}