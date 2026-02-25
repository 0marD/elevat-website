'use client'

interface BlogEditorProps {
  className?: string
}

export default function BlogEditor({ className }: BlogEditorProps) {
  return <div className={className} />
}

export type { BlogEditorProps }
