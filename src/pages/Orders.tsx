
import React from 'react';

const Orders = () => {
  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Commandes</h1>
      <div className="bg-card p-6 rounded-lg shadow">
        <p className="text-lg text-muted-foreground">Aucune commande pour le moment.</p>
      </div>
    </div>
  );
};

export default Orders;
