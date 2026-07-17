import { useTheme } from "@/components/theme-provider"

export function useHeroImage() {
  const { theme } = useTheme()
  
  switch (theme) {
    case "safari-night":
      return "/src/assets/hero-night.jpg"
    case "coastal":
      return "/src/assets/hero-coastal.jpg"
    case "highlands":
      return "/src/assets/hero-highlands.jpg"
    case "savanna":
    default:
      return "/src/assets/hero-savanna.jpg"
  }
}
