import { create } from 'zustand'
import { BaseDirectory, exists, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs'
import { open } from '@tauri-apps/plugin-dialog'

const FILE_NAME = 'appStore.json'

type TFolder = {
  id: number
  name: string
  link: string
}
type AppStore = {
  folders: string[]
  volume: number
  folderList?: TFolder[]
}
const defualtValues: AppStore = {
  folders: [],
  volume: 0.75
}
export const useAppStore = create<AppStore>(() => defualtValues)
useAppStore.subscribe((state, prevState) => {
  if (state.folders !== prevState.folders) {
    const folderList = state.folders.map((folder, index) => {
      const name = folder.split('\\').pop() ?? ''
      return {
        id: index,
        name,
        link: folder
      }
    })
    useAppStore.setState({ folderList })
  }
  if (JSON.stringify(state) !== JSON.stringify(prevState)) {
    writeTextFile(FILE_NAME, JSON.stringify({ ...state, folderList: undefined }), { baseDir: BaseDirectory.Resource })
  }
})

async function folderExists(path: string): Promise<boolean> {
  try {
    return await exists(path)
  } catch {
    return false
  }
}
async function checkFolders() {
  const folders = useAppStore.getState().folders

  const existsFolders = (
    await Promise.all(
      folders.map(async folder => {
        return {
          folder,
          isExists: await folderExists(folder)
        }
      })
    )
  )
    .filter(f => f.isExists)
    .map(el => el.folder)

  useAppStore.setState({ folders: existsFolders })
}
let inited = false
async function initAppConfig() {
  if (!inited) {
    const appStoreJsonExists = await exists(FILE_NAME, { baseDir: BaseDirectory.Resource })
    if (appStoreJsonExists) {
      const appStoreJson = await readTextFile(FILE_NAME, { baseDir: BaseDirectory.Resource })
      useAppStore.setState(JSON.parse(appStoreJson))
    } else {
      writeTextFile(FILE_NAME, JSON.stringify(defualtValues), { baseDir: BaseDirectory.Resource })
    }
    await checkFolders()
    inited = true
  }
}
await initAppConfig()

export async function importFolder() {
  const folderLink = await open({
    multiple: false,
    directory: true
  })
  if (!folderLink) return
  const folders = useAppStore.getState().folders
  if (folders.some(folder => folder === folderLink)) return
  useAppStore.setState({
    folders: [...folders, folderLink]
  })
  await checkFolders()
}
