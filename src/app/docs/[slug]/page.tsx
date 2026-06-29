import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";
import { getProposalDoc, proposalDocs } from "@/lib/proposalDocs";

export function generateStaticParams() {
  return proposalDocs.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getProposalDoc(slug);

  return {
    title: doc ? `${doc.title} | Project One Roofing Proposal` : "Proposal Document",
    description: doc?.summary || "Supporting document for the Project One Roofing proposal.",
  };
}

export default async function ProposalDocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getProposalDoc(slug);

  if (!doc) notFound();

  return (
    <main className="proposal-shell min-h-screen px-5 py-10">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/#investment"
          className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-[#d7e6e8] transition hover:border-[#27f2df]/50 hover:text-[#27f2df]"
        >
          <ArrowLeft size={16} />
          Back to proposal
        </Link>

        <article className="mt-8 overflow-hidden rounded-lg border border-white/10 bg-[#071214]/88 shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
          <div className="border-b border-white/10 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-[#27f2df]/10 text-[#27f2df]">
                <FileText size={22} />
              </span>
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#27f2df]">Supporting document</p>
                <h1 className="mt-3 text-4xl font-semibold leading-tight text-white sm:text-5xl">{doc.title}</h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-[#a9bdc0]">{doc.summary}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-6 sm:p-8">
            {doc.sections.map((section) => (
              <section key={section.heading} className="rounded-lg border border-white/10 bg-black/20 p-5">
                <h2 className="text-2xl font-semibold text-white">{section.heading}</h2>
                <div className="mt-4 grid gap-4">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="leading-7 text-[#a9bdc0]">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>
      </div>
    </main>
  );
}
