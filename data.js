// Dữ liệu topic + người chia sẻ. Sửa / thêm ở đây, các trang tự cập nhật.
// color: màu bìa (theo palette) · ink: màu chữ trên bìa nếu bìa tối
// card: ảnh profile card do nhóm thiết kế (assets/profiles/), dùng ở trang Booking và trang chọn giờ
const TOPICS = [
  {
    id: 'art',
    title: 'Art',
    color: '#f28b75',
    people: [
      { name: 'Amelia Roberts', role: 'Creative Hobbies', language: 'English', card: 'assets/profiles/amelia-roberts.png',
        bio: 'I enjoy illustration, photography, journalling, and trying new creative hobbies even when I\'m not very good at them. I\'d love to chat about what inspires you and what you like to create.' },
    ],
  },
  {
    id: 'cooking',
    title: 'Cooking',
    color: '#f3c969',
    people: [
      { name: 'Ethan Lee', role: 'Food & Cooking', language: 'English, Korean', card: 'assets/profiles/ethan-lee.png',
        bio: 'Cooking is one of my favourite ways to relax and connect with people. I enjoy talking about Korean food, easy student meals, and the dishes that remind us of home.' },
      { id: 'cooking-thi', name: 'Thi (Tea)', role: 'Cooking', language: 'Vietnamese, English', card: 'assets/profiles/thi.png',
        bio: 'As an open-minded person who enjoys cooking, I look forward to sharing my experiences and connecting with others through an activity that I love.' },
    ],
  },
  {
    id: 'travel',
    title: 'Travel',
    color: '#a8bfa3',
    people: [
      { name: 'Kai Pham', role: 'Travelling', language: 'English, Vietnamese', card: 'assets/profiles/kai-pham.png',
        bio: 'I enjoy exploring new places and learning about different cultures through food, language, and everyday life. I\'d love to exchange travel stories, dream destinations, or funny experiences.' },
      { name: 'Olivia Bennett', role: 'Travel', language: 'English', card: 'assets/profiles/olivia-bennett.png',
        bio: 'I love travel and exploring Melbourne\'s cafes, markets, live music, and hidden local spots. I\'m always happy to share recommendations or hear about your favourite places too.' },
    ],
  },
  {
    id: 'sport',
    title: 'Sport',
    color: '#304e63',
    ink: '#fff7ec',
    people: [
      { name: 'Jack Wilson', role: 'Sport & outdoor activities', language: 'English', card: 'assets/profiles/jack-wilson.png',
        bio: 'I enjoy footy, basketball, hiking, and spending time outdoors. I\'d love to chat about sport, weekend activities, or places to explore Melbourne.' },
    ],
  },
  {
    id: 'music',
    title: 'Music',
    color: '#f28b75',
    people: [
      { name: 'Sophia', role: 'Music', language: 'English', card: 'assets/profiles/sophia.png',
        bio: 'I like Kpop and US-UK music. If you also like, come and have a conversation about the group we like and have fun!!!' },
    ],
  },
  {
    id: 'film',
    title: 'Film',
    color: '#f3c969',
    people: [
      { name: 'Noah Chen', role: 'Film & TV', language: 'English, Mandarin', card: 'assets/profiles/noah-chen.png',
        bio: 'I can talk for hours about films, series, and the little details that make a story memorable. Whether you like thrillers, animation, dramas, or just want a recommendation, come have a chat.' },
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
