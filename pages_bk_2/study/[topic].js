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

// This function gets called at build time
export async function getStaticPaths() {
  // Get the list of all topic paths
  const paths = topics.map((topic) => ({
    params: { topic: topic.name.toLowerCase() },
  }));

  return { paths, fallback: true };
}

// This function gets called at build time on server-side.
export async function getStaticProps({ params }) {
  try {
    const { topic } = params;
    
    if (!topic) {
      return {
        props: {
          topicData: null,
          contents: []
        }
      };
    }
    
    const topicData = topics.find(t => t.name.toLowerCase() === topic.toLowerCase());
    
    if (!topicData) {
      return {
        props: {
          topicData: null,
          contents: []
        },
        notFound: true
      };
    }
    
    // Convert topicData to a serializable object
    const serializedTopicData = JSON.parse(JSON.stringify(topicData));
    
    const folderPath = path.join(process.cwd(), topicData.folder);
    let files = [];
    let contents = [];
    
    if (fs.existsSync(folderPath)) {
      files = fs.readdirSync(folderPath).filter(f => f.endsWith('.md'));
      
      contents = files.map(file => {
        const filePath = path.join(folderPath, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        return { file, html: marked(content) };
      });
    }
    
    return {
      props: {
        topicData: serializedTopicData,
        contents
      },
      // Re-generate at most once per day
      revalidate: 86400
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: {
        topicData: null,
        contents: []
      },
      revalidate: 60 // Try again after 1 minute on error
    };
  }
}