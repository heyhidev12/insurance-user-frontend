export const useRouter = () => ({
  push: (url: string) => console.log('Navigate to:', url),
  replace: (url: string) => console.log('Replace with:', url),
  back: () => console.log('Go back'),
  forward: () => console.log('Go forward'),
  refresh: () => console.log('Refresh'),
  prefetch: () => Promise.resolve(),
});

export const usePathname = () => '/';

export const useSearchParams = () => new URLSearchParams();

export const useParams = () => ({});

export const redirect = (url: string) => console.log('Redirect to:', url);

export const notFound = () => console.log('Not found');
