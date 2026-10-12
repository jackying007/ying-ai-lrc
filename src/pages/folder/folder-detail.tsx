import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Play, Pause } from 'lucide-react'
import { type DirEntry, readDir, stat } from '@tauri-apps/plugin-fs'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/app-store'
import {
  type AudioInfo,
  acceptAudioSuffixs,
  useAudioStore,
  playAudio,
  togglePauseOrPlay,
  PlayState
} from '@/store/audio-store'
import { dayjs } from '@/lib/dayjs'

async function getAudioList(folderLink: string, folderFiles: DirEntry[]) {
  const list = await Promise.all(
    folderFiles.map<Promise<AudioInfo>>(async file => {
      const index = file.name.lastIndexOf('.')
      const [name, suffix] = [file.name.slice(0, index), file.name.slice(index + 1)]

      const link = `${folderLink}\\${file.name}`
      const lrcLink = `${folderLink}\\${name}.lrc`
      const fileStat = await stat(link)
      return {
        name,
        fullName: file.name,
        link,
        lrcLink,
        atime: dayjs(fileStat.atime).format('YYYY-MM-DD HH:mm:ss'),
        birthtime: dayjs(fileStat.birthtime).format('YYYY-MM-DD HH:mm:ss'),
        size: (fileStat.size / 1024 / 1024).toFixed(2) + 'MB',
        type: `audio/${suffix}`
      }
    })
  )
  return list
}

export const FolderDetail = () => {
  const params = useParams()
  const folderList = useAppStore(state => state.folderList)
  const [audioList, setAudioList] = useState<AudioInfo[]>([])
  const currentAudioInfo = useAudioStore(state => state.currentAudioInfo)
  const playState = useAudioStore(state => state.playState)

  useEffect(() => {
    ;(async function () {
      setAudioList([])
      if (!params.folderId) return
      const folderId = Number(params.folderId)
      const folder = folderList?.find(el => el.id === folderId)
      if (!folder) return
      const folderFiles = await readDir(folder.link)
      const list = await getAudioList(
        folder.link,
        folderFiles.filter(el => el.isFile && acceptAudioSuffixs.some(suffix => el.name.endsWith(suffix)))
      )
      setAudioList(list)
      useAudioStore.setState({ audioList: list })
    })()
  }, [params, folderList])

  return (
    <Table>
      {!audioList.length && <TableCaption>暂无音乐文件</TableCaption>}
      <TableHeader className="sticky top-0">
        <TableRow>
          <TableHead>名称</TableHead>
          <TableHead>大小</TableHead>
          <TableHead>创建时间</TableHead>
          <TableHead>操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {audioList.map(audio => (
          <TableRow key={audio.link}>
            <TableCell>{audio.name}</TableCell>
            <TableCell>{audio.size}</TableCell>
            <TableCell>{audio.birthtime}</TableCell>
            <TableCell>
              {currentAudioInfo?.link === audio.link ? (
                <Button variant="outline" size="icon" className="w-7 h-7" onClick={() => togglePauseOrPlay()}>
                  {playState === PlayState.Playing ? <Pause /> : <Play />}
                </Button>
              ) : (
                <Button variant="outline" size="icon" className="w-7 h-7" onClick={() => playAudio(audio)}>
                  <Play />
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
