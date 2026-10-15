import { create } from 'zustand'
import { readDir, type DirEntry } from '@tauri-apps/plugin-fs'
import { type TFolder, useAppStore } from './app-store'
import { type AudioInfo, useAudioStore, acceptAudioSuffixs, playAudio } from './audio-store'

type LocalAudioStore = Record<string, AudioInfo[] | null>
export const useLocalAudioStore = create<LocalAudioStore>(() => ({}))

function getAudioList(folderLink: string, folderFiles: DirEntry[]) {
  return Promise.all(
    folderFiles.map<Promise<AudioInfo>>(async file => {
      const index = file.name.lastIndexOf('.')
      const [name, suffix] = [file.name.slice(0, index), file.name.slice(index + 1)]

      const link = `${folderLink}/${file.name}`
      const lrcLink = `${folderLink}/${name}.lrc`
      return {
        name,
        link,
        lrcLink,
        type: `audio/${suffix}`
      }
    })
  )
}

async function initLocalFolderAudio(folder: TFolder) {
  const folderFiles = await readDir(folder.link)
  const list = await getAudioList(
    folder.link,
    folderFiles.filter(el => el.isFile && acceptAudioSuffixs.some(suffix => el.name.endsWith(suffix)))
  )
  useLocalAudioStore.setState({
    [folder.id]: list
  })
}

useAppStore.subscribe((state, prevState) => {
  if (state.localFolderList !== prevState.localFolderList) {
    state.localFolderList?.forEach(folder => initLocalFolderAudio(folder))
  }
})

;(async function () {
  const localFolderList = useAppStore.getState().localFolderList
  localFolderList?.forEach(folder => initLocalFolderAudio(folder))
})()

export const playLocalAudio = async (audioInfo: AudioInfo, folderId: string) => {
  await playAudio(audioInfo)
  const audioList = useLocalAudioStore.getState()[folderId]
  if (!audioList) return
  useAudioStore.setState({ audioList })
}
