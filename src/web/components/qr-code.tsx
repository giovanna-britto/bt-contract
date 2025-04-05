"use client"

import { useEffect, useState } from "react"
import QRCodeReact from "react-qr-code"

interface QRCodeProps {
  value: string
  size?: number
}

export default function QRCode({ value, size = 200 }: QRCodeProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="bg-gray-800 animate-pulse" style={{ width: size, height: size }} />
  }

  return <QRCodeReact value={value} size={size} bgColor="#FFFFFF" fgColor="#000000" level="H" />
}

