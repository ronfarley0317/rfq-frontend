"use client";

import { useState } from 'react';

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
  const [items, setItems] = useState<LineItem[]>(() => {
    if (initialItems && initialItems.length > 0) {
      return initialItems;
    }
    return [{ id: 1, part_number: 'XJ-900', description: 'Turbo Encabulator', quantity: 5, unit_price: 500 }];
  });

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
            <th className="py-2 px-4 border-b text-slate-500">Part #</th>
            <th className="py-2 px-4 border-b text-slate-500">Description</th>
            <th className="py-2 px-4 border-b text-slate-500">Qty</th>
            <th className="py-2 px-4 border-b text-slate-500">Unit Price</th>
            <th className="py-2 px-4 border-b text-slate-500">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} className="border-b border-slate-200">
              <td className="py-2 px-4 text-slate-900">{item.part_number}</td>
              <td className="py-2 px-4 text-slate-900">{item.description}</td>
              <td className="py-2 px-4 text-slate-900">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleInputChange(item.id, 'quantity', e.target.value)}
                  className="w-full px-2 py-1 bg-white border border-gray-300 rounded text-slate-900"
                />
              </td>
              <td className="py-2 px-4 text-right text-slate-900">
                $
                <input
                  type="number"
                  value={item.unit_price}
                  onChange={(e) => handleInputChange(item.id, 'unit_price', e.target.value)}
                  className="w-full px-2 py-1 bg-white border border-gray-300 rounded text-right text-slate-900 inline-block"
                />
              </td>
              <td className="py-2 px-4 text-right text-slate-900">
                ${(item.quantity * item.unit_price).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-end">
        <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default LineItemsTable;
