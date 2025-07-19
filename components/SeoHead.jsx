import Head from "next/head";

export default function SeoHead({
  title = "CertifiedSkill.org | Free Certification Exams",
  description = "Get free, industry-recognized certifications. Take online exams, earn certificates, and advance your career with CertifiedSkill.org.",
  canonical = "https://certifiedskill.org/",
  image = "https://certifiedskill.org/og-image-faq.jpg",
  children,
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {/* OpenGraph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={image} />
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {/* Organization JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "CertifiedSkill.org",
            url: "https://certifiedskill.org/",
            logo: "https://certifiedskill.org/ChatGPT%20Image%20Jul%2019,%202025,%2001_06_54%20PM.png",
            sameAs: [
              "https://linkedin.com/company/certifiedskill",
              "https://twitter.com/certifiedskill"
            ]
          }),
        }}
      />
      {children}
    </Head>
  );
} 