import 'dotenv/config';
import { connectDB, disconnectDB } from '../config/db.js';
import { Destination } from '../models/Destination.js';

// Canonical destinations data (mirrors client/src/data/destinations.ts)
const DESTINATIONS_SEED = [
  {
    id: 'kashmir',
    name: 'Kashmir Valley',
    region: 'Jammu & Kashmir',
    country: 'India',
    description: 'Revered as "Paradise on Earth", the Kashmir Valley offers breathtaking snow-dusted Himalayan peaks, tranquil Dal Lake shikaras, and timeless saffron meadows.',
    culture: 'Rich Kashmiri heritage defined by warm hospitality, Sufi melodies, exquisite Pashmina handloom artistry, and wooden carved architecture.',
    food: ['Wazwan (traditional multi-course feast)', 'Kahwa (aromatic green tea with saffron & almonds)', 'Rogan Josh', 'Modur Pulao (sweet saffron rice)', 'Nadru Yakhni (lotus stem in yogurt gravy)'],
    attractions: ['Dal Lake & Floating Gardens', 'Gulmarg Gondola & Apharwat Peak', 'Mughal Gardens (Shalimar & Nishat Bagh)', 'Betaab Valley in Pahalgam', 'Shankaracharya Temple'],
    activities: ['Shikara sunrise cruise with audio meditation', 'Alpine photography walk', 'Pashmina weaving workshop preview', 'Trek simulation across Aru Valley', 'Local market virtual souvenir stroll'],
    accessibility: { wheelchairAccessible: true, audioGuidesAvailable: true, lowPhysicalDemand: true, restAreasScore: 9, highlights: ['Flat wooden boarding ramps installed on designated Dal Lake houseboats', 'Gulmarg Gondola Phase 1 is fully step-free with elevator access', 'Audio landscape descriptions and low-motion cinematic options available'] },
    budget: { estimatedPerDay: 85, currency: 'USD', level: 'Moderate' },
    bestTime: 'April to October for blooms & greenery; December to February for snow wonderland',
    estimatedDuration: '5 - 7 Days',
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80',
    threeDType: 'mountain',
    categories: ['Nature', 'Mountain', 'Culture', 'Peaceful'],
    coordinates: { lat: 34.0837, lng: 74.7973 },
    hotspots: [
      { id: 'kashmir-dal-lake', title: 'Dal Lake Floating Pavilion', description: 'Glide quietly beside hand-carved cedarwood houseboats while water lilies bloom under morning mist.', audioNarration: 'Welcome to Dal Lake. Notice the gentle rhythmic splash of the heart-shaped wooden oar against crystal-clear Himalayan water.', position: [-4, 1.2, -3], category: 'landmark' },
      { id: 'kashmir-gulmarg', title: 'Apharwat Alpine Ridge', description: 'Stand atop one of the highest cable car drops in Asia, surrounded by towering pine trees blanketed in pure snow.', audioNarration: 'You are now at 13,780 feet above sea level. Feel the crisp mountain air and panoramic vista of the Pir Panjal range.', position: [4, 2.5, -5], category: 'viewpoint' },
      { id: 'kashmir-kahwa-pavilion', title: 'Saffron & Kahwa Tea House', description: 'Sample steaming brass samovars brewing organic saffron threads, cardamom pods, and crushed cinnamon.', audioNarration: "Kahwa is Kashmir's welcome embrace. Inhaling its saffron steam brings an instant sense of calmness.", position: [0, 0.8, -6], category: 'culture' }
    ]
  },
  {
    id: 'goa',
    name: 'Goa Coastal Sanctuary',
    region: 'Goa',
    country: 'India',
    description: 'Golden sun-drenched Arabian Sea coastlines, lush coconut groves, UNESCO Portuguese-heritage cathedrals, and a rejuvenating laid-back lifestyle.',
    culture: 'Harmonious Indo-Portuguese architecture, vibrant local music, bohemian artisan markets, and joyous coastal susegad philosophy.',
    food: ['Goan Fish Curry with steamed red rice', 'Bebinca (traditional seven-layered dessert)', 'Poi (local crusty leavened bread)', 'Vegetable Caldin stew with coconut milk', 'Kokum Sol Kadhi digestive cooler'],
    attractions: ['Basilica of Bom Jesus (UNESCO Site)', 'Palolem Crescent Beach', 'Fontainhas Latin Quarter', 'Dudhsagar Waterfalls', 'Divar Island Spice Plantations'],
    activities: ['Sunset dolphin bay observation', 'Colonial heritage audio architecture walk', 'Spice garden sensory tour', 'Beachside yoga and low-impact meditation', 'Bicycle tour through sleepy backwater hamlets'],
    accessibility: { wheelchairAccessible: true, audioGuidesAvailable: true, lowPhysicalDemand: true, restAreasScore: 9, highlights: ['Beach wheelchair access mats installed at Candolim and Palolem', 'Paved pathways throughout Fontainhas and Old Goa churches', 'Step-free catamaran cruises available on Mandovi River'] },
    budget: { estimatedPerDay: 70, currency: 'USD', level: 'Budget' },
    bestTime: 'November to February (dry cool season)',
    estimatedDuration: '4 - 6 Days',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    threeDType: 'coastal',
    categories: ['Beach', 'Culture', 'Heritage', 'Adventure'],
    coordinates: { lat: 15.2993, lng: 74.1240 },
    hotspots: [
      { id: 'goa-palolem', title: 'Palolem Crescent Bay', description: 'A perfect horseshoe bay with calm turquoise waters ideal for floating meditation and gentle swimming.', audioNarration: "Palolem's crescent shape creates a natural lagoon — gentle waves, silky sand, and swaying palms.", position: [3, 0.5, -4], category: 'landmark' },
      { id: 'goa-bom-jesus', title: 'Basilica of Bom Jesus', description: 'A UNESCO World Heritage Site enshrining the preserved relics of St. Francis Xavier — a masterpiece of baroque architecture.', audioNarration: 'Built in 1605, this golden-stone cathedral blends Corinthian, Doric, and Composite styles.', position: [-3, 1.5, -5], category: 'culture' }
    ]
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan Royal Citadel',
    region: 'Rajasthan',
    country: 'India',
    description: 'Majestic desert palaces, vivid azure townships, and centuries-old forts rising from ochre sand dunes set against blazing Thar sunsets.',
    culture: 'Rajputana warrior legacy expressed through intricate miniature paintings, ceremonial folk dance, puppet theater, and opulent palace hospitality.',
    food: ['Dal Baati Churma', 'Ker Sangri desert beans', 'Ghevar (latticed sweet)', 'Laal Maas spiced mutton', 'Rajasthani Thali platter'],
    attractions: ['Mehrangarh Fort, Jodhpur', 'City Palace & Pichola Lake, Udaipur', 'Amber Fort, Jaipur', 'Jaisalmer Golden Fort & Sam Dunes', 'Ranthambore Tiger Reserve'],
    activities: ['Camel silhouette desert trek simulation', 'Palace light-and-shadow tour', 'Puppet show cultural experience', 'Thar desert sunrise photowalk', 'Textile block-printing workshop'],
    accessibility: { wheelchairAccessible: false, audioGuidesAvailable: true, lowPhysicalDemand: false, restAreasScore: 7, highlights: ['Audio guides in 12 languages across major forts', 'Motorized wheelchair pathways at Amber Fort ground level', 'Electric golf carts for palace ground tours in Udaipur'] },
    budget: { estimatedPerDay: 90, currency: 'USD', level: 'Moderate' },
    bestTime: 'October to March (pleasant desert winter)',
    estimatedDuration: '6 - 8 Days',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    threeDType: 'palace',
    categories: ['Heritage', 'Desert', 'Culture', 'Adventure'],
    coordinates: { lat: 26.9124, lng: 75.7873 },
    hotspots: [
      { id: 'rajasthan-mehrangarh', title: 'Mehrangarh Ramparts', description: 'Soar above Jodhpur from the 400-foot basalt ramparts of this impregnable 15th-century citadel.', audioNarration: 'Mehrangarh means "Fort of the Sun". Its pale blue ocean of rooftops sprawling below earned Jodhpur the name "Blue City".', position: [0, 3, -6], category: 'landmark' },
      { id: 'rajasthan-jaisalmer', title: 'Jaisalmer Golden Horizon', description: 'Watch the setting sun turn 887 carved sandstone havelis and Jaisalmer Fort the color of molten gold.', audioNarration: 'Built in 1156 AD by Rao Jaisal, this living fort still houses 3,000 residents within its 99 bastions.', position: [5, 1, -7], category: 'viewpoint' }
    ]
  },
  {
    id: 'kerala',
    name: 'Kerala Backwaters & Hills',
    region: 'Kerala',
    country: 'India',
    description: 'An emerald labyrinth of mirrored lagoons, mist-draped tea plantations, elephant-rich forests, and Ayurvedic healing traditions.',
    culture: 'Classical Kathakali dance-theatre, ancient Kalaripayattu martial art, thrissur percussion festivals, and rich fishing community storytelling.',
    food: ['Karimeen Pollichathu (pearl spot fish)', 'Appam with Stew', 'Puttu with Kadala Curry', 'Payasam (kheer rice dessert)', 'Kerala Prawn Moilee in coconut milk'],
    attractions: ['Alleppey Backwater Houseboat Network', 'Munnar Tea Gardens', 'Periyar Wildlife Sanctuary', 'Fort Kochi Heritage Quarter', 'Varkala Cliff Coastline'],
    activities: ['Solar ketuvallam sunrise eco-cruise', 'Tea garden plantation walk', 'Ayurvedic wellness consultation preview', 'Elephant sanctuary responsible viewing', 'Coastal fishermen net-casting walk'],
    accessibility: { wheelchairAccessible: true, audioGuidesAvailable: true, lowPhysicalDemand: true, restAreasScore: 9, highlights: ['Accessible houseboats with ramp boarding available', 'Wheelchair-friendly coastal promenade at Fort Kochi', 'Low-exertion guided eco-boat tours in Periyar'] },
    budget: { estimatedPerDay: 65, currency: 'USD', level: 'Budget' },
    bestTime: 'September to March (post-monsoon freshness)',
    estimatedDuration: '5 - 7 Days',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    threeDType: 'nature',
    categories: ['Nature', 'Backwaters', 'Wellness', 'Peaceful'],
    coordinates: { lat: 9.9312, lng: 76.2673 },
    hotspots: [
      { id: 'kerala-alleppey', title: 'Alleppey Houseboat Glide', description: 'Float between paddy fields and coconut-lined canals aboard a traditional solar kettuvallam.', audioNarration: 'Kerala has 900 km of interconnected waterways. This houseboat is made from local bamboo and coconut rope — zero nails used.', position: [-2, 0.5, -4], category: 'landmark' },
      { id: 'kerala-munnar', title: 'Munnar Tea Garden Vista', description: "Breathe in the cool highland mist over endless geometric carpets of emerald tea bushes at 5,000 feet above sea level.", audioNarration: 'Munnar produces some of the finest Nilgiri tea in the world. The altitude creates the perfect morning frost for slow leaf maturation.', position: [3, 2, -6], category: 'viewpoint' }
    ]
  },
  {
    id: 'ladakh',
    name: 'Ladakh High-Altitude Plateau',
    region: 'Ladakh',
    country: 'India',
    description: 'The Land of High Passes — where cobalt monastery courtyards meet shimmering turquoise lakes and barren lunar moonscapes.',
    culture: 'Deeply spiritual Tibetan Buddhist culture expressed through monastery chant ceremonies, prayer flag lines, thangka paintings, and Ladakhi folk opera.',
    food: ['Thukpa (Tibetan noodle soup)', 'Skyu (root vegetable stew)', 'Butter Tea (Po Cha)', 'Tsampa (roasted barley)', 'Momos (steamed dumplings)'],
    attractions: ['Pangong Tso Cobalt Lake', 'Thiksey Monastery', 'Nubra Valley & Bactrian Camel Dunes', 'Magnetic Hill Leh', 'Khardungla Pass (18,380 ft)'],
    activities: ['Pangong lake sunrise meditation', 'Monastery chant immersion ceremony', 'White-water rafting simulation on Indus', 'Camel ride across Nubra dunes', 'Star-gazing at Hanle Dark Sky Reserve'],
    accessibility: { wheelchairAccessible: false, audioGuidesAvailable: true, lowPhysicalDemand: false, restAreasScore: 6, highlights: ['Helicopter access to Leh city available for mobility needs', 'Pangong Lake shore paved viewing decks', 'Acclimatization rest spots at all major tourist points'] },
    budget: { estimatedPerDay: 95, currency: 'USD', level: 'Moderate' },
    bestTime: 'June to September (road season)',
    estimatedDuration: '6 - 8 Days',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
    threeDType: 'mountain',
    categories: ['Mountain', 'Adventure', 'Spiritual', 'Nature'],
    coordinates: { lat: 34.1526, lng: 77.5771 },
    hotspots: [
      { id: 'ladakh-pangong', title: 'Pangong Tso Shoreline', description: 'Stand at the edge of one of the world\'s highest saltwater lakes — 60% of its 134km length crosses into Tibet.', audioNarration: 'Pangong Tso changes colour from cobalt to turquoise to violet to silver as the light shifts throughout the day.', position: [0, 1, -5], category: 'landmark' },
      { id: 'ladakh-thiksey', title: 'Thiksey Monastery Courtyard', description: 'Experience the resonance of 500-year-old copper butter lamps and chanting monks draped in saffron robes.', audioNarration: 'Thiksey resembles the Potala Palace of Lhasa. Perched at 11,800 ft, its 12-story gompa shelters 60 resident monks.', position: [-3, 2.5, -6], category: 'culture' }
    ]
  },
  {
    id: 'konark',
    name: 'Konark Sun Temple & Coast',
    region: 'Odisha',
    country: 'India',
    description: 'UNESCO World Heritage masterpiece carved as a colossal stone chariot of the Sun God Surya, complete with 24 intricately sculpted wheels along the Bay of Bengal.',
    culture: 'Kalinga architectural genius, Odissi classical dance rhythm, stone carving guilds, and sacred coastal festivals.',
    food: ['Chhena Poda (caramelized baked cheese dessert)', 'Dalma (lentil stew with raw papaya & pumpkin)', 'Odisha Khaja crisp layered sweet', 'Fresh coconut malai', 'Pakhala Bhat cooling fermented rice dish'],
    attractions: ['Konark Sun Temple Sanctuary', 'Chandrabhaga Clean Blue Flag Beach', 'Konark Archaeological Museum', 'Marine Drive Golden Sands Eco Retreat', 'Raghurajpur Heritage Pattachitra Crafts Village'],
    activities: ['Decoding the ancient stone sundial timekeeping wheel', 'Odissi classical dance mudra demonstration', 'Sunrise beach meditation audio experience', 'Pattachitra palm-leaf scroll painting walkthrough', 'Architectural balance & magnetic myth exploration'],
    accessibility: { wheelchairAccessible: true, audioGuidesAvailable: true, lowPhysicalDemand: true, restAreasScore: 9, highlights: ['Smooth wide paved stone pathways throughout the entire perimeter of the Sun Temple', 'Wheelchair ramps leading to all major viewing platforms', 'Braille signage panels and synchronized descriptive audio guide wands'] },
    budget: { estimatedPerDay: 60, currency: 'USD', level: 'Budget' },
    bestTime: 'October to March for gentle sea breezes and pleasant sunshine',
    estimatedDuration: '3 - 5 Days',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
    threeDType: 'temple',
    categories: ['Heritage', 'Culture', 'Beach'],
    coordinates: { lat: 19.8876, lng: 86.0945 },
    hotspots: [
      { id: 'konark-sundial-wheel', title: 'The Great Chariot Sundial', description: 'Exquisitely carved stone wheel whose spokes accurately calculate exact time to the minute using sunlight shadows.', audioNarration: 'Look closely at the spokes and medallions. Each carving reveals the daily rhythm of life in 13th-century Odisha.', position: [-3.5, 1.5, -4], category: 'landmark' },
      { id: 'konark-chandrabhaga', title: 'Chandrabhaga Sunrise Beach', description: 'Golden sand shores where dawn paints the Bay of Bengal in pink and liquid gold.', audioNarration: 'Breathe in the mineral salt air as fishing boats glide through the morning surf under the golden sun.', position: [4, 0.4, -4.5], category: 'viewpoint' }
    ]
  }
];

export const seedDestinations = async () => {
  const count = await Destination.countDocuments();
  if (count < DESTINATIONS_SEED.length) {
    console.log(`📍 Upserting ${DESTINATIONS_SEED.length} canonical destinations...`);
    for (const dest of DESTINATIONS_SEED) {
      await Destination.findOneAndUpdate({ id: dest.id }, dest, { upsert: true, new: true });
    }
    console.log('✅ Canonical destinations synchronized successfully!');
  }
};

const runStandaloneSeed = async () => {
  console.log('🌱 Connecting to database...');
  await connectDB();
  console.log('🗑️  Clearing existing destinations...');
  await Destination.deleteMany({});
  console.log(`📍 Seeding ${DESTINATIONS_SEED.length} destinations...`);
  await Destination.insertMany(DESTINATIONS_SEED);
  console.log('✅ Destinations seeded successfully!');
  await disconnectDB();
  process.exit(0);
};

// Check if run directly
if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  runStandaloneSeed().catch(err => {
    console.error('❌ Seed error:', err);
    process.exit(1);
  });
}
