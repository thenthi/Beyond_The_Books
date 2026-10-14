// Dữ liệu topic + người chia sẻ. Sửa / thêm ở đây, các trang tự cập nhật.
// color: màu bìa (theo palette) · ink: màu chữ trên bìa nếu bìa tối
const TOPICS = [
  {
    id: 'art',
    title: 'Art',
    color: '#f28b75',
    people: [
      { name: 'Linh Nguyen', role: 'Illustrator', bio: 'Illustrates children\'s books and loves telling stories in watercolour.' },
      { name: 'Minh Tran', role: 'Ceramic artist', bio: 'Six years of handmade ceramics from a tiny studio in Da Lat.' },
      { name: 'An Le', role: 'Art director', bio: 'Left advertising to chase oil painting full time.' },
    ],
  },
  {
    id: 'cooking',
    title: 'Cooking',
    color: '#f3c969',
    people: [
      { name: 'Hoa Pham', role: 'Home cook', bio: 'Cooks her grandmother\'s recipes and the stories behind them.' },
      { name: 'Tuan Vo', role: 'Pastry chef', bio: 'Trained in Paris, now runs a small bakery in Saigon.' },
    ],
  },
  {
    id: 'celebrity',
    title: 'Celebrity',
    color: '#a8bfa3',
    people: [
      { name: 'Quynh Do', role: 'Talk show host', bio: 'Ten years on TV — what fame looks like behind the camera.' },
      { name: 'Bao Ly', role: 'Influencer', bio: 'Grew a following of 1M and learned to log off.' },
    ],
  },
  {
    id: 'sport',
    title: 'Sport',
    color: '#304e63',
    ink: '#fff7ec',
    people: [
      { name: 'Khoa Dang', role: 'Marathon runner', bio: 'Ran his first marathon at 40 and never stopped.' },
      { name: 'Lan Bui', role: 'Volleyball player', bio: 'Former national team player, now coaching kids.' },
      { name: 'Nam Ho', role: 'Climber', bio: 'Climbs limestone cliffs and talks about fear.' },
    ],
  },
  {
    id: 'fashion',
    title: 'Fashion',
    color: '#f28b75',
    people: [
      { name: 'Vy Ngo', role: 'Stylist', bio: 'Styles shoots for magazines and loves thrifted finds.' },
      { name: 'Thao Le', role: 'Fashion designer', bio: 'Built a slow-fashion label from her bedroom.' },
    ],
  },
  {
    id: 'film',
    title: 'Film',
    color: '#f3c969',
    people: [
      { name: 'Duc Lam', role: 'Director', bio: 'Makes short films on a tiny budget and big dreams.' },
      { name: 'Mai Tran', role: 'Film critic', bio: 'Watches 300 films a year and writes about the best ones.' },
    ],
  },
];

// Mã riêng cho mỗi Living Book (dùng để lưu lịch đặt trên Google Sheet), vd "art-linh-nguyen".
// Đừng đổi tên người khi đã có người đặt lịch, hoặc tự ghi id cố định: { id: 'art-linh', name: ... }
TOPICS.forEach((topic) => topic.people.forEach((p) => {
  p.id = p.id || `${topic.id}-${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}));

const AVATAR_SVG =
  '<svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="30" r="14"/><path d="M12 80c2-19 14-29 28-29s26 10 28 29"/></svg>';

function findBooking(params) {
  const topic = TOPICS.find((t) => t.id === params.get('topic'));
  const person = topic && topic.people[Number(params.get('person'))];
  return person ? { topic, person } : null;
}
