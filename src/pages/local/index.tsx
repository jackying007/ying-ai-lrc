import { Navigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { PageLoading } from '@/components/page-loading'
import { useAppStore, importLocalFolder } from '@/store/app-store'

export default function () {
  const inited = useAppStore(state => state.inited)
  const localFolderList = useAppStore(state => state.localFolderList)

  if (!inited) return <PageLoading />
  if (localFolderList?.length) return <Navigate to={`/local/${localFolderList[0].id}`} replace />
  return (
    <div className="p-2 h-full flex flex-col justify-center items-center">
      <p className="mb-4 text-md">暂无已导入的文件夹</p>
      <Button variant="default" onClick={importLocalFolder}>
        导入
      </Button>
    </div>
  )
}
