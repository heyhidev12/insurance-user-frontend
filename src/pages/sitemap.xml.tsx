import { GetServerSideProps } from 'next';

const Sitemap = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res, req }) => {
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host || 'localhost:3000';
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`;

  // Static pages
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'daily' }, // Home
    { url: '/experts', priority: '0.9', changefreq: 'weekly' },
    { url: '/education', priority: '0.9', changefreq: 'weekly' },
    { url: '/insights', priority: '0.9', changefreq: 'weekly' },
    { url: '/history', priority: '0.8', changefreq: 'monthly' },
    { url: '/consultation/apply', priority: '0.7', changefreq: 'monthly' },
    { url: '/my', priority: '0.6', changefreq: 'monthly' },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;
