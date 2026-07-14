export const SITE = {
  title: 'Alexander Magnusson',
  description: 'Software Engineer',
  author: {
    name: 'Alexander Magnusson',
    email: 'magnusson.alex@gmail.com',
    github: 'Alexandoooor',
    linkedin: 'alexander-magnusson-0233a4114',
  },
} as const;

export const POSTS_PER_PAGE = 5;

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
