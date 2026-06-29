import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { Resend } from "resend";
import { absoluteProposalDocUrl, proposalDocs, type ProposalDoc } from "@/lib/proposalDocs";

type SelectedService = {
  id: string;
  title: string;
  price: number;
};

type ProposalSignBody = {
  signer: {
    name?: string;
    email?: string;
    title?: string;
    company?: string;
    signature?: string;
    notes?: string;
  };
  selectedServices?: SelectedService[];
};

type SignedProposalRecord = {
  approval_id: string;
  signer_name: string;
  signer_email: string;
  signer_title: string;
  company: string;
  typed_signature: string;
  notes: string;
  selected_services: SelectedService[];
  monthly_total: number;
  signed_at: string;
  email_id?: string;
};

const servicePrices: Record<string, { title: string; price: number }> = {
  photo: { title: "Photography", price: 1250 },
  video: { title: "Videography", price: 1750 },
  drone: { title: "Drone Capture", price: 1250 },
  local: { title: "Local Search", price: 150 },
  ads: { title: "Paid Campaigns", price: 3300 },
  social: { title: "Social Distribution", price: 900 },
  reviews: { title: "Reputation Proof", price: 650 },
  geo: { title: "AI Search Visibility", price: 150 },
  reporting: { title: "Reporting", price: 400 },
};

