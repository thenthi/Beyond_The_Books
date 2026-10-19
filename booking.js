const list = document.querySelector('#topic-list');

// Trang trí: mỗi bìa có một bó hoa lá (do nhóm thiết kế) ló ra từ sau góc dưới, xen kẽ trái/phải.
// Bìa màu cam → hoa vàng, các bìa khác → hoa cam để nổi bật.
const WARM = ['#f28b75'];
function bouquet(topic, t) {
  const side = t % 2 === 0 ? 'left' : 'right';
  const [big, small] = WARM.includes(topic.color) ? [[1, 6], [3, 1]][t % 2] : [[5, 4], [2, 5]][t % 2];
  return `
    <div class="bouquet ${side}" aria-hidden="true">
      <img class="bq-leaf l1" src="assets/leaf-2.svg" alt="" />
      <img class="bq-leaf l2" src="assets/leaf-1.svg" alt="" />
      <img class="bq-flower big" src="assets/flower-${big}.svg" alt="" />
      <img class="bq-flower small" src="assets/flower-${small}.svg" alt="" />
    </div>`;
}

// Ong, bướm bay ở khoảng trống giữa vài bìa (bên đối diện với bó hoa)
const FLYERS = {
  1: '<img class="flyer bee left" src="assets/bee.svg" alt="" aria-hidden="true" />',
  3: '<svg class="flyer fly left" viewBox="0 0 40 32" aria-hidden="true"><use href="#butterfly" /></svg>',
  4: '<img class="flyer bee right" src="assets/bee.svg" alt="" aria-hidden="true" />',
};

// Mỗi topic là một "bìa"; bấm vào thì các card Living Book trồi lên từ trong bìa
list.innerHTML = TOPICS.map((topic, t) => `
  <article class="topic" style="--topic-color: ${topic.color}; --topic-ink: ${topic.ink || '#1f2a27'}">
    <div class="deck-wrap" id="deck-${topic.id}">
      <div class="deck-inner">
        <div class="deck">
          ${topic.people.map((p, i) => `
            <a class="book-card${p.card ? ' has-image' : ''}" href="detail.html?topic=${topic.id}&person=${i}" style="--i: ${i}">
              ${p.card ? `
              <img class="card-img" src="${p.card}" alt="${p.name}. ${p.role}. ${p.bio}" />
              <span class="card-book">Book →</span>` : `
              <span class="avatar">${AVATAR_SVG}</span>
              <span class="card-text">
                <span class="card-label">Info</span>
                <span class="person-name">${p.name}</span>
                <span class="person-role">${p.role}</span>
                <span class="person-bio">${p.bio}</span>
                <span class="person-go">Book →</span>
              </span>`}
            </a>`).join('')}
        </div>
      </div>
    </div>
    <button class="cover" aria-expanded="false" aria-controls="deck-${topic.id}">
      <span class="cover-title">${topic.title}</span>
      <span class="cover-count">${topic.people.length} Living Book${topic.people.length === 1 ? '' : 's'}</span>
      <span class="cover-hint">Tap a card to peek inside</span>
    </button>
    ${bouquet(topic, t)}
    ${FLYERS[t] || ''}
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
  scope.querySelectorAll('.book-card.lifted, .book-card.behind').forEach((c) => c.classList.remove('lifted', 'behind'));
  scope.querySelectorAll('.topic.has-lifted').forEach((t) => t.classList.remove('has-lifted'));
}

list.addEventListener('click', (e) => {
  const card = e.target.closest('.book-card');
  if (!card || card.classList.contains('lifted')) return;
  e.preventDefault();
  dropCards();
  card.classList.add('lifted');
  card.closest('.topic').classList.add('has-lifted');
  // các card nằm sau cũng nhô lên theo để mép của chúng vẫn ló ra phía trên
  let prev = card.previousElementSibling;
  while (prev) {
    prev.classList.add('behind');
    prev = prev.previousElementSibling;
  }
});

// chạm ra ngoài thì card hạ xuống lại
document.addEventListener('click', (e) => {
  if (!e.target.closest('.book-card')) dropCards();
});

// Tìm Living Book theo tên, topic, nghề hoặc giới thiệu. Đang tìm thì ẩn các bìa topic.
const searchInput = document.querySelector('#search');
const results = document.querySelector('#search-results');
const ALL_PEOPLE = TOPICS.flatMap((topic) => topic.people.map((p, i) => ({ topic, p, i })));
const norm = (v) => v.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

searchInput.addEventListener('input', () => {
  const q = norm(searchInput.value.trim());
  list.hidden = Boolean(q);
  results.hidden = !q;
  if (!q) return;

  const found = ALL_PEOPLE.filter(({ topic, p }) =>
    norm(`${p.name} ${p.role} ${p.bio} ${topic.title}`).includes(q));

  results.innerHTML = found.length
    ? found.map(({ topic, p, i }) => `
      <a class="result-card" href="detail.html?topic=${topic.id}&person=${i}" style="--topic-color: ${topic.color}; --topic-ink: ${topic.ink || '#1f2a27'}">
        <span class="avatar">${AVATAR_SVG}</span>
        <span class="result-text">
          <span class="result-topic">${topic.title}</span>
          <span class="person-name">${p.name}</span>
          <span class="person-role">${p.role}</span>
        </span>
        <span class="result-go" aria-hidden="true">→</span>
      </a>`).join('')
    : '<p class="search-empty">No Living Books found. Try another name or topic.</p>';
});
