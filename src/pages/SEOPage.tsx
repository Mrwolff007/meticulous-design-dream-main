import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import PageTransition from "@/components/PageTransition";

const SEOPage = () => {
  const { slug } = useParams();

  return (
    <Layout>
      <PageTransition>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white">
              {slug && slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ')}
            </h1>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-8 shadow-md">
              <p className="text-slate-600 dark:text-slate-300">
                This is the SEO page for: {slug}
              </p>
              <p className="text-slate-500 dark:text-slate-400 mt-4">
                Add your custom content here for this page.
              </p>
            </div>
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default SEOPage;
