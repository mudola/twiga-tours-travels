import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'

interface UIState {
  bookingOpen: boolean
  bookingTourId?: string
  bookingTourTitle?: string
  inquiryOpen: boolean
  quickViewSlug?: string
}

interface UIContextValue extends UIState {
  openBooking: (tourId?: string, tourTitle?: string) => void
  closeBooking: () => void
  openInquiry: () => void
  closeInquiry: () => void
  openQuickView: (slug: string) => void
  closeQuickView: () => void
}

const UIContext = createContext<UIContextValue | null>(null)

export function UIProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UIState>({
    bookingOpen: false,
    inquiryOpen: false,
  })

  const openBooking = useCallback((tourId?: string, tourTitle?: string) => {
    setState(s => ({ ...s, bookingOpen: true, bookingTourId: tourId, bookingTourTitle: tourTitle }))
  }, [])

  const closeBooking = useCallback(() => {
    setState(s => ({ ...s, bookingOpen: false, bookingTourId: undefined, bookingTourTitle: undefined }))
  }, [])

  const openInquiry = useCallback(() => {
    setState(s => ({ ...s, inquiryOpen: true }))
  }, [])

  const closeInquiry = useCallback(() => {
    setState(s => ({ ...s, inquiryOpen: false }))
  }, [])

  const openQuickView = useCallback((slug: string) => {
    setState(s => ({ ...s, quickViewSlug: slug }))
  }, [])

  const closeQuickView = useCallback(() => {
    setState(s => ({ ...s, quickViewSlug: undefined }))
  }, [])

  return (
    <UIContext.Provider
      value={{ ...state, openBooking, closeBooking, openInquiry, closeInquiry, openQuickView, closeQuickView }}
    >
      {children}
    </UIContext.Provider>
  )
}

export function useUI() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used within UIProvider')
  return ctx
}