function normalizePaidCampaignPrice(price: number) {
  if (!Number.isFinite(price)) return servicePrices.ads.price;
  return Math.max(0, Math.min(50000, Math.round(price)));
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderProposalDocHtml(doc: ProposalDoc, baseUrl: string) {
  const sections = doc.sections
    .map(
      (section) => `
        <section style="border: 1px solid #d9e5e5; padding: 18px; margin-top: 16px;">
          <h2 style="margin: 0 0 10px; color: #061314; font-size: 18px;">${escapeHtml(section.heading)}</h2>
          ${section.body
            .map((paragraph) => `<p style="color: #536366; line-height: 1.6; margin: 12px 0 0;">${escapeHtml(paragraph)}</p>`)
            .join("")}
        </section>
      `,
    )
    .join("");

  return `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${escapeHtml(doc.title)} - Project One Roofing Proposal</title>
      </head>
      <body style="margin: 0; background: #f4f8f8; font-family: Arial, sans-serif; color: #061314;">
        <main style="max-width: 760px; margin: 0 auto; padding: 32px 20px;">
          <div style="background: #ffffff; border: 1px solid #d9e5e5; padding: 32px;">
            <p style="margin: 0 0 8px; color: #07877d; font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase;">Supporting Proposal Document</p>
            <h1 style="margin: 0; color: #061314; font-size: 32px;">${escapeHtml(doc.title)}</h1>
            <p style="color: #536366; line-height: 1.6;">${escapeHtml(doc.summary)}</p>
            ${sections}
            <p style="margin-top: 24px; color: #536366; line-height: 1.6;">
              Online copy: <a href="${escapeHtml(absoluteProposalDocUrl(baseUrl, doc.slug))}">${escapeHtml(absoluteProposalDocUrl(baseUrl, doc.slug))}</a>
            </p>
          </div>
        </main>
      </body>
    </html>`;
}

function signedProposalHtml({
  approvalId,
  signer,
  selectedServices,
  monthlyTotal,
  signedAt,
  baseUrl,
}: {
  approvalId: string;
  signer: Required<ProposalSignBody["signer"]>;
  selectedServices: SelectedService[];
  monthlyTotal: number;
  signedAt: string;
  baseUrl: string;
}) {
  const rows = selectedServices
    .map(
      (service) => `
        <tr>
          <td>${escapeHtml(service.title)}</td>
          <td>${formatCurrency(service.price)}/month</td>
        </tr>
      `,
    )
    .join("");
  const docLinks = proposalDocs
    .map(
      (doc) => `
        <li>
          <a href="${escapeHtml(absoluteProposalDocUrl(baseUrl, doc.slug))}" style="color: #07877d;">${escapeHtml(doc.title)}</a>
          <span style="color: #536366;"> - ${escapeHtml(doc.summary)}</span>
        </li>
      `,
    )
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; background: #f4f8f8; padding: 32px;">
      <div style="max-width: 720px; margin: 0 auto; background: #ffffff; border: 1px solid #d9e5e5; padding: 32px;">
        <p style="margin: 0 0 8px; color: #07877d; font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase;">
          Signed Proposal Approval
        </p>
        <h1 style="margin: 0; color: #061314; font-size: 32px;">Project One Roofing approved a starting scope.</h1>
        <p style="color: #536366; line-height: 1.6;">This was submitted from the Ghost AI Solutions proposal site.</p>
        <p style="color: #536366; line-height: 1.6;"><strong>Approval ID:</strong> ${escapeHtml(approvalId)}</p>

        <h2 style="margin-top: 28px; color: #061314; font-size: 18px;">Signer</h2>
        <p style="color: #536366; line-height: 1.6;">
          <strong>Name:</strong> ${escapeHtml(signer.name)}<br />
          <strong>Email:</strong> ${escapeHtml(signer.email)}<br />
          <strong>Title:</strong> ${escapeHtml(signer.title || "Not provided")}<br />
          <strong>Company:</strong> ${escapeHtml(signer.company || "Project One Roofing")}<br />
          <strong>Typed signature:</strong> ${escapeHtml(signer.signature)}<br />
          <strong>Signed at:</strong> ${escapeHtml(signedAt)}
        </p>

        <h2 style="margin-top: 28px; color: #061314; font-size: 18px;">Selected Monthly Scope</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="text-align: left; border-bottom: 1px solid #d9e5e5; padding: 10px 0; color: #536366;">Service</th>
              <th style="text-align: right; border-bottom: 1px solid #d9e5e5; padding: 10px 0; color: #536366;">Amount</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
          <tfoot>
            <tr>
              <td style="padding-top: 18px; font-weight: 700; color: #061314;">Monthly total</td>
              <td style="padding-top: 18px; text-align: right; font-weight: 700; color: #061314;">${formatCurrency(monthlyTotal)}</td>
            </tr>
          </tfoot>
        </table>

        <h2 style="margin-top: 28px; color: #061314; font-size: 18px;">Notes</h2>
        <p style="color: #536366; line-height: 1.6;">${escapeHtml(signer.notes || "None")}</p>

        <h2 style="margin-top: 28px; color: #061314; font-size: 18px;">Supporting Proposal Documents</h2>
        <p style="color: #536366; line-height: 1.6;">
          The signer had access to these supporting documents at approval. Copies are attached to this email.
        </p>
        <ul style="padding-left: 20px; color: #536366; line-height: 1.7;">${docLinks}</ul>
      </div>
    </div>
  `;
}

async function saveSignedProposal(record: SignedProposalRecord) {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("Missing DATABASE_URL server environment variable for signed proposal storage.");
  }

  const sql = neon(databaseUrl);

  await sql`
    create table if not exists proposal_approvals (
      id bigint generated by default as identity primary key,
      approval_id uuid not null unique,
      signer_name text not null,
      signer_email text not null,
      signer_title text,
      company text not null,
      typed_signature text not null,
      notes text,
      selected_services jsonb not null,
      monthly_total integer not null,
      signed_at timestamptz not null,
      email_id text,
      created_at timestamptz not null default now()
    )
  `;

  return sql`
    insert into proposal_approvals (
      approval_id,
      signer_name,
      signer_email,
      signer_title,
      company,
      typed_signature,
      notes,
      selected_services,
      monthly_total,
      signed_at,
      email_id
    )
    values (
      ${record.approval_id},
      ${record.signer_name},
      ${record.signer_email},
      ${record.signer_title},
      ${record.company},
      ${record.typed_signature},
      ${record.notes},
      ${JSON.stringify(record.selected_services)}::jsonb,
      ${record.monthly_total},
      ${record.signed_at},
      ${record.email_id || null}
    )
    returning *
  `;
}

async function updateSignedProposalEmailId(approvalId: string, emailId?: string) {
  if (!emailId) return;

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return;

  const sql = neon(databaseUrl);

  await sql`
    update proposal_approvals
    set email_id = ${emailId}
    where approval_id = ${approvalId}
  `;
}

async function notifyMissionControlApproval({
  approvalId,
  signer,
  selectedServices,
  monthlyTotal,
  signedAt,
}: {
  approvalId: string;
  signer: Required<ProposalSignBody["signer"]>;
  selectedServices: SelectedService[];
  monthlyTotal: number;
  signedAt: string;
}) {
  const endpoint =
    process.env.MISSION_CONTROL_PROPOSAL_WEBHOOK_URL ||
    "https://ghostmissioncontrol-production.up.railway.app/mission/client-portal/marketing-proposal-approval";
  const secret = process.env.MISSION_CONTROL_PROPOSAL_WEBHOOK_SECRET || "";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (secret) {
    headers["x-ghost-webhook-secret"] = secret;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      approvalId,
      signer,
      selectedServices,
      monthlyTotal,
      signedAt,
    }),
  });

  const text = await response.text();
  let payload: { ok?: boolean; error?: string; clientId?: string; inviteKey?: string } | null = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = null;
  }

  if (!response.ok || !payload?.ok) {
    throw new Error(payload?.error || text || "Unable to register approval with Mission Control.");
  }

  return payload;
}

export async function POST(request: Request) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const proposalTo = process.env.PROPOSAL_TO_EMAIL || "hello@ghostaisolutions.com";
  const proposalFrom = process.env.PROPOSAL_FROM_EMAIL || "Ghost AI Solutions <onboarding@resend.dev>";

  if (!resendApiKey) {
    return NextResponse.json(
      { error: "Missing RESEND_API_KEY server environment variable." },
      { status: 500 },
    );
  }

  let body: ProposalSignBody;
  try {
    body = (await request.json()) as ProposalSignBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const signer = {
    name: body.signer?.name?.trim() || "",
    email: body.signer?.email?.trim() || "",
    title: body.signer?.title?.trim() || "",
    company: body.signer?.company?.trim() || "Project One Roofing",
    signature: body.signer?.signature?.trim() || "",
    notes: body.signer?.notes?.trim() || "",
  };

  if (!signer.name || !signer.email || !signer.signature) {
    return NextResponse.json(
      { error: "Signer name, email, and typed signature are required." },
      { status: 400 },
    );
  }

  const selectedServices = (body.selectedServices || [])
    .map((service) => {
      const source = servicePrices[service.id];
      if (!source) return null;

      const price = service.id === "ads" ? normalizePaidCampaignPrice(service.price) : source.price;
      return { id: service.id, title: source.title, price };
    })
    .filter((service): service is SelectedService => Boolean(service));

  if (selectedServices.length === 0) {
    return NextResponse.json({ error: "Select at least one service." }, { status: 400 });
  }

  const monthlyTotal = selectedServices.reduce((total, service) => total + service.price, 0);
  const approvalId = crypto.randomUUID();
  const signedAt = new Date().toISOString();
  const signedAtDisplay = new Date(signedAt).toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  });
  const requestOrigin = new URL(request.url).origin;
  const proposalBaseUrl = process.env.NEXT_PUBLIC_PROPOSAL_BASE_URL || requestOrigin;

  const baseRecord: SignedProposalRecord = {
    approval_id: approvalId,
    signer_name: signer.name,
    signer_email: signer.email,
    signer_title: signer.title,
    company: signer.company,
    typed_signature: signer.signature,
    notes: signer.notes,
    selected_services: selectedServices,
    monthly_total: monthlyTotal,
    signed_at: signedAt,
  };

  try {
    await saveSignedProposal(baseRecord);
  } catch (storageError) {
    return NextResponse.json(
      {
        error: storageError instanceof Error ? storageError.message : "Unable to save signed proposal record.",
      },
      { status: 500 },
    );
  }

  let missionControl;
  try {
    missionControl = await notifyMissionControlApproval({
      approvalId,
      signer,
      selectedServices,
      monthlyTotal,
      signedAt,
    });
  } catch (missionControlError) {
    return NextResponse.json(
      {
        error:
          missionControlError instanceof Error
            ? missionControlError.message
            : "Unable to register approval with Mission Control.",
      },
      { status: 502 },
    );
  }

  const resend = new Resend(resendApiKey);
  const html = signedProposalHtml({
    approvalId,
    signer,
    selectedServices,
    monthlyTotal,
    signedAt: signedAtDisplay,
    baseUrl: proposalBaseUrl,
  });
  const attachments = proposalDocs.map((doc) => ({
    filename: doc.filename,
    content: renderProposalDocHtml(doc, proposalBaseUrl),
    contentType: "text/html",
  }));

  const { data, error } = await resend.emails.send({
    from: proposalFrom,
    to: [proposalTo, signer.email],
    replyTo: signer.email,
    subject: `Signed Project One Roofing Proposal - ${formatCurrency(monthlyTotal)}/mo`,
    html,
    attachments,
  });

  if (error) {
    return NextResponse.json({ error: error.message || "Resend failed to send email." }, { status: 502 });
  }

  await updateSignedProposalEmailId(approvalId, data?.id);

  return NextResponse.json({ id: data?.id, approvalId, monthlyTotal, stored: true, missionControl });
}
