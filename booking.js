const list = document.querySelector('#topic-list');

list.innerHTML = TOPICS.map((topic) => `
  <article class="topic" style="--topic-color: ${topic.color}">
    <button class="topic-head" aria-expanded="false" aria-controls="panel-${topic.id}">
      <span class="topic-name">${topic.title}</span>
      <span class="topic-count">${topic.people.length} people</span>
    </button>
    <div class="topic-panel" id="panel-${topic.id}">
      <div class="topic-panel-inner">
        <div class="people-scroll">
          ${topic.people.map((p, i) => `
            <a class="person-card" href="detail.html?topic=${topic.id}&person=${i}">
              <span class="avatar">${AVATAR_SVG}</span>
              <span class="person-name">${p.name}</span>
              <span class="person-role">${p.role}</span>
              <span class="person-bio">${p.bio}</span>
              <span class="person-go">Book →</span>
            </a>`).join('')}
        </div>
      </div>
    </div>
  </article>`).join('');

// Accordion: mở topic này thì topic trước thu lại
list.addEventListener('click', (e) => {
  const head = e.target.closest('.topic-head');
  if (!head) return;
  const topic = head.parentElement;
  const willOpen = !topic.classList.contains('open');

  list.querySelectorAll('.topic.open').forEach((t) => {
    t.classList.remove('open');
    t.querySelector('.topic-head').setAttribute('aria-expanded', 'false');
  });

  if (willOpen) {
    topic.classList.add('open');
    head.setAttribute('aria-expanded', 'true');
    setTimeout(() => topic.scrollIntoView({ behavior: 'smooth', block: 'start' }), 320);
  }
});
