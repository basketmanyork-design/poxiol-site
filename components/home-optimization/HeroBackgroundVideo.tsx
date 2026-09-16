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
    const update=()=>setMayPlay(!motion.matches && !connection?.saveData)
    update()
    motion.addEventListener('change',update)
    connection?.addEventListener?.('change',update)
    return () => {
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
