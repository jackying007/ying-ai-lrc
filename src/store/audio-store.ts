import { create } from 'zustand'
import { readFile, readTextFile } from '@tauri-apps/plugin-fs'

import { useAppStore } from './app-store'

export enum ShowMode {
  Hide,
  Bottom,
  Fullscreen
}

export enum PlayState {
  None,
  Playing,
  Paused,
  Ended
}

export type AudioInfo = {
  name: string
  fullName: string
  link: string
  lrcLink: string
  atime: string
  birthtime: string
  size: string
  type: string
}

export const acceptAudioSuffixs = ['.mp3']

type AudioStore = {
  showMode: ShowMode
  playState: PlayState
  currentAudioInfo?: AudioInfo
  currentLrc?: string
  duration?: number
  currentTime?: number
  audioList: AudioInfo[]
}

export const useAudioStore = create<AudioStore>(() => ({
  showMode: ShowMode.Hide,
  playState: PlayState.None,
  audioList: []
}))

export const usePlayerOpen = () => {
  const showMode = useAudioStore(state => state.showMode)
  return showMode !== ShowMode.Hide
}

const audio = new Audio()

type CachedData = {
  objectUrl: string
  lrc?: string
}
const cachedMap = new Map<string, CachedData>()
function clearCachedObjectUrl() {
  for (const [link, { objectUrl }] of cachedMap.entries()) {
    if (objectUrl !== audio.currentSrc) {
      cachedMap.delete(link)
      URL.revokeObjectURL(objectUrl)
    }
  }
}
setInterval(clearCachedObjectUrl, 1000 * 60 * 10)

export const pauseAudio = () => {
  if (!audio.paused) audio.pause()
}

async function readLrc(lrcLink: string) {
  try {
    return await readTextFile(lrcLink)
  } catch {
    return
  }
}
export const playAudio = async (audioInfo: AudioInfo) => {
  pauseAudio()
  const cachedData = cachedMap.get(audioInfo.link)
  let objectUrl = cachedData?.objectUrl
  let lrc = cachedData?.lrc

  if (!objectUrl || !lrc) {
    const audioFile = await readFile(audioInfo.link)
    const blob = new Blob([audioFile], { type: audioInfo.type })
    objectUrl = URL.createObjectURL(blob)
    lrc = await readLrc(audioInfo.lrcLink)
    cachedMap.set(audioInfo.link, { objectUrl, lrc })
  }

  audio.src = objectUrl
  audio.volume = useAppStore.getState().volume
  audio.play()

  useAudioStore.setState({
    showMode: ShowMode.Bottom,
    currentAudioInfo: audioInfo,
    currentLrc: lrc
  })
}

export const replayAudio = async () => {
  if (audio.paused) {
    if (audio.ended) {
      const audioInfo = useAudioStore.getState().currentAudioInfo
      if (audioInfo) playAudio(audioInfo)
    }
    audio.play()
  }
}

export const togglePauseOrPlay = () => {
  if (audio.paused || audio.ended) replayAudio()
  else pauseAudio()
}

export function playPrevAudio() {
  const { currentAudioInfo, audioList } = useAudioStore.getState()
  if (!currentAudioInfo) {
    playAudio(audioList[audioList.length - 1])
    return
  }
  const index = audioList.findIndex(el => el.link === currentAudioInfo.link)
  if (index === -1) return
  if (index - 1 < 0) {
    playAudio(audioList[audioList.length - 1])
  } else {
    playAudio(audioList[index - 1])
  }
}

export function playNextAudio() {
  const { currentAudioInfo, audioList } = useAudioStore.getState()
  if (!currentAudioInfo) {
    playAudio(audioList[0])
    return
  }
  const index = audioList.findIndex(el => el.link === currentAudioInfo.link)
  if (index === -1) return
  if (index + 1 >= audioList.length) {
    playAudio(audioList[0])
  } else {
    playAudio(audioList[index + 1])
  }
}

export const setCurrentTime = (currentTime: number) => {
  audio.currentTime = currentTime
}

export const setVolume = (volume: number) => {
  audio.volume = volume
}

audio.addEventListener('volumechange', () => {
  useAppStore.setState({
    volume: audio.volume
  })
})
audio.addEventListener('pause', () => {
  useAudioStore.setState({
    playState: PlayState.Paused
  })
})
audio.addEventListener('playing', () => {
  useAudioStore.setState({
    playState: PlayState.Playing
  })
})
audio.addEventListener('ended', () => {
  useAudioStore.setState({
    playState: PlayState.Ended
  })
  playNextAudio()
})
audio.addEventListener('durationchange', () => {
  useAudioStore.setState({
    duration: audio.duration
  })
})
audio.addEventListener('timeupdate', () => {
  useAudioStore.setState({
    currentTime: audio.currentTime
  })
})
