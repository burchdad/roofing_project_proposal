import { NextResponse } from "next/server";
import { Resend } from "resend";

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
  local: { title: "Local Search", price: 1100 },
  ads: { title: "Paid Campaigns", price: 2200 },
  social: { title: "Social Distribution", price: 900 },
  reviews: { title: "Reputation Proof", price: 650 },
  geo: { title: "AI Search Visibility", price: 650 },
  reporting: { title: "Reporting", price: 400 },
};

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

function signedProposalHtml({
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
      </div>
    </div>
  `;
}

async function saveSignedProposal(record: SignedProposalRecord) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const table = process.env.PROPOSAL_APPROVALS_TABLE || "proposal_approvals";

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY for signed proposal storage.");
  }

  const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(record),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Unable to save signed proposal record: ${message}`);
  }

  return response.json();
}

async function updateSignedProposalEmailId(approvalId: string, emailId?: string) {
  if (!emailId) return;

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const table = process.env.PROPOSAL_APPROVALS_TABLE || "proposal_approvals";

  if (!supabaseUrl || !serviceRoleKey) return;

  await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/${table}?approval_id=eq.${approvalId}`, {
    method: "PATCH",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email_id: emailId }),
  });
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
      return source ? { id: service.id, title: source.title, price: source.price } : null;
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

  const resend = new Resend(resendApiKey);
  const html = signedProposalHtml({
    approvalId,
    signer,
    selectedServices,
    monthlyTotal,
    signedAt: signedAtDisplay,
  });

  const { data, error } = await resend.emails.send({
    from: proposalFrom,
    to: [proposalTo, signer.email],
    replyTo: signer.email,
    subject: `Signed Project One Roofing Proposal - ${formatCurrency(monthlyTotal)}/mo`,
    html,
  });

  if (error) {
    return NextResponse.json({ error: error.message || "Resend failed to send email." }, { status: 502 });
  }

  await updateSignedProposalEmailId(approvalId, data?.id);

  return NextResponse.json({ id: data?.id, approvalId, monthlyTotal, stored: true });
}
