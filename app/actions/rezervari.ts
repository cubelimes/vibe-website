'use server'

import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)


export type RezervareData = {
  nume: string
  email: string
  telefon: string
  persoane: number
  data_ora: string
}

export type RezervareResult =
  | { success: true }
  | { success: false; error: string }

export type Status = 'in asteptare' | 'confirmat' | 'respins'

export async function schimbaStatus(id: number, status: Status): Promise<RezervareResult> {
  const { error } = await supabase
    .from('rezervari')
    .update({ status })
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function stergeRezervare(id: number): Promise<RezervareResult> {
  const { error } = await supabase
    .from('rezervari')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function citesteRezervari() {
  const { data, error } = await supabase
    .from('rezervari')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return { success: false as const, error: error.message }
  }

  return { success: true as const, data }
}

export async function salveazaRezervare(data: RezervareData): Promise<RezervareResult> {
  const { error } = await supabase.from('rezervari').insert({
    nume: data.nume,
    email: data.email,
    telefon: data.telefon,
    persoane: data.persoane,
    data_ora: data.data_ora,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  const dataFormatata = new Date(data.data_ora).toLocaleDateString('ro-RO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const oraFormatata = new Date(data.data_ora).toLocaleTimeString('ro-RO', {
    hour: '2-digit',
    minute: '2-digit',
  })

  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
    from: 'Vibe Caffè <onboarding@resend.dev>',
    to: data.email,
    subject: 'Rezervarea ta la Vibe Caffè — confirmare',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background: linear-gradient(135deg, #b45309, #92400e); padding: 36px 32px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 26px; letter-spacing: -0.5px;">Vibe Caffè</h1>
          <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 15px;">Rezervarea ta a fost confirmată</p>
        </div>
        <div style="padding: 32px;">
          <p style="color: #374151; font-size: 16px; margin: 0 0 24px;">Bună, <strong>${data.nume}</strong>! Te așteptăm cu drag.</p>
          <div style="background: #fdf8f0; border-radius: 12px; padding: 20px 24px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="color: #9ca3af; font-size: 13px; padding: 6px 0;">Data</td>
                <td style="color: #1f2937; font-weight: 600; font-size: 14px; text-align: right;">${dataFormatata}</td>
              </tr>
              <tr>
                <td style="color: #9ca3af; font-size: 13px; padding: 6px 0;">Ora</td>
                <td style="color: #1f2937; font-weight: 600; font-size: 14px; text-align: right;">${oraFormatata}</td>
              </tr>
              <tr>
                <td style="color: #9ca3af; font-size: 13px; padding: 6px 0;">Persoane</td>
                <td style="color: #1f2937; font-weight: 600; font-size: 14px; text-align: right;">${data.persoane}</td>
              </tr>
              <tr>
                <td style="color: #9ca3af; font-size: 13px; padding: 6px 0;">Telefon</td>
                <td style="color: #1f2937; font-weight: 600; font-size: 14px; text-align: right;">${data.telefon}</td>
              </tr>
            </table>
          </div>
          <p style="color: #6b7280; font-size: 14px; margin: 0;">Dacă ai nevoie să modifici sau anulezi rezervarea, ne poți contacta la orice oră.</p>
        </div>
        <div style="background: #f9fafb; padding: 20px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 13px; margin: 0;">Vibe Caffè • Deva, jud. Hunedoara</p>
        </div>
      </div>
    `,
    })
  }

  return { success: true }
}
