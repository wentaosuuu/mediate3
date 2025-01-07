import { createContext, useContext, useState } from "react"
import { cn } from "@/lib/utils"

const SidebarContext = createContext<{
  isOpen: boolean
  toggle: () => void
}>({
  isOpen: false,
  toggle: () => {},
})

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen((prev) => !prev)

  return (
    <SidebarContext.Provider value={{ isOpen, toggle }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => {
  return useContext(SidebarContext)
}
