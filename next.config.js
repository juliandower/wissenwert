import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Uncomment the lines below to enable static export for integration:
  // output: 'export',
  // basePath: '/quiz',
  // trailingSlash: true,
};

export default withNextIntl(nextConfig);

