'use client'

import { useEffect, useState } from 'react'
import {
  citesteRezervari,
  schimbaStatus,
  stergeRezervare,
  type Status,
} from '@/app/actions/rezervari'

type Rezervare = {
  id: number
  nume: string
  email: string
  telefon: string
  persoane: number
  data_ora: string
  status: string
  created_at: string
}

const STATUS_LABELS: Record<string, string> = {
  'in asteptare': 'În așteptare',
  confirmat: 'Confirmat',
  respins: 'Respins',
}

const STATUS_STYLES: Record<string, string> = {
  'in asteptare': 'bg-amber-100 text-amber-800',
  confirmat: 'bg-green-100 text-green-800',
  respins: 'bg-red-100 text-red-700',
}

const FILTRE = ['toate', 'in asteptare', 'confirmat', 'respins']

export default function AdminPage() {
  const [rezervari, setRezervari] = useState<Rezervare[]>([])
  const [loading, setLoading] = useState(true)
  const [filtruStatus, setFiltruStatus] = useState('toate')
  const [cautare, setCautare] = useState('')
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [confirmSterge, setConfirmSterge] = useState<number | null>(null)

  const incarcaDate = async () => {
    const result = await citesteRezervari()
    if (result.success) setRezervari(result.data as Rezervare[])
    setLoading(false)
  }

  useEffect(() => {
    incarcaDate()
  }, [])

  const handleStatus = async (id: number, status: Status) => {
    setLoadingId(id)
    await schimbaStatus(id, status)
    await incarcaDate()
    setLoadingId(null)
  }

  const handleSterge = async (id: number) => {
    setLoadingId(id)
    await stergeRezervare(id)
    setRezervari(r => r.filter(x => x.id !== id))
    setLoadingId(null)
    setConfirmSterge(null)
  }

  const listaFiltrata = rezervari.filter(r => {
    const potrivireStatus = filtruStatus === 'toate' || r.status === filtruStatus
    const potrivireCautare = r.nume.toLowerCase().includes(cautare.toLowerCase())
    return potrivireStatus && potrivireCautare
  })

  const formatData = (iso: string) =>
    new Date(iso).toLocaleDateString('ro-RO', {
      day: 'numeric', month: 'short', year: 'numeric',
    })

  const formatOra = (iso: string) =>
    new Date(iso).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })

  const numarPeStatus = (s: string) =>
    rezervari.filter(r => r.status === s).length

  return (
    <div
      className="min-h-screen py-10 px-4"
      style={{ background: 'linear-gradient(135deg, #fdf8f0 0%, #fff 50%, #fff7ed 100%)' }}
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-1">Rezervări</h1>
          <p className="text-gray-500">Gestionează rezervările primite</p>
        </div>

        {/* Statistici rapide */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'În așteptare', status: 'in asteptare', color: 'bg-amber-50 border-amber-200 text-amber-800' },
            { label: 'Confirmate', status: 'confirmat', color: 'bg-green-50 border-green-200 text-green-800' },
            { label: 'Respinse', status: 'respins', color: 'bg-red-50 border-red-200 text-red-700' },
          ].map(({ label, status, color }) => (
            <div key={status} className={`glass rounded-2xl p-4 border text-center ${color}`}>
              <p className="text-3xl font-bold">{numarPeStatus(status)}</p>
              <p className="text-sm font-medium mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Filtre + Căutare */}
        <div className="glass rounded-2xl p-4 mb-6 flex flex-col sm:flex-row gap-3">
          {/* Căutare */}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              placeholder="Caută după nume..."
              value={cautare}
              onChange={e => setCautare(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border-2 border-gray-100 bg-white focus:outline-none focus:border-amber-400 transition-colors text-gray-800 placeholder-gray-300 text-sm"
            />
          </div>
          {/* Filtre status */}
          <div className="flex gap-2 flex-wrap">
            {FILTRE.map(f => (
              <button
                key={f}
                onClick={() => setFiltruStatus(f)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
                  filtruStatus === f
                    ? 'text-white border-transparent'
                    : 'bg-white border-gray-100 text-gray-600 hover:border-amber-300'
                }`}
                style={filtruStatus === f ? { background: 'linear-gradient(135deg, #b45309, #92400e)' } : {}}
              >
                {f === 'toate' ? 'Toate' : STATUS_LABELS[f]}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-16 text-gray-400">Se încarcă...</div>
        )}

        {/* Gol */}
        {!loading && listaFiltrata.length === 0 && (
          <div className="glass rounded-2xl p-16 text-center text-gray-400">
            <p className="text-lg">Nicio rezervare găsită.</p>
          </div>
        )}

        {/* ── TABEL (desktop) ── */}
        {!loading && listaFiltrata.length > 0 && (
          <div className="hidden md:block glass rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Nume', 'Contact', 'Data & Ora', 'Pers.', 'Status', 'Acțiuni'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {listaFiltrata.map((r, i) => (
                  <tr
                    key={r.id}
                    className={`border-b border-gray-50 transition-colors hover:bg-amber-50/40 ${i % 2 === 0 ? 'bg-white/60' : 'bg-white/30'}`}
                  >
                    <td className="px-5 py-4 font-semibold text-gray-800 text-sm">{r.nume}</td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-700">{r.email}</p>
                      <p className="text-xs text-gray-400">{r.telefon}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-800">{formatData(r.data_ora)}</p>
                      <p className="text-xs text-gray-400">{formatOra(r.data_ora)}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700 font-medium">{r.persoane}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[r.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {STATUS_LABELS[r.status] ?? r.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <ActiuniRand
                        rezervare={r}
                        loading={loadingId === r.id}
                        confirmSterge={confirmSterge === r.id}
                        onConfirma={() => handleStatus(r.id, 'confirmat')}
                        onRespinge={() => handleStatus(r.id, 'respins')}
                        onStergeClick={() => setConfirmSterge(r.id)}
                        onStergeConfirm={() => handleSterge(r.id)}
                        onStergeCancel={() => setConfirmSterge(null)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── CARDURI (mobile) ── */}
        {!loading && listaFiltrata.length > 0 && (
          <div className="flex flex-col gap-4 md:hidden">
            {listaFiltrata.map(r => (
              <div key={r.id} className="glass rounded-2xl p-5 shadow-md">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-900">{r.nume}</p>
                    <p className="text-sm text-gray-500">{r.email}</p>
                    <p className="text-sm text-gray-500">{r.telefon}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[r.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {STATUS_LABELS[r.status] ?? r.status}
                  </span>
                </div>
                <div className="flex gap-4 text-sm text-gray-600 mb-4 bg-amber-50 rounded-xl px-4 py-2.5">
                  <span>📅 {formatData(r.data_ora)}</span>
                  <span>🕐 {formatOra(r.data_ora)}</span>
                  <span>👥 {r.persoane} pers.</span>
                </div>
                <ActiuniRand
                  rezervare={r}
                  loading={loadingId === r.id}
                  confirmSterge={confirmSterge === r.id}
                  onConfirma={() => handleStatus(r.id, 'confirmat')}
                  onRespinge={() => handleStatus(r.id, 'respins')}
                  onStergeClick={() => setConfirmSterge(r.id)}
                  onStergeConfirm={() => handleSterge(r.id)}
                  onStergeCancel={() => setConfirmSterge(null)}
                />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

// ─── Butoane acțiuni ──────────────────────────────────────────────────────────

function ActiuniRand({
  rezervare,
  loading,
  confirmSterge,
  onConfirma,
  onRespinge,
  onStergeClick,
  onStergeConfirm,
  onStergeCancel,
}: {
  rezervare: Rezervare
  loading: boolean
  confirmSterge: boolean
  onConfirma: () => void
  onRespinge: () => void
  onStergeClick: () => void
  onStergeConfirm: () => void
  onStergeCancel: () => void
}) {
  if (loading) {
    return (
      <div className="flex items-center gap-1 text-gray-400 text-xs">
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Se salvează...
      </div>
    )
  }

  if (confirmSterge) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">Ești sigur?</span>
        <button
          onClick={onStergeConfirm}
          className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors"
        >
          Șterge
        </button>
        <button
          onClick={onStergeCancel}
          className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-semibold hover:bg-gray-200 transition-colors"
        >
          Anulează
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {rezervare.status !== 'confirmat' && (
        <button
          onClick={onConfirma}
          className="px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-semibold border border-green-200 hover:bg-green-100 transition-colors"
        >
          Confirmă
        </button>
      )}
      {rezervare.status !== 'respins' && (
        <button
          onClick={onRespinge}
          className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold border border-red-200 hover:bg-red-100 transition-colors"
        >
          Respinge
        </button>
      )}
      <button
        onClick={onStergeClick}
        className="px-3 py-1.5 rounded-lg bg-gray-50 text-gray-500 text-xs font-semibold border border-gray-200 hover:bg-gray-100 transition-colors"
      >
        Șterge
      </button>
    </div>
  )
}
