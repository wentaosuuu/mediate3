import { createContext, useContext, useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"

type SidebarState = "expanded" | "collapsed"

interface SidebarContextType {
  isOpen: boolean
  toggle: () => void
  isMobile: boolean
  state: SidebarState
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
}

const SidebarContext = createContext<SidebarContextType>({
  isOpen: false,
  toggle: () => {},
  isMobile: false,
  state: "expanded",
  openMobile: false,
  setOpenMobile: () => {},
})

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true)
  const [openMobile, setOpenMobile] = useState(false)
  const isMobile = useIsMobile()
  const state: SidebarState = isOpen ? "expanded" : "collapsed"

  const toggle = () => setIsOpen((prev) => !prev)

  return (
    <SidebarContext.Provider 
      value={{ 
        isOpen, 
        toggle, 
        isMobile, 
        state, 
        openMobile, 
        setOpenMobile 
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => {
  return useContext(SidebarContext)
}