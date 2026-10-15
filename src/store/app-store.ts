import { create } from 'zustand'
import { BaseDirectory, exists, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs'
import { open } from '@tauri-apps/plugin-dialog'

const STORE_FILE_NAME = 'appStore.json'

export type TFolder = {
  id: number
  name: string
  link: string
}
type AppStore = {
  inited: boolean
  volume: number
  localFolders: string[]
  localFolderList?: TFolder[]
}
const defualtValues: AppStore = {
  inited: false,
  volume: 0.75,
  localFolders: []
}
export const useAppStore = create<AppStore>(() => defualtValues)
useAppStore.subscribe((state, prevState) => {
  if (state.localFolders !== prevState.localFolders) {
    const localFolderList = state.localFolders.map((folder, index) => {
      const name = folder.split('/').pop() ?? ''
      return {
        id: index,
        name,
        link: folder
      }
    })
    useAppStore.setState({ localFolderList })
  }
  if (JSON.stringify(state) !== JSON.stringify(prevState)) {
    writeTextFile(STORE_FILE_NAME, JSON.stringify({ ...state, localFolderList: undefined }), {
      baseDir: BaseDirectory.Resource
    })
  }
})

async function folderExists(path: string): Promise<boolean> {
  try {
    return await exists(path)
  } catch {
    return false
  }
}
async function checkLocalFolders() {
  const localFolders = useAppStore.getState().localFolders

  const existsFolders = (
    await Promise.all(
      localFolders.map(async folder => {
        return {
          folder,
          isExists: await folderExists(folder)
        }
      })
    )
  )
    .filter(f => f.isExists)
    .map(el => el.folder)

  useAppStore.setState({ localFolders: existsFolders })
}

;(async function () {
  const appStoreJsonExists = await exists(STORE_FILE_NAME, { baseDir: BaseDirectory.Resource })
  if (appStoreJsonExists) {
    const appStoreJson = await readTextFile(STORE_FILE_NAME, { baseDir: BaseDirectory.Resource })
    useAppStore.setState(JSON.parse(appStoreJson))
  } else {
    writeTextFile(STORE_FILE_NAME, JSON.stringify(defualtValues), { baseDir: BaseDirectory.Resource })
  }
  await checkLocalFolders()
  useAppStore.setState({ inited: true })
})()

export async function importLocalFolder() {
  const folderLink = await open({
    multiple: false,
    directory: true
  })
  if (!folderLink) return
  const localFolders = useAppStore.getState().localFolders
  if (localFolders.some(folder => folder === folderLink)) return
  useAppStore.setState({
    localFolders: [...localFolders, folderLink.replace(/\\/g, '/')]
  })
  return localFolders.length
}
