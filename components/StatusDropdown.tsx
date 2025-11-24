'use client'

import { useState } from 'react'
import { updateQuoteStatus } from '@/app/actions/update-quote'

type StatusDropdownProps = {
  quoteId: string
  currentStatus: string
}

const STATUS_OPTIONS = ['Pending', 'Approved', 'Rejected', 'Completed']

export default function StatusDropdown({ quoteId, currentStatus }: StatusDropdownProps) {
  const [status, setStatus] = useState(currentStatus)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === status) return

    setIsUpdating(true)
    try {
      await updateQuoteStatus(quoteId, newStatus)
      setStatus(newStatus)
    } catch (error) {
      console.error('Failed to update status:', error)
      alert('Failed to update status')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <select
      value={status}
      onChange={(e) => handleStatusChange(e.target.value)}
      disabled={isUpdating}
      className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
    >
      {STATUS_OPTIONS.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}
