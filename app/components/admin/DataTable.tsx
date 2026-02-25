'use client'

interface DataTableProps<T> {
  data: T[]
  className?: string
}

export default function DataTable<T>({ data, className }: DataTableProps<T>) {
  return <table className={className}><tbody>{data.length}</tbody></table>
}

export type { DataTableProps }
