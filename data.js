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
    id: 'music',
    title: 'Music',
    color: '#f3c969',
    people: [
      { name: 'Huy Pham', role: 'Producer', bio: 'Produces indie music and talks about learning it all by ear.', days: [1, 2, 3], times: ['19:00', '19:30', '20:00'] },
      { name: 'Mai Vo', role: 'Pianist', bio: 'Ten years teaching piano — believes anyone can start.', days: [4, 5], times: ['11:00', '11:30', '12:00', '12:30'] },
    ],
  },
  {
    id: 'tech',
    title: 'Tech',
    color: '#a8bfa3',
    people: [
      { name: 'Khoa Dang', role: 'Software engineer', bio: 'Switched from economics to coding at 27.', days: [2, 4], times: ['18:00', '18:30', '19:00'] },
      { name: 'Thao Bui', role: 'Product designer', bio: 'Designs apps for startups and loves simple things.', days: [1, 3, 5], times: ['12:00', '12:30', '13:00'] },
      { name: 'Nam Ho', role: 'Data scientist', bio: 'Turns dry numbers into stories.', days: [6], times: ['09:00', '09:30', '10:00', '10:30'] },
    ],
  },
  {
    id: 'travel',
    title: 'Travel',
    color: '#304e63',
    ink: '#fff7ec',
    people: [
      { name: 'Vy Ngo', role: 'Travel writer', bio: 'Backpacked through 30 countries, writes about slow travel.', days: [0, 6], times: ['14:00', '15:00', '16:00'] },
      { name: 'Duc Lam', role: 'Tour guide', bio: 'Leads treks in the northern mountains and shares village stories.', days: [3, 5], times: ['08:00', '08:30', '09:00'] },
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
