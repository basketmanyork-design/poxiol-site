'use client'

import {useEffect,useRef,useState} from 'react'
import styles from './HomepageOptimization.module.css'

type ConnectionPreference = {saveData?:boolean;addEventListener?:(event:string,listener:()=>void)=>void;removeEventListener?:(event:string,listener:()=>void)=>void}

export function HeroBackgroundVideo() {
  const [mayPlay,setMayPlay]=useState(false)
  const [failed,setFailed]=useState(false)
  const video=useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const motion=window.matchMedia('(prefers-reduced-motion: reduce)')
    const connection=(navigator as Navigator & {connection?:ConnectionPreference}).connection
    let idleHandle: number | undefined
    let timerHandle: number | undefined
    const cancelPending=()=>{
      if (idleHandle !== undefined) window.cancelIdleCallback(idleHandle)
      if (timerHandle !== undefined) window.clearTimeout(timerHandle)
      idleHandle=undefined
      timerHandle=undefined
    }
    const allowPlayback=()=>{
      if (!motion.matches && !connection?.saveData) setMayPlay(true)
    }
    const startAfterLoad=()=>{
      if (typeof window.requestIdleCallback === 'function') {
        idleHandle=window.requestIdleCallback(allowPlayback,{timeout:2000})
      } else {
        timerHandle=window.setTimeout(allowPlayback,0)
      }
    }
    const update=()=>{
      cancelPending()
      if (motion.matches || connection?.saveData) {
        setMayPlay(false)
      } else if (document.readyState === 'complete') {
        startAfterLoad()
      }
    }
    update()
    window.addEventListener('load',update)
    motion.addEventListener('change',update)
    connection?.addEventListener?.('change',update)
    return () => {
      cancelPending()
      window.removeEventListener('load',update)
      motion.removeEventListener('change',update)
      connection?.removeEventListener?.('change',update)
    }
  },[])

  useEffect(() => {
    if (!mayPlay || failed) return
    const current=video.current
    if (!current) return
    current.play().catch(()=>setFailed(true))
    return ()=>current.pause()
  },[mayPlay,failed])

  if (failed) return null
  return <video key={mayPlay?'motion':'poster'} ref={video} className={styles.heroVideo} autoPlay={mayPlay} muted loop playsInline preload="none" poster="/images/poxiol-teamwear-range-banner-2x1.webp" aria-hidden="true" tabIndex={-1} onError={()=>setFailed(true)}>
    {mayPlay ? <source src="/website-optimization/poxiol-hero-22s-720p.mp4" type="video/mp4" /> : null}
  </video>
}
