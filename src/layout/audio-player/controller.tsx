import { useEffect, useMemo, useRef, useState } from 'react'
import { Pause, Play, SkipBack, SkipForward, ChevronUp, Volume, Volume1, Volume2, VolumeX } from 'lucide-react'
import { cn } from 'cn'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { dayjs } from '@/lib/dayjs'
import {
  togglePauseOrPlay,
  useAudioStore,
  setVolume,
  PlayState,
  setCurrentTime,
  ShowMode,
  playPrevAudio,
  playNextAudio
} from '@/store/audio-store'
import { useAppStore } from '@/store/app-store'

export function Controller() {
  const currentAudioInfo = useAudioStore(state => state.currentAudioInfo)
  const playState = useAudioStore(state => state.playState)
  const duration = useAudioStore(state => state.duration)
  const currentTime = useAudioStore(state => state.currentTime)
  const volume = useAppStore(state => state.volume)
  const showMode = useAudioStore(state => state.showMode)
  const volumeSliderValue = useMemo(() => [volume], [volume])
  const VolumeIcon = useMemo(() => {
    if (volume > 0.7) return Volume2
    if (volume > 0.35) return Volume1
    if (volume > 0) return Volume
    return VolumeX
  }, [volume])

  const isCurrentTimeSliderMovingRef = useRef(false)
  const [currentTimeSliderValue, setCurrentTimeSliderValue] = useState([0])
  useEffect(() => {
    if (!currentTime || isCurrentTimeSliderMovingRef.current) return
    setCurrentTimeSliderValue([currentTime])
  }, [currentTime])

  return (
    <div
      className={cn(
        'fixed -bottom-22 left-0 w-full h-20 z-20 bg-white transition-all',
        showMode !== ShowMode.Hide && 'bottom-0'
      )}
    >
      <Slider
        value={currentTimeSliderValue}
        max={duration}
        step={1}
        onPointerDown={() => (isCurrentTimeSliderMovingRef.current = true)}
        onPointerUp={() => (isCurrentTimeSliderMovingRef.current = false)}
        onValueChange={val => setCurrentTimeSliderValue(val)}
        onValueCommit={val => setCurrentTime(val[0])}
      />

      <div className="p-4 h-full flex items-center justify-between">
        <div className="flex-1 flex items-center gap-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (showMode !== ShowMode.Fullscreen) {
                useAudioStore.setState({
                  showMode: ShowMode.Fullscreen
                })
              } else {
                useAudioStore.setState({
                  showMode: ShowMode.Bottom
                })
              }
            }}
          >
            <ChevronUp className={cn('w-6! h-6! transition-all', showMode === ShowMode.Fullscreen && 'rotate-180')} />
          </Button>
          <div className="text-lg">{currentAudioInfo?.name}</div>
        </div>

        <div className="flex-1 flex justify-center items-center gap-x-2">
          <Button variant="ghost" size="default" onClick={playPrevAudio}>
            <SkipBack className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="default" onClick={togglePauseOrPlay}>
            {playState === PlayState.Playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </Button>
          <Button variant="ghost" size="default" onClick={playNextAudio}>
            <SkipForward className="w-6 h-6" />
          </Button>
        </div>

        <div className="flex-1 flex justify-end items-center gap-x-2">
          <VolumeIcon />
          <Slider
            className="w-25"
            value={volumeSliderValue}
            max={1}
            step={0.01}
            onValueChange={val => setVolume(val[0])}
          />
          <div className="text-sm mr-4">
            {dayjs.duration(currentTimeSliderValue[0], 'seconds').format('mm:ss')} /{' '}
            {duration && dayjs.duration(duration, 'seconds').format('mm:ss')}
          </div>
        </div>
      </div>
    </div>
  )
}
