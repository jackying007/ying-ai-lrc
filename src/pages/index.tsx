import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { useAppStore, importFolder } from '@/store/app-store'

export const Index = () => {
  const folderList = useAppStore(state => state.folderList)
  const navigate = useNavigate()

  useEffect(() => {
    if (folderList?.length) navigate(`/folder/${folderList[0].id}`)
  }, [folderList, navigate])

  return (
    <div className="p-2 h-full flex flex-col justify-center items-center">
      {!folderList?.length && <p className="mb-4 text-md">暂无已导入的文件夹</p>}
      <Button variant="default" onClick={importFolder}>
        导入
      </Button>
    </div>
  )
}
