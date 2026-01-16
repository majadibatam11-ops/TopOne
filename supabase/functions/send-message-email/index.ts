type DenoLike = {
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
  env: { get: (key: string) => string | undefined };
};
const deno = (globalThis as unknown as { Deno: DenoLike }).Deno;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    const { name, email, phone, subject, message } = payload ?? {};

    const adminEmail = "admin@toponemining.co.za";
    const apiKey = deno.env.get("RESEND_API_KEY");
    const from = deno.env.get("RESEND_FROM") ?? "onboarding@resend.dev";

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing RESEND_API_KEY secret" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
        <h2 style="margin:0 0 12px;">New Website Message</h2>
        <p><strong>Subject:</strong> ${subject || "No subject"}</p>
        <p><strong>From:</strong> ${name || "Unknown"} &lt;${email || "no-email"}&gt;</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0;" />
        <p style="white-space:pre-wrap">${(message || "").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0;" />
        <p style="color:#555;font-size:12px">This notification was sent automatically from the website contact form.</p>
      </div>
    `;

    const text = `New Website Message
Subject: ${subject || "No subject"}
From: ${name || "Unknown"} <${email || "no-email"}>${phone ? `, Phone: ${phone}` : ""}

${message || ""}`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [adminEmail],
        subject: `New Website Message: ${subject || "No subject"}`,
        html,
        text,
        reply_to: email || undefined,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return new Response(JSON.stringify({ error: data?.error ?? "Failed to send email" }), {
        status: res.status,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    return new Response(JSON.stringify({ ok: true, id: data?.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid request", detail: String(err) }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
