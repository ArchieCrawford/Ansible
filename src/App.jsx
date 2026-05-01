import { useState } from 'react'
import { SplashScreen } from './components/SplashScreen'
import AddItemModal from './components/AddItemModal'
import ItemDetail from './components/ItemDetail'
import { Button } from './components/ui/Button'
import { Card } from './components/ui/Card'
import { useItems } from './lib/hooks/useItems'

export default function App() {
  const [entered, setEntered] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const { data: items = [], isLoading, isError, error } = useItems()

  if (!entered) {
    return <SplashScreen onEnter={() => setEntered(true)} />
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Asset Tracker
        </h1>
        <Button onClick={() => setShowModal(true)}>+ Add Item</Button>
      </div>

      <div className="mt-8 space-y-3">
        {isLoading && (
          <>
            <div className="h-20 animate-pulse rounded-2xl bg-muted" />
            <div className="h-20 animate-pulse rounded-2xl bg-muted" />
            <div className="h-20 animate-pulse rounded-2xl bg-muted" />
          </>
        )}

        {isError && (
          <Card className="border-red-200 bg-red-50 text-red-700">
            Failed to load items: {error.message}
          </Card>
        )}

        {!isLoading && !isError && items.length === 0 && (
          <Card className="text-center text-muted-foreground">
            No items yet. Click <strong>+ Add Item</strong> to get started.
          </Card>
        )}

        {items.map(item => (
          <Card
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="cursor-pointer transition-shadow hover:shadow-md"
          >
            <div className="font-medium">{item.item_name}</div>
            {item.location && (
              <div className="mt-1 text-sm text-muted-foreground">
                {item.location}
              </div>
            )}
          </Card>
        ))}
      </div>

      <AddItemModal
        open={showModal}
        onClose={() => setShowModal(false)}
      />
      <ItemDetail
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  )
}
