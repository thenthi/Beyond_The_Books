const list = document.querySelector('#topic-list');

// Mỗi topic là một "bìa"; bấm vào thì các card Living Book trồi lên từ trong bìa
list.innerHTML = TOPICS.map((topic) => `
  <article class="topic" style="--topic-color: ${topic.color}; --topic-ink: ${topic.ink || '#1f2a27'}">
    <div class="deck-wrap" id="deck-${topic.id}">
      <div class="deck-inner">
        <div class="deck">
          ${topic.people.map((p, i) => `
            <a class="book-card" href="detail.html?topic=${topic.id}&person=${i}" style="--i: ${i}">
              <span class="avatar">${AVATAR_SVG}</span>
              <span class="card-text">
                <span class="card-label">Info</span>
                <span class="person-name">${p.name}</span>
                <span class="person-role">${p.role}</span>
                <span class="person-bio">${p.bio}</span>
                <span class="person-go">Book →</span>
              </span>
            </a>`).join('')}
        </div>
      </div>
    </div>
    <button class="cover" aria-expanded="false" aria-controls="deck-${topic.id}">
      <span class="cover-title">${topic.title}</span>
      <span class="cover-count">${topic.people.length} Living Books</span>
    </button>
  </article>`).join('');

// Mở bìa này thì bìa đang mở trước đó thu lại
list.addEventListener('click', (e) => {
  const cover = e.target.closest('.cover');
  if (!cover) return;
  const topic = cover.parentElement;
  const willOpen = !topic.classList.contains('open');

  list.querySelectorAll('.topic.open').forEach((t) => {
    t.classList.remove('open');
    t.querySelector('.cover').setAttribute('aria-expanded', 'false');
  });

  if (willOpen) {
    topic.classList.add('open');
    cover.setAttribute('aria-expanded', 'true');
    setTimeout(() => topic.scrollIntoView({ behavior: 'smooth', block: 'start' }), 350);
  }
});

// Màn hình cảm ứng không có hover: chạm lần 1 cho card trồi lên, chạm lần 2 mới mở trang đặt lịch
if (window.matchMedia('(hover: none)').matches) {
  list.addEventListener('click', (e) => {
    const card = e.target.closest('.book-card');
    if (!card || card.classList.contains('lifted')) return;
    e.preventDefault();
    list.querySelectorAll('.book-card.lifted').forEach((c) => c.classList.remove('lifted'));
    card.classList.add('lifted');
  });
}
