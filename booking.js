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
      <span class="cover-hint">Tap a card to peek inside</span>
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

// Chạm vào mép card: card trồi lên cho xem thông tin. Chạm lần nữa vào card đang trồi: sang trang đặt lịch
function dropCards(scope = list) {
  scope.querySelectorAll('.book-card.lifted').forEach((c) => c.classList.remove('lifted'));
  scope.querySelectorAll('.topic.has-lifted').forEach((t) => t.classList.remove('has-lifted'));
}

list.addEventListener('click', (e) => {
  const card = e.target.closest('.book-card');
  if (!card || card.classList.contains('lifted')) return;
  e.preventDefault();
  dropCards();
  card.classList.add('lifted');
  card.closest('.topic').classList.add('has-lifted');
});

// chạm ra ngoài thì card hạ xuống lại
document.addEventListener('click', (e) => {
  if (!e.target.closest('.book-card')) dropCards();
});
