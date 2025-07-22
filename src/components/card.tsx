import * as React from "react"

export function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg border bg-white p-4 shadow">{children}</div>
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-semibold">{children}</h2>
}

export function CardDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-gray-500">{children}</p>
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
