import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { useAppStore, importLocalFolder } from '@/store/app-store'

export default function () {
  const localFolderList = useAppStore(state => state.localFolderList)
  const navigate = useNavigate()

  useEffect(() => {
    if (localFolderList?.length) navigate(`/local/${localFolderList[0].id}`)
  }, [localFolderList, navigate])

  return (
    <div className="p-2 h-full flex flex-col justify-center items-center">
      {!localFolderList?.length && <p className="mb-4 text-md">暂无已导入的文件夹</p>}
      <Button variant="default" onClick={importLocalFolder}>
        导入
      </Button>
    </div>
  )
}
