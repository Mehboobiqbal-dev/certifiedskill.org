import { useRouter } from 'next/router';
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import topics from '../../config/config.js';

export default function StudyTopic({ topicData, contents }) {
  const router = useRouter();
  
  // Show loading state during fallback
  if (router.isFallback) {
    return <p>Loading...</p>;
  }
  
  // Handle case when topic is not found
  if (!topicData) {
    return <p>Topic not found</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">{topicData.name} Study Materials</h1>
      {contents.map(({ file, html }) => (
        <div key={file} className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">{file.replace('.md', '')}</h2>
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      ))}
    </div>
  );
}