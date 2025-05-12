
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "group-[.toaster]:bg-green-50 group-[.toaster]:border-green-400 group-[.toaster]:text-green-900",
          error: "group-[.toaster]:bg-red-50 group-[.toaster]:border-red-400 group-[.toaster]:text-red-900",
          info: "group-[.toaster]:bg-blue-50 group-[.toaster]:border-blue-400 group-[.toaster]:text-blue-900",
          warning: "group-[.toaster]:bg-amber-50 group-[.toaster]:border-amber-400 group-[.toaster]:text-amber-900",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
