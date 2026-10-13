// Dữ liệu topic + người chia sẻ. Sửa / thêm ở đây, các trang tự cập nhật.
// color: màu bìa (theo palette) · ink: màu chữ trên bìa nếu bìa tối
// days: các thứ trong tuần có lịch (0 = CN, 1 = T2, ... 6 = T7)
const TOPICS = [
  {
    id: 'art',
    title: 'Art',
    color: '#f28b75',
    people: [
      { name: 'Linh Nguyen', role: 'Illustrator', bio: 'Illustrates children\'s books and loves telling stories in watercolour.', days: [2, 4, 6], times: ['11:00', '11:30', '12:00', '14:00'] },
      { name: 'Minh Tran', role: 'Ceramic artist', bio: 'Six years of handmade ceramics from a tiny studio in Da Lat.', days: [1, 3, 5], times: ['09:00', '10:00', '15:00', '15:30'] },
      { name: 'An Le', role: 'Art director', bio: 'Left advertising to chase oil painting full time.', days: [6, 0], times: ['10:00', '11:00', '16:00'] },
    ],
  },
  {
    id: 'cooking',
    title: 'Cooking',
    color: '#f3c969',
    people: [
      { name: 'Hoa Pham', role: 'Home cook', bio: 'Cooks her grandmother\'s recipes and the stories behind them.', days: [1, 3, 6], times: ['10:00', '10:30', '15:00'] },
      { name: 'Tuan Vo', role: 'Pastry chef', bio: 'Trained in Paris, now runs a small bakery in Saigon.', days: [2, 4], times: ['14:00', '14:30', '16:00'] },
    ],
  },
  {
    id: 'celebrity',
    title: 'Celebrity',
    color: '#a8bfa3',
    people: [
      { name: 'Quynh Do', role: 'Talk show host', bio: 'Ten years on TV — what fame looks like behind the camera.', days: [5, 6], times: ['18:00', '18:30', '19:00'] },
      { name: 'Bao Ly', role: 'Influencer', bio: 'Grew a following of 1M and learned to log off.', days: [0, 3], times: ['11:00', '12:00', '17:00'] },
    ],
  },
  {
    id: 'sport',
    title: 'Sport',
    color: '#304e63',
    ink: '#fff7ec',
    people: [
      { name: 'Khoa Dang', role: 'Marathon runner', bio: 'Ran his first marathon at 40 and never stopped.', days: [0, 6], times: ['07:00', '07:30', '08:00'] },
      { name: 'Lan Bui', role: 'Volleyball player', bio: 'Former national team player, now coaching kids.', days: [2, 4], times: ['16:00', '16:30', '17:00'] },
      { name: 'Nam Ho', role: 'Climber', bio: 'Climbs limestone cliffs and talks about fear.', days: [6], times: ['09:00', '09:30', '10:00'] },
    ],
  },
  {
    id: 'fashion',
    title: 'Fashion',
    color: '#f28b75',
    people: [
      { name: 'Vy Ngo', role: 'Stylist', bio: 'Styles shoots for magazines and loves thrifted finds.', days: [1, 5], times: ['13:00', '13:30', '14:00'] },
      { name: 'Thao Le', role: 'Fashion designer', bio: 'Built a slow-fashion label from her bedroom.', days: [3, 6], times: ['10:00', '11:00', '15:00'] },
    ],
  },
  {
    id: 'film',
    title: 'Film',
    color: '#f3c969',
    people: [
      { name: 'Duc Lam', role: 'Director', bio: 'Makes short films on a tiny budget and big dreams.', days: [2, 5], times: ['19:00', '19:30', '20:00'] },
      { name: 'Mai Tran', role: 'Film critic', bio: 'Watches 300 films a year and writes about the best ones.', days: [0, 4], times: ['15:00', '16:00', '17:00'] },
    ],
  },
];

const AVATAR_SVG =
  '<svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="30" r="14"/><path d="M12 80c2-19 14-29 28-29s26 10 28 29"/></svg>';

function findBooking(params) {
  const topic = TOPICS.find((t) => t.id === params.get('topic'));
  const person = topic && topic.people[Number(params.get('person'))];
  return person ? { topic, person } : null;
}
