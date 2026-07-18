import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Layout } from '@/components/layout/Layout'
import { useListTours } from '@workspace/api-client-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X, ChevronLeft, ChevronRight, Camera, MapPin } from 'lucide-react'
import { getListToursQueryKey } from '@workspace/api-client-react'

interface GalleryImage {
  url: string
  tourTitle: string
  destination: string
}

// Build a flat gallery from all tours' gallery_urls
function useGalleryImages() {
  const { data: tours = [], isLoading } = useListTours(
    {},
    { query: { queryKey: getListToursQueryKey({}) } }
  )
  const images: GalleryImage[] = []
  tours.forEach(t => {
    t.gallery_urls?.forEach(url => {
      images.push({ url, tourTitle: t.title, destination: t.destination })
    })
  })
  return { images, isLoading }
}

export default function Gallery() {
  const { images, isLoading } = useGalleryImages()
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  const closeLightbox = () => setLightboxIdx(null)
  const prev = () => setLightboxIdx(i => (i != null ? (i - 1 + images.length) % images.length : null))
  const next = () => setLightboxIdx(i => (i != null ? (i + 1) % images.length : null))

  return (
    <Layout>
      {/* Header */}
      <div className="pt-28 pb-14 bg-card border-b">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-widest mb-4">
              <Camera size={14} />
              Photo Gallery
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 leading-tight">
              Africa Through Our Lens
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              A visual journey through Kenya's most breathtaking landscapes,
              wildlife, and cultural moments captured on our tours.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Masonry-style grid */}
      <div className="py-16 container mx-auto px-4 md:px-6">
        {isLoading ? (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                style={{ aspectRatio: i % 3 === 0 ? '3/4' : i % 3 === 1 ? '4/3' : '1' }}
                className="bg-muted rounded-xl animate-pulse w-full break-inside-avoid mb-4"
              />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <Camera className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg">No photos yet. Add tours with gallery images to populate this page.</p>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
            {images.map((img, i) => (
              <motion.button
                key={`${img.url}-${i}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.6) }}
                className="relative w-full mb-4 rounded-xl overflow-hidden group cursor-pointer block break-inside-avoid"
                onClick={() => setLightboxIdx(i)}
              >
                <img
                  src={img.url}
                  alt={`${img.tourTitle} — ${img.destination}`}
                  loading="lazy"
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end p-3 opacity-0 group-hover:opacity-100">
                  <div className="text-white">
                    <p className="text-xs font-medium flex items-center gap-1">
                      <MapPin size={10} /> {img.destination}
                    </p>
                    <p className="text-[11px] text-white/75 line-clamp-1 mt-0.5">{img.tourTitle}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxIdx !== null} onOpenChange={open => !open && closeLightbox()}>
        <DialogContent className="max-w-5xl p-0 bg-black border-black gap-0 overflow-hidden">
          <DialogTitle className="sr-only">
            {lightboxIdx !== null ? images[lightboxIdx]?.tourTitle : 'Photo'}
          </DialogTitle>

          {lightboxIdx !== null && (
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.img
                  key={lightboxIdx}
                  src={images[lightboxIdx].url}
                  alt={images[lightboxIdx].tourTitle}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="w-full max-h-[80vh] object-contain"
                />
              </AnimatePresence>

              {/* Controls */}
              <button
                onClick={closeLightbox}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-sm transition"
              >
                <X size={18} />
              </button>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-sm transition"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-sm transition"
              >
                <ChevronRight size={20} />
              </button>

              {/* Caption */}
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                <p className="font-semibold text-sm">{images[lightboxIdx].tourTitle}</p>
                <p className="text-xs text-white/65 flex items-center gap-1 mt-0.5">
                  <MapPin size={10} /> {images[lightboxIdx].destination}
                </p>
                <p className="text-xs text-white/40 mt-1">
                  {lightboxIdx + 1} / {images.length}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  )
}
