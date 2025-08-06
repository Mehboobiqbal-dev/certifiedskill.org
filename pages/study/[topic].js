import { useRouter } from 'next/router';
import fs from 'fs';
import path from 'path';
import marked from 'marked';
import { topicsToScrape } from '../../config/config.js';

export default function StudyTopic() {
  const router = useRouter();
  const { topic } = router.query;

  const topicData = topicsToScrape.find(t => t.name.toLowerCase() === topic?.toLowerCase());
  if (!topicData) return <p>Topic not found</p>;

  const folderPath = path.join(process.cwd(), topicData.folder);
  const files = fs.existsSync(folderPath) ? fs.readdirSync(folderPath).filter(f => f.endsWith('.md')) : [];

  const contents = files.map(file => {
    const filePath = path.join(folderPath, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    return { file, html: marked(content) };
  });

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