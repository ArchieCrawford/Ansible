import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import AddItemModal from './components/AddItemModal'
import ItemDetail from './components/ItemDetail'

export default function App() {
  const [items, setItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [showModal, setShowModal] = useState(false)

  async function loadItems() {
    const { data } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false })
    setItems(data || [])
  }

  useEffect(() => {
    loadItems()
  }, [])

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Asset Tracker</h1>
      <button onClick={() => setShowModal(true)}>+ Add Item</button>
      <div style={{ marginTop: 20 }}>
        {items.map(item => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            style={{
              padding: 12,
              border: '1px solid #ddd',
              marginBottom: 10,
              cursor: 'pointer'
            }}
          >
            <strong>{item.item_name}</strong>
            <div>{item.location}</div>
          </div>
        ))}
      </div>
      {showModal && (
        <AddItemModal
          onClose={() => setShowModal(false)}
          onCreated={loadItems}
        />
      )}
      {selectedItem && (
        <ItemDetail
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  )
}
