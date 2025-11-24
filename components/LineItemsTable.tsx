"use client";

import { useState } from 'react';
import { updateQuoteLineItems } from '@/app/actions/update-quote';

type LineItem = {
  id: number;
  part_number: string;
  description: string;
  quantity: number;
  unit_price: number;
};

type LineItemsTableProps = {
  initialItems: LineItem[];
  quoteId: string;
  initialTax: number;
};

const LineItemsTable = ({ initialItems, quoteId, initialTax }: LineItemsTableProps) => {
  const [items, setItems] = useState<LineItem[]>(() => {
    if (initialItems && initialItems.length > 0) {
      return initialItems;
    }
    return [];
  });
  const [tax, setTax] = useState<number>(initialTax || 0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success'>('idle');

  const addNewItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
    setItems([...items, { id: newId, part_number: '', description: '', quantity: 1, unit_price: 0 }]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };


  const handleInputChange = (id: number, field: keyof LineItem, value: string) => {
    const newItems = items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: field === 'quantity' || field === 'unit_price' ? Number(value) : value };
      }
      return item;
    });
    setItems(newItems);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    try {
      await updateQuoteLineItems(quoteId, items, tax);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error(error);
      alert('Error saving changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const subtotal = items.reduce((acc, item) => acc + item.quantity * item.unit_price, 0);
  const grandTotal = subtotal + tax;

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
            <th className="py-2 px-4 border-b text-slate-500"></th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-4 text-center text-slate-500">
                No items found. Add one manually.
              </td>
            </tr>
          ) : (
            items.map(item => (
            <tr key={item.id} className="border-b border-slate-200">
              <td className="py-2 px-4 text-slate-900">
                <input
                  type="text"
                  value={item.part_number}
                  onChange={(e) => handleInputChange(item.id, 'part_number', e.target.value)}
                  className="w-full px-2 py-1 bg-white border border-gray-300 rounded text-slate-900"
                  placeholder="Part #"
                />
              </td>
              <td className="py-2 px-4 text-slate-900">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleInputChange(item.id, 'description', e.target.value)}
                  className="w-full px-2 py-1 bg-white border border-gray-300 rounded text-slate-900"
                  placeholder="Description"
                />
              </td>
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
              <td className="py-2 px-4 text-center">
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700 disabled:opacity-30"
                  disabled={items.length <= 1}
                >
                  ✕
                </button>
              </td>
            </tr>
            ))
          )}
        </tbody>
      </table>
       <div className="mt-4 flex justify-end">
        <div className="w-1/3">
          <div className="flex justify-between py-1">
            <span className="text-slate-500">Subtotal</span>
            <span className="text-slate-900">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1 items-center">
            <span className="text-slate-500">Tax</span>
            <input
              type="number"
              value={tax}
              onChange={(e) => setTax(Number(e.target.value))}
              className="w-1/2 px-2 py-1 bg-white border border-gray-300 rounded text-right text-slate-900"
            />
          </div>
          <div className="flex justify-between py-1 font-bold">
            <span className="text-slate-900">Grand Total</span>
            <span className="text-slate-900">${grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={addNewItem}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          + Add Item
        </button>
        <button
          onClick={handleSaveChanges}
          disabled={isSaving || saveStatus === 'success'}
          className={`font-bold py-2 px-4 rounded ${
            saveStatus === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-orange-500 hover:bg-orange-600 text-white'
          } disabled:opacity-50`}
        >
          {isSaving ? 'Saving...' : saveStatus === 'success' ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default LineItemsTable;
