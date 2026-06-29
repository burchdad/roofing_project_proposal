export type ProposalDoc = {
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  filename: string;
  sections: {
    heading: string;
    body: string[];
  }[];
};

export const proposalDocs: ProposalDoc[] = [
  {
    slug: "scope-of-work",
    title: "Scope of Work",
    shortTitle: "Scope",
    summary: "What Ghost AI Solutions will deliver during the approved marketing support period.",
    filename: "project-one-scope-of-work.html",
    sections: [
      {
        heading: "Approved services",
        body: [
          "The approved proposal covers the services selected by Project One Roofing at the time of signature. Services may include photography, videography, drone capture, local search support, paid campaign support, social distribution, reputation proof, AI search visibility, and reporting.",
          "The selected monthly scope and monthly total shown in the signed proposal are the controlling commercial summary for this engagement.",
        ],
      },
      {
        heading: "Delivery rhythm",
        body: [
          "Ghost AI Solutions will organize the first phase around a practical 90-day motion: scope confirmation, content capture, campaign activation, distribution, reporting, and next-step recommendations.",
          "Exact production dates, shoot windows, posting cadence, ad launch timing, and reporting dates depend on access, approvals, weather, jobsite availability, client responsiveness, and platform review times.",
        ],
      },
      {
        heading: "Out of scope unless added",
        body: [
          "This proposal does not include full website rebuilds, custom software, CRM rebuilds, long-form brand strategy, legal review, media buying above the approved ad budget, or unlimited revisions unless separately approved in writing.",
          "Additional services can be added by written approval, updated proposal, invoice, or client portal approval.",
        ],
      },
    ],
  },
  {
    slug: "payment-and-billing",
    title: "Payment and Billing Terms",
    shortTitle: "Payment",
    summary: "How billing, payment timing, ad spend, and late changes are handled.",
    filename: "project-one-payment-and-billing.html",
    sections: [
      {
        heading: "Monthly billing",
        body: [
          "The approved monthly total is billed as a recurring monthly marketing support amount unless Ghost AI Solutions and Project One Roofing agree otherwise in writing.",
          "Invoices are due according to the payment terms listed on the invoice. Work may be paused if an invoice becomes overdue.",
        ],
      },
      {
        heading: "Paid campaign budget",
        body: [
          "If paid campaigns are selected, the approved campaign amount represents the planned monthly allocation for campaign support and media budget as presented in the proposal.",
          "Platform spend, campaign pacing, and ad delivery can vary based on platform policies, audience size, competition, seasonality, and creative approval timelines.",
        ],
      },
      {
        heading: "Refunds and cancellations",
        body: [
          "Completed strategy, planning, setup, creative production, published work, platform labor, and campaign management time are not refundable once performed.",
          "Either party may request changes to future monthly scope in writing before the next billing cycle. Any cancellation or pause should be confirmed in writing so campaign assets and active work can be closed out cleanly.",
        ],
      },
    ],
  },
  {
    slug: "client-responsibilities",
    title: "Client Responsibilities",
    shortTitle: "Client Duties",
    summary: "What Project One Roofing needs to provide so Ghost can deliver quickly.",
    filename: "project-one-client-responsibilities.html",
    sections: [
      {
        heading: "Access and approvals",
        body: [
          "Project One Roofing is responsible for providing timely access to brand assets, jobsite details, contact points, platform permissions, existing accounts, and approval contacts needed for execution.",
          "Delays in access, feedback, or approvals may shift delivery dates, campaign launch dates, and reporting timelines.",
        ],
      },
      {
        heading: "Jobsite coordination",
        body: [
          "For photography, video, or drone capture, Project One Roofing will help coordinate jobsite availability, crew visibility, homeowner or property permissions where needed, and practical safety requirements.",
          "Drone capture is subject to weather, airspace, property access, local restrictions, and pilot safety judgment.",
        ],
      },
      {
        heading: "Content accuracy",
        body: [
          "Project One Roofing is responsible for reviewing business claims, service claims, pricing claims, licensing claims, warranty language, and any regulated or legally sensitive statements before publication.",
          "Ghost AI Solutions can help package and publish marketing content, but Project One Roofing remains responsible for final factual accuracy of company-specific claims.",
        ],
      },
    ],
  },
  {
    slug: "change-requests",
    title: "Change Requests and Revisions",
    shortTitle: "Changes",
    summary: "How revisions, added scope, and new requests are handled after approval.",
    filename: "project-one-change-requests.html",
    sections: [
      {
        heading: "Normal revisions",
        body: [
          "Reasonable revisions are included when they relate directly to the approved monthly scope and are requested during the active production or review window.",
          "Revision requests should be consolidated when possible so Ghost AI Solutions can move work forward efficiently.",
        ],
      },
      {
        heading: "Scope changes",
        body: [
          "New deliverables, new campaigns, additional shoot days, expanded editing, extra platforms, website work, CRM work, or strategic pivots outside the approved scope may require an added estimate, invoice, or updated proposal.",
          "Ghost AI Solutions will identify material scope changes before performing work that would materially increase cost.",
        ],
      },
      {
        heading: "Approval windows",
        body: [
          "When content, campaign assets, or reports are delivered for review, timely feedback helps protect the production calendar and campaign pacing.",
          "If no feedback is received within the requested review window, Ghost AI Solutions may proceed based on the most recent approved direction or pause the item until feedback is received.",
        ],
      },
    ],
  },
  {
    slug: "service-terms",
    title: "Service Terms",
    shortTitle: "Terms",
    summary: "General service terms for marketing, creative, reporting, and platform-dependent work.",
    filename: "project-one-service-terms.html",
    sections: [
      {
        heading: "No guaranteed outcomes",
        body: [
          "Ghost AI Solutions will use commercially reasonable skill and effort to improve marketing assets, visibility, campaign quality, and reporting clarity.",
          "Marketing results are influenced by market demand, offer strength, seasonality, sales follow-up, competition, platform policies, budgets, and other factors outside Ghost AI Solutions' control. Specific leads, revenue, rankings, reach, or conversions are not guaranteed.",
        ],
      },
      {
        heading: "Platform dependencies",
        body: [
          "Google, Meta, YouTube, social networks, ad platforms, analytics tools, search systems, and AI answer engines can change policies, visibility, pricing, attribution, account access, and delivery behavior at any time.",
          "Ghost AI Solutions is not responsible for outages, account restrictions, policy decisions, review delays, reporting gaps, or platform changes outside its direct control.",
        ],
      },
      {
        heading: "Ownership and usage",
        body: [
          "Upon full payment for the relevant work, Project One Roofing may use approved final creative deliverables for its own business marketing. Ghost AI Solutions may retain internal working files, process notes, templates, and reusable methods.",
          "Ghost AI Solutions may reference non-confidential completed work in portfolio or case-study materials unless Project One Roofing requests otherwise in writing.",
        ],
      },
      {
        heading: "Relationship to full agreement",
        body: [
          "These supporting documents are intended to clarify the approved proposal. If a later signed master services agreement or mutually approved written agreement conflicts with these terms, the later signed agreement controls for the conflicting item.",
        ],
      },
    ],
  },
];

export function getProposalDoc(slug: string) {
  return proposalDocs.find((doc) => doc.slug === slug);
}

export function absoluteProposalDocUrl(baseUrl: string, slug: string) {
  return `${baseUrl.replace(/\/+$/, "")}/docs/${slug}`;
}

