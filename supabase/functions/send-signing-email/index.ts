import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { to, signerName, contractTitle, contractId } = await req.json();

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const APP_URL = Deno.env.get('APP_URL') ?? 'http://localhost:5173';
    const FROM_EMAIL = Deno.env.get('FROM_EMAIL') ?? 'ContractEase <noreply@contractease.app>';

    if (!RESEND_API_KEY) {
      console.warn('[send-signing-email] RESEND_API_KEY not configured — skipping email.');
      return new Response(
        JSON.stringify({ success: false, skipped: true, reason: 'RESEND_API_KEY not set' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const contractUrl = `${APP_URL}/contracts/${contractId}`;
    const greeting = signerName ? `Olá, ${signerName}!` : 'Olá!';

    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid #222;border-radius:16px;overflow:hidden;max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#059669,#0891b2);padding:32px;text-align:center;">
            <p style="margin:0;color:#fff;font-size:13px;letter-spacing:2px;font-weight:700;text-transform:uppercase;opacity:0.8;">ContractEase</p>
            <h1 style="margin:12px 0 0;color:#fff;font-size:22px;font-weight:800;">Documento aguardando<br>sua assinatura</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 8px;color:#d1d5db;font-size:16px;">${greeting}</p>
            <p style="margin:0 0 24px;color:#9ca3af;font-size:14px;line-height:1.6;">
              Você foi convidado(a) a assinar o documento abaixo. Clique no botão para acessar, revisar e assinar com validade jurídica.
            </p>

            <!-- Contract card -->
            <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-left:4px solid #059669;border-radius:10px;padding:20px;margin-bottom:28px;">
              <p style="margin:0 0 4px;color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Documento</p>
              <p style="margin:0;color:#f9fafb;font-size:18px;font-weight:700;">${contractTitle}</p>
            </div>

            <!-- CTA -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center">
                  <a href="${contractUrl}"
                    style="display:inline-block;background:#10b981;color:#000;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:800;font-size:15px;letter-spacing:0.3px;">
                    ✍ Assinar Documento
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:24px 0 0;color:#4b5563;font-size:12px;text-align:center;line-height:1.6;">
              Ou acesse diretamente:<br>
              <a href="${contractUrl}" style="color:#059669;">${contractUrl}</a>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;border-top:1px solid #1f1f1f;text-align:center;">
            <p style="margin:0;color:#374151;font-size:11px;line-height:1.6;">
              Assinatura com registro imutável na <strong style="color:#4b5563;">Stellar Blockchain</strong><br>
              Válido conforme MP 2.200-2/2001 (ICP-Brasil) e LGPD
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject: `✍ Assinatura solicitada: "${contractTitle}"`,
        html,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('[send-signing-email] Resend error:', data);
      return new Response(
        JSON.stringify({ success: false, error: data }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, id: data.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[send-signing-email] Unexpected error:', err);
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
