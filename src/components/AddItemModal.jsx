import { useState } from 'react'
import { supabase } from '../supabase'

export default function AddItemModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    item_name: '',
    purchase_date: '',
    serial_number: '',
    location: ''
  })

  async function handleSubmit() {
    await supabase.from('items').insert([form])
    onCreated()
    onClose()
  }

  return (
    <div style={overlay}>
      <div style={modal}>
        <h2>Add Item</h2>
        <input
          placeholder="Name"
          onChange={e => setForm({ ...form, item_name: e.target.value })}
        />
        <input
          type="date"
          onChange={e => setForm({ ...form, purchase_date: e.target.value })}
        />
        <input
          placeholder="Serial"
          onChange={e => setForm({ ...form, serial_number: e.target.value })}
        />
        <input
          placeholder="Location"
          onChange={e => setForm({ ...form, location: e.target.value })}
        />
        <button onClick={handleSubmit}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  )
}

const overlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0,0,0,0.4)'
}

const modal = {
  background: '#fff',
  padding: 20,
  width: 300,
  margin: '100px auto'
}
