import { useTheme } from "@/components/theme-provider"
import { Map, Moon, Sun, Trees } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  const themes = [
    { id: "savanna", label: "Savanna", icon: Sun, color: "bg-[#D97755]" },
    { id: "safari-night", label: "Safari Night", icon: Moon, color: "bg-[#E6A84F]" },
    { id: "coastal", label: "Coastal", icon: Map, color: "bg-[#4E878C]" },
    { id: "highlands", label: "Highlands", icon: Trees, color: "bg-[#4A6349]" },
  ] as const

  return (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-full">
      {themes.map((t) => {
        const Icon = t.icon
        const isActive = theme === t.id

        return (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={cn(
              "relative flex items-center justify-center w-8 h-8 rounded-full transition-colors",
              isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
            title={t.label}
            aria-label={`Switch to ${t.label} theme`}
          >
            {isActive && (
              <motion.div
                layoutId="theme-active"
                className="absolute inset-0 bg-primary rounded-full shadow-sm"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <Icon className="w-4 h-4 relative z-10" />
          </button>
        )
      })}
    </div>
  )
}
