-- Starter data: experience tags and Boston Asian restaurants & cafes.
-- Safe to re-run (upserts on slug / id). Generated from the original mock data.

insert into public.experience_tags (id, slug, label) values
  ('59e4a46a-c6ad-4c8b-aeff-a48ad9f8c6f1', 'beautiful-space', 'Beautiful space'),
  ('74eb4454-ea96-4369-a3e9-d52ea8c76d99', 'great-plating', 'Great plating'),
  ('98938fd6-ae37-45e5-ac3f-22067f3d66c4', 'thoughtful-service', 'Thoughtful service'),
  ('71295fec-4d2b-49a1-a703-68959e13904b', 'cozy-for-groups', 'Cozy for groups'),
  ('967df0fc-07b3-4e92-a5b5-bd5a6f17722a', 'good-cafe-after', 'Good cafe after'),
  ('3a7129c2-9b80-4f45-a235-4efda7ba1bf0', 'authentic', 'Authentic'),
  ('b6289696-b371-4bfa-ab70-295ec5dc4a18', 'creative-menu', 'Creative menu'),
  ('f9e83915-a4aa-4701-a2ad-527554d65a82', 'hidden-gem', 'Hidden gem')
on conflict (slug) do update set label = excluded.label;

insert into public.places (id, name, cuisine, specialty, kind, address, neighborhood, lat, lng, price_level, description, source, source_url, social_buzz) values
  ('d078ed5d-2c4f-480e-a124-682d5aa9994a', 'Mulan Noodle Bar', 'Chinese', 'Lanzhou noodles', 'restaurant', '14 Tyler St, Boston, MA 02111', 'Chinatown', 42.3512, -71.0618, 2, 'A narrow room where noodles are pulled to order at the window. The beef broth is clear, aromatic and takes a full day.', 'social', 'https://www.tiktok.com/@bostonnoodles/video/7391', 480000),
  ('a60e7406-8336-4acf-a621-d55fb7d7ed44', 'Kōhī Kissa', 'Japanese', 'Japanese kissaten', 'cafe', '212 Shawmut Ave, Boston, MA 02118', 'South End', 42.3441, -71.0702, 2, 'A hushed, wood-panelled coffee house in the Showa tradition: siphon coffee, thick-cut toast and a proper napolitan.', 'user', null, 120000),
  ('481c6e4c-62c5-4f00-ab08-082579663952', 'Lantern & Lotus', 'Chinese', 'Cantonese dim sum', 'restaurant', '70 Beach St, Boston, MA 02111', 'Chinatown', 42.3504, -71.0613, 2, 'Weekend carts, round tables and a long banquet room made for big groups. Go early; the har gow sells out.', 'user', null, 90000),
  ('62bc092d-7952-4125-af3a-8f992949e591', 'Tāo Tea House', 'Taiwanese', 'Taiwanese tea & small plates', 'cafe', '9 Holyoke Ct, Cambridge, MA 02138', 'Harvard Square', 42.3732, -71.1189, 2, 'Gongfu tea service on low tables, scallion pancakes and braised pork rice. Staff will walk you through every pour.', 'user', null, 15000),
  ('67915f1f-7802-4ecb-a559-a4536ceee300', 'Seoul Hearth', 'Korean', 'Korean home cooking', 'restaurant', '1120 Commonwealth Ave, Allston, MA 02134', 'Allston', 42.3512, -71.1316, 2, 'Bubbling stews, a dozen banchan that change weekly, and a grandmother-approved kimchi jjigae.', 'user', null, 60000),
  ('2902937d-9373-43a3-a58f-c8813fce97c2', 'Bánh & Brew', 'Vietnamese', 'Vietnamese cafe', 'cafe', '88 Brookline Ave, Boston, MA 02215', 'Fenway', 42.3452, -71.1006, 1, 'Crackly baguettes, cà phê sữa đá made with chicory-forward robusta, and a sunny corner for laptops.', 'user', null, 30000),
  ('f21b03f4-a69a-4d32-a635-025a71813993', 'Matcha Month Club', 'Japanese', 'Matcha bar', 'cafe', '301 Newbury St, Boston, MA 02115', 'Back Bay', 42.3488, -71.0865, 2, 'Ceremonial-grade matcha in pastel cups, with a monthly rotating flight. Currently all over the feed.', 'social', 'https://www.instagram.com/reel/Cx9matcha/', 2100000),
  ('5c61eb88-a00e-40b5-a767-ea01956f1f61', 'Silk Road Szechuan', 'Chinese', 'Sichuan', 'restaurant', '45 Union Sq, Somerville, MA 02143', 'Union Square', 42.3794, -71.0953, 2, 'Mala numbing heat, dry-fried green beans and a viral "volcano" fish pot. The line is real.', 'social', 'https://www.tiktok.com/@somervillesnacks/video/6522', 870000),
  ('6aafa473-83c4-4d4a-aaef-41ea8ee30452', 'Saigon Alley', 'Vietnamese', 'Vietnamese', 'restaurant', '1501 Dorchester Ave, Dorchester, MA 02122', 'Fields Corner', 42.3009, -71.0616, 1, 'A family-run counter with a handwritten menu and a short line of regulars. No buzz online, just pho worth the trip.', 'user', null, 0),
  ('dcdc1f28-8324-4cb1-a346-b3560fb19ab1', 'Ume Counter', 'Japanese', 'Japanese small plates', 'restaurant', '620 Massachusetts Ave, Cambridge, MA 02139', 'Central Square', 42.3651, -71.1039, 3, 'Twelve seats around an open kitchen. A quiet, meticulous chef’s-choice progression of seasonal small plates.', 'user', null, 8000),
  ('86452052-be88-4fc9-ad13-2b1aacb3b1b3', 'Baan Lamai', 'Thai', 'Northern Thai', 'restaurant', '727 Centre St, Jamaica Plain, MA 02130', 'Jamaica Plain', 42.3098, -71.1137, 2, 'Khao soi with crispy noodles, sai ua sausage and herbs piled high. Trending for its lemongrass-heavy cocktails.', 'social', 'https://www.instagram.com/p/Cz8thai/', 340000),
  ('8cfade81-6479-4504-afd3-abc9034979c2', 'Sesame & Sage', 'Korean', 'Healthy Korean-Japanese bowls', 'restaurant', '1342 Beacon St, Brookline, MA 02446', 'Coolidge Corner', 42.3417, -71.1213, 2, 'Grain bowls with fermented vegetables, perilla oil and soft tofu. Light, bright and surprisingly filling.', 'user', null, 22000),
  ('78940ca5-5f58-4f34-a4c2-0dc1c4aa4090', 'Dragonfly Bakery', 'Chinese', 'Hong Kong bakery cafe', 'cafe', '33 Harrison Ave, Boston, MA 02111', 'Chinatown', 42.3489, -71.0621, 1, 'Pineapple buns still warm from the oven, milk tea strained through silk and a cheerful, cramped dining room.', 'user', null, 56000),
  ('cdd4c581-9a5e-4e46-a445-cfa17604a718', 'Yuzu Yuzu', 'Japanese', 'Japanese cafe', 'cafe', '2 Seaport Blvd, Boston, MA 02210', 'Seaport', 42.3519, -71.0449, 2, 'Citrus-forward drinks, souffle pancakes and a sleek glass dining room. Just opened and already queued.', 'social', 'https://www.tiktok.com/@seaportbites/video/9014', 650000)
on conflict (id) do update set
  name = excluded.name, cuisine = excluded.cuisine, specialty = excluded.specialty, kind = excluded.kind,
  address = excluded.address, neighborhood = excluded.neighborhood, lat = excluded.lat, lng = excluded.lng,
  price_level = excluded.price_level, description = excluded.description, source = excluded.source,
  source_url = excluded.source_url, social_buzz = excluded.social_buzz;
