import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Exam({ exam }) {
  const router = useRouter();

  return (
    <div style={{ padding: '20px' }}>
      <Head>
        <title>{exam.title}</title>
      </Head>
      <h1>{exam.title}</h1>
      {exam.questions.map((q, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <p>{q.questionText}</p>
        </div>
      ))}
    </div>
  );
}

export async function getServerSideProps({ params, req }) {
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host;
  const apiUrl = `${protocol}://${host}/api/exams/${params.id}`;

  const res = await fetch(apiUrl);

  if (!res.ok) {
    const errorText = await res.text();
    console.error("API error response:", errorText);
    return { notFound: true };
  }

  const exam = await res.json();
  return { props: { exam } };
}
