// Dữ liệu topic + người chia sẻ. Sửa / thêm ở đây, các trang tự cập nhật.
// days: các thứ trong tuần có lịch (0 = CN, 1 = T2, ... 6 = T7)
const TOPICS = [
  {
    id: 'art',
    title: 'Art',
    color: '#f6c9b6',
    people: [
      { name: 'Linh Nguyen', role: 'Illustrator', bio: 'Vẽ minh hoạ cho sách thiếu nhi, thích kể chuyện bằng màu nước.', days: [2, 4, 6], times: ['11:00', '11:30', '12:00', '14:00'] },
      { name: 'Minh Tran', role: 'Ceramic artist', bio: 'Làm gốm thủ công 6 năm, có xưởng nhỏ ở Đà Lạt.', days: [1, 3, 5], times: ['09:00', '10:00', '15:00', '15:30'] },
      { name: 'An Le', role: 'Art director', bio: 'Từng làm agency quảng cáo, giờ theo đuổi tranh sơn dầu.', days: [6, 0], times: ['10:00', '11:00', '16:00'] },
    ],
  },
  {
    id: 'music',
    title: 'Music',
    color: '#c9dcc9',
    people: [
      { name: 'Huy Pham', role: 'Producer', bio: 'Sản xuất nhạc indie, chia sẻ về hành trình tự học.', days: [1, 2, 3], times: ['19:00', '19:30', '20:00'] },
      { name: 'Mai Vo', role: 'Pianist', bio: 'Dạy piano 10 năm, tin rằng ai cũng có thể bắt đầu.', days: [4, 5], times: ['11:00', '11:30', '12:00', '12:30'] },
    ],
  },
  {
    id: 'tech',
    title: 'Tech',
    color: '#c8d6ee',
    people: [
      { name: 'Khoa Dang', role: 'Software engineer', bio: 'Đổi ngành từ kinh tế sang lập trình ở tuổi 27.', days: [2, 4], times: ['18:00', '18:30', '19:00'] },
      { name: 'Thao Bui', role: 'Product designer', bio: 'Thiết kế app cho startup, mê những thứ đơn giản.', days: [1, 3, 5], times: ['12:00', '12:30', '13:00'] },
      { name: 'Nam Ho', role: 'Data scientist', bio: 'Thích biến con số khô khan thành câu chuyện.', days: [6], times: ['09:00', '09:30', '10:00', '10:30'] },
    ],
  },
  {
    id: 'travel',
    title: 'Travel',
    color: '#f3e1a6',
    people: [
      { name: 'Vy Ngo', role: 'Travel writer', bio: 'Đi 30 nước bằng balo, viết blog về du lịch chậm.', days: [0, 6], times: ['14:00', '15:00', '16:00'] },
      { name: 'Duc Lam', role: 'Tour guide', bio: 'Hướng dẫn trekking Tây Bắc, kể chuyện bản làng.', days: [3, 5], times: ['08:00', '08:30', '09:00'] },
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
