"use client";

import { useState, useEffect } from 'react';

type LineItem = {
  id: number;
  part_number: string;
  description: string;
  quantity: number;
  unit_price: number;
};

type LineItemsTableProps = {
  initialItems: LineItem[];
};

const LineItemsTable = ({ initialItems }: LineItemsTableProps) => {
  const [items, setItems] = useState<LineItem[]>([]);

  useEffect(() => {
    if (initialItems && initialItems.length > 0) {
      setItems(initialItems);
    } else {
      setItems([{ id: 1, part_number: 'XJ-900', description: 'Turbo Encabulator', quantity: 5, unit_price: 500 }]);
    }
  }, [initialItems]);

  const handleInputChange = (id: number, field: keyof LineItem, value: string) => {
    const newItems = items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: field === 'quantity' || field === 'unit_price' ? Number(value) : value };
      }
      return item;
    });
    setItems(newItems);
  };

  return (
    <div className="w-full">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Part #</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Qty</th>
            <th className="py-2 px-4 border-b">Unit Price</th>
            <th className="py-2 px-4 border-b">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td className="py-2 px-4 border-b">{item.part_number}</td>
              <td className="py-2 px-4 border-b">{item.description}</td>
              <td className="py-2 px-4 border-b">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleInputChange(item.id, 'quantity', e.target.value)}
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="py-2 px-4 border-b">
                <input
                  type="number"
                  value={item.unit_price}
                  onChange={(e) => handleInputChange(item.id, 'unit_price', e.target.value)}
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="py-2 px-4 border-b">
                {(item.quantity * item.unit_price).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default LineItemsTable;
