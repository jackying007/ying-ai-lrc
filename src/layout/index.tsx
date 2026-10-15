import { Outlet } from 'react-router'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { usePlayerOpen } from '@/store/audio-store'
import { AppSidebar } from './sidebar'
import { AppHeader } from './header'
import { AudioPlayer } from './audio-player'

export function AppLayout() {
  const playerOpen = usePlayerOpen()

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="h-svh">
          <AppHeader />
          <Separator />
          <main className="flex-1 h-0 overflow-auto">
            <Outlet />
          </main>
          {playerOpen && <div className="h-20 " />}
        </SidebarInset>
        <AudioPlayer />
      </SidebarProvider>
    </TooltipProvider>
  )
}
