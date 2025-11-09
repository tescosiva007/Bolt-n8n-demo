import { useState, useEffect, FormEvent } from 'react';
import { supabase, Store } from '../lib/supabase';
import { X, Store as StoreIcon } from 'lucide-react';

interface CreateMessageProps {
  onCancel: () => void;
  onSuccess: () => void;
}

type StoreSelectionMode = 'none' | 'manual' | 'choose' | 'all';

export default function CreateMessage({ onCancel, onSuccess }: CreateMessageProps) {
  const [subject, setSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [selectionMode, setSelectionMode] = useState<StoreSelectionMode>('none');
  const [manualStores, setManualStores] = useState('');
  const [availableStores, setAvailableStores] = useState<Store[]>([]);
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showStoreList, setShowStoreList] = useState(false);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('status', 'Active')
        .order('name');

      if (error) throw error;
      setAvailableStores(data || []);
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  const handleModeChange = (mode: StoreSelectionMode) => {
    setSelectionMode(mode);
    setSelectedStores([]);
    setManualStores('');

    if (mode === 'all') {
      setSelectedStores(availableStores.map(store => store.code));
    } else if (mode === 'choose') {
      setShowStoreList(true);
    }
  };

  const handleStoreToggle = (storeCode: string) => {
    setSelectedStores(prev =>
      prev.includes(storeCode)
        ? prev.filter(code => code !== storeCode)
        : [...prev, storeCode]
    );
  };

  const handleManualStoresSubmit = () => {
    const codes = manualStores
      .split(',')
      .map(code => code.trim())
      .filter(code => code.length > 0);
    setSelectedStores(codes);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!subject.trim() || !messageBody.trim()) {
      alert('Please fill in all fields');
      return;
    }

    if (selectedStores.length === 0) {
      alert('Please select at least one store');
      return;
    }

    setLoading(true);

    try {
      const session = localStorage.getItem('demo_user_session');
      if (!session) throw new Error('Not authenticated');

      const { userId } = JSON.parse(session);

      const { error } = await supabase.from('messages').insert([
        {
          title: subject,
          body: messageBody,
          list_of_stores: selectedStores,
          user_id: userId,
        },
      ]);

      if (error) throw error;

      onSuccess();
    } catch (error) {
      console.error('Error creating message:', error);
      alert('Failed to create message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Message</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Enter message subject"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              id="message"
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Enter your message here..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Store Selection
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleModeChange('manual')}
                className={`flex items-center justify-center gap-2 px-6 py-4 border-2 rounded-lg transition-all ${
                  selectionMode === 'manual'
                    ? 'border-blue-900 bg-blue-900 text-white'
                    : 'border-blue-900 text-blue-900 hover:bg-blue-50'
                }`}
              >
                <StoreIcon className="w-6 h-6" />
                <span className="font-semibold">Enter list of stores</span>
              </button>

              <button
                type="button"
                onClick={() => handleModeChange('choose')}
                className={`flex items-center justify-center gap-2 px-6 py-4 border-2 rounded-lg transition-all ${
                  selectionMode === 'choose'
                    ? 'border-blue-900 bg-blue-900 text-white'
                    : 'border-blue-900 text-blue-900 hover:bg-blue-50'
                }`}
              >
                <StoreIcon className="w-6 h-6" />
                <span className="font-semibold">Choose stores from list</span>
              </button>

              <button
                type="button"
                onClick={() => handleModeChange('all')}
                className={`flex items-center justify-center gap-2 px-6 py-4 border-2 rounded-lg transition-all ${
                  selectionMode === 'all'
                    ? 'border-blue-900 bg-blue-900 text-white'
                    : 'border-blue-900 text-blue-900 hover:bg-blue-50'
                }`}
              >
                <StoreIcon className="w-6 h-6" />
                <span className="font-semibold">Send to all stores</span>
              </button>

              <button
                type="button"
                onClick={onCancel}
                className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-all"
              >
                <X className="w-6 h-6" />
                <span className="font-semibold">Cancel action</span>
              </button>
            </div>
          </div>

          {selectionMode === 'manual' && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <label htmlFor="manualStores" className="block text-sm font-medium text-gray-700 mb-2">
                Enter Store Codes (comma-separated)
              </label>
              <input
                id="manualStores"
                type="text"
                value={manualStores}
                onChange={(e) => setManualStores(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-3"
                placeholder="ST001, ST002, ST003"
              />
              <button
                type="button"
                onClick={handleManualStoresSubmit}
                className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
              >
                Apply
              </button>
            </div>
          )}

          {selectedStores.length > 0 && (
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Selected Stores ({selectedStores.length})
              </h3>
              <div className="bg-white p-4 rounded border border-blue-200 max-h-32 overflow-y-auto">
                <p className="text-gray-900">{selectedStores.join(', ')}</p>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || selectedStores.length === 0}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {showStoreList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Select Stores</h2>
              <button
                onClick={() => setShowStoreList(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              {availableStores.map((store) => (
                <label
                  key={store.id}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedStores.includes(store.code)}
                    onChange={() => handleStoreToggle(store.code)}
                    className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{store.name}</div>
                    <div className="text-sm text-gray-500">
                      {store.code} - {store.area}
                    </div>
                  </div>
                </label>
              ))}
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowStoreList(false)}
                className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                Done ({selectedStores.length} selected)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
