-- Catalog seed. Artisans are public listings (user_id null until claimed).

insert into public.categories (id, title, subtitle, icon, color, soft, sort_order) values
  ('plumbing', 'Plumbing', 'Leaks, pipes & heaters', 'water-outline', '#1F7A5B', '#E6F3EE', 1),
  ('electrical', 'Electrical', 'Wiring & installations', 'flash-outline', '#F7931E', '#FFF1DE', 2),
  ('ac-repair', 'AC Repair', 'Cooling & gas refill', 'snow-outline', '#2563EB', '#DBEAFE', 3),
  ('painting', 'Painting', 'Interior & exterior', 'color-palette-outline', '#DC2626', '#FEE2E2', 4),
  ('cleaning', 'Cleaning', 'Home & deep clean', 'sparkles-outline', '#16A34A', '#DCFCE7', 5),
  ('generator', 'Generator', 'Service & repair', 'battery-charging-outline', '#D97706', '#FEF3C7', 6),
  ('carpentry', 'Carpentry', 'Doors, shelves & more', 'hammer-outline', '#78716C', '#F5F5F4', 7),
  ('gardening', 'Gardening', 'Lawns & landscaping', 'leaf-outline', '#145A42', '#E6F3EE', 8)
on conflict (id) do update set
  title = excluded.title,
  subtitle = excluded.subtitle,
  icon = excluded.icon,
  color = excluded.color,
  soft = excluded.soft,
  sort_order = excluded.sort_order;

insert into public.artisans (
  id, category_id, name, skill, about, years_exp, price_min, price_max,
  rating, review_count, jobs_done, distance_km, avatar_url, cover_url,
  location_label, response_mins, online, verified, verification_status
) values
  (
    '11111111-1111-1111-1111-111111111111',
    'plumbing', 'Chinedu Okonkwo', 'Master Plumber',
    'Licensed plumber specialising in leak detection, bathroom fittings and water heater repairs.',
    8, 6500, 18000, 4.90, 186, 420, 1.2,
    'https://randomuser.me/api/portraits/men/32.jpg',
    'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=1200&q=80',
    'Lekki, Lagos', 8, true, true, 'verified'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'electrical', 'Aisha Bello', 'Licensed Electrician',
    'Wiring, sockets, lighting and inverter setups. Safety-first, neat finishing.',
    6, 8000, 25000, 4.80, 142, 310, 2.4,
    'https://randomuser.me/api/portraits/women/65.jpg',
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&q=80',
    'Victoria Island, Lagos', 12, true, true, 'verified'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'electrical', 'Tunde Adebayo', 'Electrical Technician',
    'Fast emergency electrical repairs across the Island.',
    5, 7000, 20000, 4.70, 98, 204, 3.8,
    'https://randomuser.me/api/portraits/men/45.jpg',
    'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&q=80',
    'Ikoyi, Lagos', 15, false, true, 'verified'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'plumbing', 'Ngozi Eze', 'Plumber',
    'Friendly plumbing for apartments. Kitchen and bathroom fixes.',
    4, 5500, 15000, 4.60, 76, 168, 4.1,
    'https://randomuser.me/api/portraits/women/33.jpg',
    'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=1200&q=80',
    'Ajah, Lagos', 20, true, true, 'verified'
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'ac-repair', 'Ibrahim Musa', 'AC Specialist',
    'Gas refill, compressor issues, installation and servicing for split units.',
    9, 12000, 45000, 4.90, 211, 540, 2.9,
    'https://randomuser.me/api/portraits/men/75.jpg',
    'https://images.unsplash.com/photo-1631545806609-35cdad729548?w=1200&q=80',
    'Maryland, Lagos', 10, true, true, 'verified'
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    'painting', 'Funke Adeyemi', 'Interior Painter',
    'Careful surface prep, clean lines and premium finishes.',
    7, 25000, 180000, 4.80, 89, 132, 5.2,
    'https://randomuser.me/api/portraits/women/12.jpg',
    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200&q=80',
    'Surulere, Lagos', 25, false, true, 'verified'
  ),
  (
    '77777777-7777-7777-7777-777777777777',
    'cleaning', 'Emeka Obi', 'Home Cleaning Lead',
    'Deep cleaning teams for apartments and offices.',
    5, 15000, 60000, 4.70, 154, 390, 1.8,
    'https://randomuser.me/api/portraits/men/18.jpg',
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=80',
    'Yaba, Lagos', 18, true, true, 'verified'
  ),
  (
    '88888888-8888-8888-8888-888888888888',
    'generator', 'Segun Adewale', 'Generator Engineer',
    'Servicing and repair for Tiger, Elepaq, and industrial sets.',
    11, 10000, 80000, 4.90, 167, 288, 3.3,
    'https://randomuser.me/api/portraits/men/41.jpg',
    'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&q=80',
    'Ikeja, Lagos', 14, true, true, 'verified'
  ),
  (
    '99999999-9999-9999-9999-999999999999',
    'carpentry', 'Fatima Yusuf', 'Carpenter & Joiner',
    'Custom shelves, door repairs and kitchen cabinets.',
    6, 18000, 220000, 4.80, 73, 121, 6.1,
    'https://randomuser.me/api/portraits/women/79.jpg',
    'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1200&q=80',
    'Gbagada, Lagos', 30, false, true, 'verified'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'gardening', 'Ifeanyi Nwosu', 'Landscape Gardener',
    'Lawn care, hedges, and small garden makeovers.',
    8, 12000, 90000, 4.70, 64, 97, 4.7,
    'https://randomuser.me/api/portraits/men/36.jpg',
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=80',
    'Lekki Phase 2, Lagos', 22, true, true, 'verified'
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'cleaning', 'Blessing Okoro', 'Deep Clean Specialist',
    'Move-in, post-renovation and weekly retainers.',
    6, 18000, 75000, 4.90, 201, 455, 2.1,
    'https://randomuser.me/api/portraits/women/28.jpg',
    'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=1200&q=80',
    'Lekki Phase 1, Lagos', 9, true, true, 'verified'
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'ac-repair', 'Amaka Chukwu', 'HVAC Technician',
    'Affordable AC servicing and installation for studio apartments.',
    3, 11000, 40000, 4.60, 58, 86, 7.4,
    'https://randomuser.me/api/portraits/women/50.jpg',
    'https://images.unsplash.com/photo-1631545806609-35cdad729548?w=1200&q=80',
    'Ojodu, Lagos', 35, false, false, 'unsubmitted'
  )
on conflict (id) do nothing;

insert into public.reviews (artisan_id, customer_name, customer_avatar, rating, comment, created_at) values
  ('11111111-1111-1111-1111-111111111111', 'Emeka Obi', 'https://randomuser.me/api/portraits/men/11.jpg', 5, 'Fixed a major kitchen leak in under an hour.', '2026-08-16T09:00:00Z'),
  ('11111111-1111-1111-1111-111111111111', 'Amina Yusuf', 'https://randomuser.me/api/portraits/women/44.jpg', 5, 'On time, fair price, and the tap hasn''t dripped since.', '2026-08-10T14:20:00Z'),
  ('22222222-2222-2222-2222-222222222222', 'Tunde Adebayo', 'https://randomuser.me/api/portraits/men/22.jpg', 5, 'Rewired my living room and installed new pendants.', '2026-08-12T11:00:00Z'),
  ('55555555-5555-5555-5555-555555555555', 'Funke Adeyemi', 'https://randomuser.me/api/portraits/women/68.jpg', 5, 'My sitting room AC is ice cold again.', '2026-08-14T13:10:00Z')
on conflict do nothing;
