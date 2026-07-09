import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

export const probe = { useState, useQuery }

export default function register({ app }) {
  probe.app = app
  return { id: 'smoke', navEntry: { label: 'Smoke', path: '/smoke', order: 100 }, routes: { path: 'smoke' } }
}
