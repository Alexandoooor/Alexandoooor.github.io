---
layout: default
title: Posts
---

## All Posts

<div class="posts">
{% for post in site.posts %}
  <article>
    <div class="post-date">{{ post.date | date: "%B %d, %Y" }}</div>
    <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
    <p class="post-excerpt">{{ post.excerpt | strip_html | truncatewords: 40 }}</p>
  </article>
{% endfor %}
</div>
