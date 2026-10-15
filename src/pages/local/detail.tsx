import { useParams } from 'react-router'
import { AudioLines, Ellipsis } from 'lucide-react'
import { cn } from 'cn'
import { PageLoading } from '@/components/page-loading'
import { Button } from '@/components/ui/button'
import { useAudioStore, PlayState } from '@/store/audio-store'
import { playLocalAudio, useLocalAudioStore } from '@/store/local-audio-store'

export default function () {
  const params = useParams()

  const currentAudioInfo = useAudioStore(state => state.currentAudioInfo)
  const playState = useAudioStore(state => state.playState)

  const audioList = useLocalAudioStore(state => state[params.folderId ?? ''])

  if (!audioList) return <PageLoading />
  return (
    <div>
      {!audioList.length && <div className="fc h-20 text-gray-600">暂无音乐文件</div>}
      {audioList.map((audio, index) => {
        const isActive = currentAudioInfo?.link === audio.link
        return (
          <div key={audio.link} className="flex justify-between border-b border-b-border p-2 pl-0 text-sm">
            <div className="flex items-center">
              <span className="w-10 fc">
                {isActive ? (
                  <AudioLines
                    className={cn(
                      `text-primary
                      size-6
                      [&_path]:origin-center
                      [&_path]:transform-fill
                      [&_path]:animate-wave
                      [&_path:nth-child(2)]:[animation-delay:-0.3s]
                      [&_path:nth-child(3)]:[animation-delay:-0.5s]
                      [&_path:nth-child(4)]:[animation-delay:-0.7s]
                      [&_path:nth-child(5)]:[animation-delay:-0.2s]`,
                      playState !== PlayState.Playing && '[&_path]:[animation-play-state:paused]'
                    )}
                  />
                ) : (
                  index + 1
                )}
              </span>
              <span
                className={cn('cursor-pointer', isActive && 'text-primary')}
                onDoubleClick={() => playLocalAudio(audio, params.folderId!)}
              >
                {audio.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon-sm" className="cursor-pointer">
                <Ellipsis />
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
