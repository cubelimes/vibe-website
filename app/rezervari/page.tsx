'use client'

import { useState } from 'react'
import { salveazaRezervare } from '@/app/actions/rezervari'

// ─── Constante ───────────────────────────────────────────────────────────────

const ZILE_SCURT = ['Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm', 'Dum']
const LUNI = [
  'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
  'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie',
]
const ZILE_ABREV = ['Dum', 'Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm']

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateTimeSlots(): string[] {
  const slots: string[] = []
  for (let h = 10; h <= 22; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`)
    if (h < 22) slots.push(`${String(h).padStart(2, '0')}:30`)
  }
  return slots
}

function getNext14Days(): Date[] {
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return d
  })
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  )
}

function getCalendarDays(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDow = (firstDay.getDay() + 6) % 7
  const days: (Date | null)[] = Array(startDow).fill(null)
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d))
  }
  while (days.length % 7 !== 0) days.push(null)
  return days
}

// ─── Componentă principală ────────────────────────────────────────────────────

export default function RezervariPage() {
  const today = new Date()
  const maxDate = new Date()
  maxDate.setMonth(maxDate.getMonth() + 6)

  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const [calYear, setCalYear] = useState(today.getFullYear())
  const [formData, setFormData] = useState({ nume: '', email: '', telefon: '', persoane: 2 })
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const timeSlots = generateTimeSlots()
  const next14 = getNext14Days()
  const calendarDays = getCalendarDays(calYear, calMonth)

  const isDateDisabled = (d: Date) => {
    const t = new Date(); t.setHours(0, 0, 0, 0)
    return d < t || d > maxDate
  }

  const canGoPrevMonth = () =>
    calYear > today.getFullYear() ||
    (calYear === today.getFullYear() && calMonth > today.getMonth())

  const canGoNextMonth = () => {
    const nm = calMonth === 11 ? 0 : calMonth + 1
    const ny = calMonth === 11 ? calYear + 1 : calYear
    return ny < maxDate.getFullYear() ||
      (ny === maxDate.getFullYear() && nm <= maxDate.getMonth())
  }

  const prevMonth = () => {
    if (!canGoPrevMonth()) return
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1) }
    else setCalMonth(m => m - 1)
  }

  const nextMonth = () => {
    if (!canGoNextMonth()) return
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1) }
    else setCalMonth(m => m + 1)
  }

  const handleDateSelect = (d: Date) => {
    if (isDateDisabled(d)) return
    setSelectedDate(d)
    if (d.getMonth() !== calMonth || d.getFullYear() !== calYear) {
      setCalMonth(d.getMonth())
      setCalYear(d.getFullYear())
    }
  }

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) return
    setLoading(true)
    setErrorMsg(null)
    const [h, m] = selectedTime.split(':').map(Number)
    const data_ora = new Date(selectedDate)
    data_ora.setHours(h, m, 0, 0)
    const result = await salveazaRezervare({
      ...formData,
      data_ora: data_ora.toISOString(),
    })
    setLoading(false)
    if (result.success) {
      setConfirmed(true)
    } else {
      setErrorMsg(result.error)
    }
  }

  const resetForm = () => {
    setStep(1)
    setSelectedDate(null)
    setSelectedTime(null)
    setFormData({ nume: '', email: '', telefon: '', persoane: 2 })
    setConfirmed(false)
    setErrorMsg(null)
  }

  // ─── Ecran confirmare ───────────────────────────────────────────────────────
  if (confirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ background: 'linear-gradient(135deg, #fdf8f0 0%, #fff 50%, #fff7ed 100%)' }}>
        <div className="glass rounded-3xl p-10 max-w-md w-full text-center shadow-2xl">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'linear-gradient(135deg, #b45309, #92400e)' }}>
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Rezervare confirmată!</h2>
          <p className="text-gray-600 mb-2">
            <span className="font-semibold text-gray-800">
              {selectedDate?.toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
            {' '}la ora{' '}
            <span className="font-semibold text-gray-800">{selectedTime}</span>
          </p>
          <p className="text-gray-500 mb-8">
            Te așteptăm, <span className="font-semibold text-gray-700">{formData.nume}</span>! O confirmare a fost înregistrată.
          </p>
          <button
            onClick={resetForm}
            className="w-full py-4 rounded-2xl text-white font-semibold text-lg transition-all duration-300 hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #b45309, #92400e)' }}>
            Rezervare nouă
          </button>
        </div>
      </div>
    )
  }

  // ─── Pagina principală ──────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen py-12 px-4"
      style={{ background: 'linear-gradient(135deg, #fdf8f0 0%, #fff 50%, #fff7ed 100%)' }}
    >
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Rezervă o masă</h1>
          <p className="text-gray-500 text-lg">Alege data, ora și completează detaliile</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center mb-10">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <button
                onClick={() => s < step ? setStep(s) : undefined}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  s === step ? 'text-white shadow-lg scale-110' : s < step ? 'text-white' : 'bg-gray-100 text-gray-400'
                }`}
                style={
                  s === step
                    ? { background: 'linear-gradient(135deg, #b45309, #92400e)' }
                    : s < step
                    ? { background: '#b45309' }
                    : {}
                }
              >
                {s < step ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : s}
              </button>
              {s < 3 && (
                <div className={`w-16 md:w-24 h-1 transition-all duration-300 ${s < step ? 'opacity-100' : 'opacity-20'}`}
                  style={{ background: '#b45309' }} />
              )}
            </div>
          ))}
        </div>

        {/* ── STEP 1: Data ── */}
        {step === 1 && (
          <div className="glass rounded-3xl p-6 md:p-8 shadow-xl">
            <h3 className="text-xl font-bold text-gray-800 mb-5">Alege data</h3>

            {/* Butoane rapide 14 zile */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
              {next14.map((d, i) => {
                const isSelected = selectedDate && isSameDay(d, selectedDate)
                const isToday = isSameDay(d, today)
                return (
                  <button
                    key={i}
                    onClick={() => handleDateSelect(d)}
                    className={`flex-none flex flex-col items-center px-3 py-2 rounded-2xl border-2 transition-all duration-200 min-w-[60px] ${
                      isSelected ? 'text-white border-transparent' : 'bg-white border-gray-100 text-gray-700 hover:border-amber-400'
                    }`}
                    style={isSelected ? { background: 'linear-gradient(135deg, #b45309, #92400e)' } : {}}
                  >
                    <span className="text-xs font-medium opacity-75">{ZILE_ABREV[d.getDay()]}</span>
                    <span className="text-lg font-bold leading-tight">{d.getDate()}</span>
                    <span className="text-xs opacity-75">{LUNI[d.getMonth()].slice(0, 3)}</span>
                    {isToday && !isSelected && (
                      <div className="w-1.5 h-1.5 rounded-full mt-0.5" style={{ background: '#F97316' }} />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Calendar */}
            <div className="bg-white/60 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-4">
                <button onClick={prevMonth} disabled={!canGoPrevMonth()}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${canGoPrevMonth() ? 'hover:bg-amber-50 text-gray-600' : 'text-gray-200 cursor-not-allowed'}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="font-bold text-gray-800">{LUNI[calMonth]} {calYear}</span>
                <button onClick={nextMonth} disabled={!canGoNextMonth()}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${canGoNextMonth() ? 'hover:bg-amber-50 text-gray-600' : 'text-gray-200 cursor-not-allowed'}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-7 mb-2">
                {ZILE_SCURT.map(z => (
                  <div key={z} className="text-center text-xs font-semibold text-gray-400 py-1">{z}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((d, i) => {
                  if (!d) return <div key={i} />
                  const disabled = isDateDisabled(d)
                  const isSelected = selectedDate && isSameDay(d, selectedDate)
                  const isToday = isSameDay(d, today)
                  return (
                    <button key={i} onClick={() => !disabled && handleDateSelect(d)}
                      className={`aspect-square rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                        disabled ? 'text-gray-200 cursor-not-allowed'
                        : isSelected ? 'text-white'
                        : isToday ? 'font-bold border-2'
                        : 'hover:bg-amber-50 text-gray-700'
                      }`}
                      style={
                        isSelected ? { background: 'linear-gradient(135deg, #b45309, #92400e)' }
                        : isToday && !disabled ? { borderColor: '#b45309', color: '#b45309' }
                        : {}
                      }
                    >
                      {d.getDate()}
                    </button>
                  )
                })}
              </div>
            </div>

            <button onClick={() => setStep(2)} disabled={!selectedDate}
              className={`w-full mt-6 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${selectedDate ? 'text-white hover:opacity-90' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
              style={selectedDate ? { background: 'linear-gradient(135deg, #b45309, #92400e)' } : {}}>
              Continuă →
            </button>
          </div>
        )}

        {/* ── STEP 2: Ora ── */}
        {step === 2 && (
          <div className="glass rounded-3xl p-6 md:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-5">
              <button onClick={() => setStep(1)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Alege ora</h3>
                <p className="text-sm text-gray-500">
                  {selectedDate?.toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {timeSlots.map((slot) => {
                const isSelected = selectedTime === slot
                return (
                  <button key={slot} onClick={() => setSelectedTime(slot)}
                    className={`py-3 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
                      isSelected ? 'text-white border-transparent' : 'bg-white border-gray-100 text-gray-700 hover:border-amber-400'
                    }`}
                    style={isSelected ? { background: 'linear-gradient(135deg, #b45309, #92400e)' } : {}}>
                    {slot}
                  </button>
                )
              })}
            </div>
            <button onClick={() => setStep(3)} disabled={!selectedTime}
              className={`w-full mt-6 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${selectedTime ? 'text-white hover:opacity-90' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
              style={selectedTime ? { background: 'linear-gradient(135deg, #b45309, #92400e)' } : {}}>
              Continuă →
            </button>
          </div>
        )}

        {/* ── STEP 3: Detalii ── */}
        {step === 3 && (
          <div className="glass rounded-3xl p-6 md:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-5">
              <button onClick={() => setStep(2)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Detaliile tale</h3>
                <p className="text-sm text-gray-500">
                  {selectedDate?.toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long' })} • {selectedTime}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nume complet</label>
                <input type="text" value={formData.nume} onChange={e => setFormData(f => ({ ...f, nume: e.target.value }))}
                  placeholder="Ion Popescu"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-white focus:outline-none focus:border-amber-600 transition-colors text-gray-800 placeholder-gray-300" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                <input type="email" value={formData.email} onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
                  placeholder="ion@email.com"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-white focus:outline-none focus:border-amber-600 transition-colors text-gray-800 placeholder-gray-300" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Telefon</label>
                <input type="tel" value={formData.telefon} onChange={e => setFormData(f => ({ ...f, telefon: e.target.value }))}
                  placeholder="0740 000 000"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-white focus:outline-none focus:border-amber-600 transition-colors text-gray-800 placeholder-gray-300" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Număr de persoane</label>
                <div className="grid grid-cols-6 gap-2">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(n => {
                    const isSelected = formData.persoane === n
                    return (
                      <button key={n} onClick={() => setFormData(f => ({ ...f, persoane: n }))}
                        className={`py-3 rounded-xl text-sm font-bold border-2 transition-all duration-200 ${
                          isSelected ? 'text-white border-transparent' : 'bg-white border-gray-100 text-gray-700 hover:border-orange-300'
                        }`}
                        style={isSelected ? { background: 'linear-gradient(135deg, #F97316, #EA580C)' } : {}}>
                        {n}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{errorMsg}</div>
            )}

            <button onClick={handleSubmit} disabled={loading || !formData.nume || !formData.email || !formData.telefon}
              className={`w-full mt-6 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                !loading && formData.nume && formData.email && formData.telefon ? 'text-white hover:opacity-90' : 'bg-gray-100 text-gray-300 cursor-not-allowed'
              }`}
              style={!loading && formData.nume && formData.email && formData.telefon ? { background: 'linear-gradient(135deg, #b45309, #92400e)' } : {}}>
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Se trimite...
                </>
              ) : 'Confirmă rezervarea'}
            </button>
          </div>
        )}

        {/* Info program + contact */}
        <div className="mt-6 glass rounded-2xl px-6 py-3 flex items-center gap-4 text-xs text-gray-600 flex-wrap">
          <span><span className="font-semibold text-gray-800">Program:</span> Luni - Duminică, 10:00 - 22:00</span>
          <span className="text-gray-300">|</span>
          <span><span className="font-semibold text-gray-800">Contact:</span> +40 740 000 000</span>
          <span className="text-gray-300">|</span>
          <a href="mailto:rezervari@vibecoffee.ro" className="text-amber-700 hover:underline">rezervari@vibecoffee.ro</a>
        </div>

      </div>
    </div>
  )
}
