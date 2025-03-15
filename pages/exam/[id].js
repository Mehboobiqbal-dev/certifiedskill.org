import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
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

export async function getServerSideProps({ params }) {
  const res = await fetch(`https://3000-idx-get-certified-1742011310099.cluster-nx3nmmkbnfe54q3dd4pfbgilpc.cloudworkstations.dev/api/exams/${params.id}`);
  const exam = await res.json();
  return { props: { exam } };
}
