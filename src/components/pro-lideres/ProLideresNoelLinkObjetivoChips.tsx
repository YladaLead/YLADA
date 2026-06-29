'use client'

import { useState } from 'react'
import {
  PRO_LIDERES_LEADER_LINK_OBJETIVO_OPTIONS,
  PRO_LIDERES_LINK_OBJETIVO_OUTRO_LABEL,
  type ProLideresLeaderLinkObjetivoId,
} from '@/lib/pro-lideres-noel-leader-link-objetivos'

type Props = {
  disabled?: boolean
  onSelectPreset: (message: string) => void
  onFocusOutroInput: () => void
}

export function ProLideresNoelLinkObjetivoChips({
  disabled = false,
  onSelectPreset,
  onFocusOutroInput,
}: Props) {
  const [outroOpen, setOutroOpen] = useState(false)
  const [outroText, setOutroText] = useState('')

  const handlePreset = (id: ProLideresLeaderLinkObjetivoId, sendMessage: string) => {
    if (id === 'outro') {
      setOutroOpen(true)
      onFocusOutroInput()
      return
    }
    onSelectPreset(sendMessage)
  }

  const submitOutro = () => {
    const trimmed = outroText.trim()
    if (trimmed.length < 3) return
    onSelectPreset(`${PRO_LIDERES_LINK_OBJETIVO_OUTRO_LABEL}: ${trimmed}`)
    setOutroOpen(false)
    setOutroText('')
  }

  return (
    <div className="mt-3 flex flex-col gap-2 border-t border-sky-100 pt-3">
      <p className="text-xs font-medium text-sky-900/90">Toque no objetivo do link:</p>
      <div className="flex flex-col gap-2">
        {PRO_LIDERES_LEADER_LINK_OBJETIVO_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            disabled={disabled}
            onClick={() => handlePreset(opt.id, opt.sendMessage)}
            className="touch-manipulation flex min-h-[44px] w-full flex-col items-start justify-center rounded-xl border border-sky-300 bg-white px-4 py-2.5 text-left shadow-sm hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-row sm:items-center sm:gap-2"
          >
            <span className="text-sm font-semibold text-sky-950">{opt.title}</span>
            <span className="text-xs text-gray-600 sm:text-sm">{opt.hint}</span>
          </button>
        ))}
      </div>
      {outroOpen ? (
        <div className="flex flex-col gap-2 rounded-xl border border-sky-200 bg-sky-50/50 p-3">
          <label className="text-xs font-medium text-sky-900" htmlFor="noel-link-objetivo-outro">
            {PRO_LIDERES_LINK_OBJETIVO_OUTRO_LABEL}
          </label>
          <textarea
            id="noel-link-objetivo-outro"
            rows={2}
            value={outroText}
            onChange={(e) => setOutroText(e.target.value)}
            placeholder="Ex.: quero algo pra quem já comprou mas não usa direito"
            className="w-full resize-none rounded-lg border border-sky-200 bg-white px-3 py-2 text-sm text-gray-900"
          />
          <button
            type="button"
            disabled={disabled || outroText.trim().length < 3}
            onClick={submitOutro}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50 touch-manipulation"
          >
            Enviar objetivo
          </button>
        </div>
      ) : null}
    </div>
  )
}
