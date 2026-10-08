import { Link } from 'react-router-dom'

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link to="/" className={className} aria-label="Restaurant Journal — home">
      <span className="font-display text-xl leading-none font-semibold tracking-tight">
        Restaurant <em className="font-medium text-persimmon italic">Journal</em>
      </span>
    </Link>
  )
}
