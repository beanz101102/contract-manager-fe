"use client"

import { useEffect } from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"

interface NextImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  classNameImg?: string
}
const NextImage = ({
  alt,
  src,
  className,
  width = 0,
  height = 0,
  classNameImg,
}: NextImageProps) => {
  const handleContextMenu = (event: { preventDefault: () => void }) => {
    event.preventDefault()
  }

  useEffect(() => {
    const image = document.getElementById("no-context-menu-image")
    if (image) {
      image.addEventListener("contextmenu", handleContextMenu)

      // Cleanup event listener on unmount
      return () => {
        image.removeEventListener("contextmenu", handleContextMenu)
      }
    }
  }, [])
  return (
    <div className={cn("relative", className)}>
      <Image
        id="no-context-menu-image"
        src={src}
        alt={alt}
        height={height}
        width={width}
        objectFit={"cover"}
        className={cn("", classNameImg)}
        layout="responsive"
      />
    </div>
  )
}

export default NextImage
