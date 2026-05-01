import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type UIState = {
  entered: boolean
  setEntered: (v: boolean) => void
  selectedStoreId?: string
  setStore: (id?: string) => void
  guestName: string
  setGuestName: (n: string) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      entered: false,
      setEntered: (v) => set({ entered: v }),
      selectedStoreId: undefined,
      setStore: (id) => set({ selectedStoreId: id }),
      guestName: 'Guest',
      setGuestName: (n) => set({ guestName: n || 'Guest' })
    }),
    { name: 'ansible-ui' }
  )
)
