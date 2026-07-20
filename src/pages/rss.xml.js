import rss from '@astrojs/rss';
import { getSortedPosts } from '../lib/posts';
import { SITE } from '../consts';

export async function GET(context) {
  const posts = await getSortedPosts();
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      link: `/posts/${post.id}/`,
    })),
  });
}
