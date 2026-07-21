import { useTheme } from "@/components/theme-provider"
import heroSavanna from "@/assets/hero-savanna.jpg"
import heroNight from "@/assets/hero-night.jpg"
import heroCoastal from "@/assets/hero-coastal.jpg"
import heroHighlands from "@/assets/hero-highlands.jpg"

export function useHeroImage() {
  const { theme } = useTheme()
  
  switch (theme) {
    case "safari-night":
      return heroNight
    case "coastal":
      return heroCoastal
    case "highlands":
      return heroHighlands
    case "savanna":
    default:
      return heroSavanna
  }
}
