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
import { useAppStore, importLocalFolder } from '@/store/app-store'
import { usePlayerOpen } from '@/store/audio-store'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const localFolderList = useAppStore(state => state.localFolderList)
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
                    <span>本地</span>
                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <SidebarMenuAction onClick={importLocalFolder}>
                  <Plus />
                </SidebarMenuAction>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {localFolderList?.map(el => (
                      <SidebarMenuSubItem key={el.id} onClick={() => navigate(`/local/${el.id}`)}>
                        <SidebarMenuSubButton className="cursor-pointer" isActive={`/local/${el.id}` === pathname}>
                          {el.name}
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                    {!localFolderList?.length && <p className="text-sm">暂无导入</p>}
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
