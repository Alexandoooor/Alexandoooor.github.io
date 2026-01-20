---
layout: default
---

## Recent Posts

<div class="posts">
{% for post in site.posts limit:3 %}
  <article>
    <div class="post-date">{{ post.date | date: "%B %d, %Y" }}</div>
    <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
    <p class="post-excerpt">{{ post.excerpt | strip_html | truncatewords: 40 }}</p>
  </article>
{% endfor %}
</div>


## Projects

<div class="projects">
{% for project in site.data.projects %}
  <div class="project-card">
    {% if project.url %}
    <div class="project-title"><a href="{{ project.url }}">{{ project.name }}</a></div>
    {% else %}
    <div class="project-title">{{ project.name }}</div>
    {% endif %}
    <p class="project-desc">{{ project.description }}</p>
    <div class="project-tags">
      {% for tag in project.tags %}
      <span class="tag">{{ tag }}</span>
      {% endfor %}
    </div>
  </div>
{% endfor %}
</div>
