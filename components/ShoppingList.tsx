import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { fetchItems, addItem, deleteItem, toggleItem } from '../store/shoppingSlice';
import { AppDispatch } from '../store';

export default function ShoppingList() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((state: RootState) => state.shopping);
  const [newItemName, setNewItemName] = useState('');

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim()) {
      await dispatch(addItem(newItemName.trim()));
      setNewItemName('');
    }
  };

  const handleToggleItem = async (id: string, completed: boolean) => {
    await dispatch(toggleItem({ id, completed: !completed }));
  };

  const handleDeleteItem = async (id: string) => {
    await dispatch(deleteItem(id));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Shopping List</h2>
      
      <form onSubmit={handleAddItem} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Add new item..."
            className="flex-1 p-2 border rounded"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </form>

      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between p-2 border rounded"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => handleToggleItem(item.id, item.completed)}
                className="h-4 w-4"
              />
              <span className={item.completed ? 'line-through text-gray-500' : ''}>
                {item.name}
              </span>
            </div>
            <button
              onClick={() => handleDeleteItem(item.id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
} 