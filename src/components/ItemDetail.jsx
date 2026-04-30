import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

export default function ItemDetail({ item, onClose }) {
  const [records, setRecords] = useState([])
  const [desc, setDesc] = useState('')
  const [date, setDate] = useState('')

  async function loadRecords() {
    const { data } = await supabase
      .from('maintenance_records')
      .select('*')
      .eq('item_id', item.id)
      .order('date', { ascending: false })
    setRecords(data || [])
  }

  async function addRecord() {
    await supabase.from('maintenance_records').insert([{
      item_id: item.id,
      description: desc,
      date
    }])
    setDesc('')
    setDate('')
    loadRecords()
  }

  useEffect(() => {
    loadRecords()
  }, [])

  return (
    <div style={overlay}>
      <div style={modal}>
        <h2>{item.item_name}</h2>
        <p>{item.location}</p>
        <h3>Maintenance</h3>
        {records.map(r => (
          <div key={r.id}>
            {r.date} - {r.description}
          </div>
        ))}
        <input
          placeholder="Description"
          value={desc}
          onChange={e => setDesc(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        <button onClick={addRecord}>Add</button>
        <button onClick={onClose}>Close</button>
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
  width: 400,
  margin: '100px auto'
}
