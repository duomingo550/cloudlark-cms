'use client'

import { useEffect, useRef, useState } from 'react'

type AudioPlayerProps = {
  src?: string | null
  title: string
  artist?: string | null
  cover?: string | null
  compact?: boolean
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const minutes = Math.floor(seconds / 60)
  return `${minutes}:${Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0')}`
}

export function AudioPlayer({
  src,
  title,
  artist,
  cover,
  compact = false,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => setCurrent(audio.currentTime)
    const onMeta = () => setDuration(audio.duration || 0)
    const onEnd = () => setPlaying(false)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('durationchange', onMeta)
    audio.addEventListener('ended', onEnd)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('durationchange', onMeta)
      audio.removeEventListener('ended', onEnd)
    }
  }, [])

  async function toggle() {
    const audio = audioRef.current
    if (!audio || !src) return
    if (audio.paused) {
      await audio.play()
      setPlaying(true)
    } else {
      audio.pause()
      setPlaying(false)
    }
  }

  function seek(value: number) {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = value
    setCurrent(value)
  }

  return (
    <div className={`audio-player ${compact ? 'is-compact' : ''}`}>
      <audio preload="metadata" ref={audioRef} src={src || undefined} />
      <div
        className="audio-cover"
        style={
          cover
            ? { backgroundImage: `url("${cover.replace(/"/g, '\\"')}")` }
            : undefined
        }
      >
        {!cover && <span>♪</span>}
      </div>
      <div className="audio-body">
        <div className="audio-meta">
          <strong>{title}</strong>
          <span>{artist || '云雀音乐'}</span>
        </div>
        <div className="audio-controls">
          <button
            aria-label={playing ? '暂停' : '播放'}
            className="audio-toggle"
            disabled={!src}
            onClick={toggle}
            type="button"
          >
            {playing ? 'Ⅱ' : '▶'}
          </button>
          <div className="audio-track">
            <input
              aria-label="播放进度"
              disabled={!src || !duration}
              max={duration || 0}
              min={0}
              onChange={(event) => seek(Number(event.target.value))}
              step={0.1}
              type="range"
              value={current}
            />
            <div className="audio-time">
              <span>{formatTime(current)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
