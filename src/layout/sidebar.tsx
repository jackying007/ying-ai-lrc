import { useLocation, useNavigate } from 'react-router'
import { ChevronRight, Folder, Plus } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  // SidebarGroupLabel,
  // SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
  // SidebarFooter,
  // SidebarRail
} from '@/components/ui/sidebar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { useAppStore, importFolder } from '@/store/app-store'
import { usePlayerOpen } from '@/store/audio-store'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const folderList = useAppStore(state => state.folderList)
  const playerOpen = usePlayerOpen()

  return (
    <Sidebar {...props}>
      {/* <SidebarHeader>xx</SidebarHeader> */}
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>xx</SidebarGroupLabel> */}
          <SidebarMenu>
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton>
                    <Folder />
                    <span>音乐文件夹</span>
                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <SidebarMenuAction onClick={importFolder}>
                  <Plus />
                </SidebarMenuAction>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {folderList?.map(el => (
                      <SidebarMenuSubItem key={el.id} onClick={() => navigate(`/folder/${el.id}`)}>
                        <SidebarMenuSubButton className="cursor-pointer" isActive={`/folder/${el.id}` === pathname}>
                          {el.name}
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                    {!folderList?.length && <p className="text-sm">暂无文件夹</p>}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      {/* <SidebarFooter>xx</SidebarFooter>
      <SidebarRail /> */}
      {playerOpen && <div className="h-20" />}
    </Sidebar>
  )
}
