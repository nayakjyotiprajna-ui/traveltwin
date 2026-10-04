import { Destination } from '../types';

export const DESTINATIONS: Destination[] = [
  {
    id: 'kashmir',
    name: 'Kashmir Valley',
    region: 'Jammu & Kashmir',
    country: 'India',
    description: 'Revered as "Paradise on Earth", the Kashmir Valley offers breathtaking snow-dusted Himalayan peaks, tranquil Dal Lake shikaras, and timeless saffron meadows.',
    culture: 'Rich Kashmiri heritage defined by warm hospitality, Sufi melodies, exquisite Pashmina handloom artistry, and wooden carved architecture.',
    food: [
      'Wazwan (traditional multi-course feast)',
      'Kahwa (aromatic green tea with saffron & almonds)',
      'Rogan Josh',
      'Modur Pulao (sweet saffron rice)',
      'Nadru Yakhni (lotus stem in yogurt gravy)'
    ],
    attractions: [
      'Dal Lake & Floating Gardens',
      'Gulmarg Gondola & Apharwat Peak',
      'Mughal Gardens (Shalimar & Nishat Bagh)',
      'Betaab Valley in Pahalgam',
      'Shankaracharya Temple'
    ],
    activities: [
      'Shikara sunrise cruise with audio meditation',
      'Alpine photography walk',
      'Pashmina weaving workshop preview',
      'Trek simulation across Aru Valley',
      'Local market virtual souvenir stroll'
    ],
    accessibility: {
      wheelchairAccessible: true,
      audioGuidesAvailable: true,
      lowPhysicalDemand: true,
      restAreasScore: 9,
      highlights: [
        'Flat wooden boarding ramps installed on designated Dal Lake houseboats',
        'Gulmarg Gondola Phase 1 is fully step-free with elevator access',
        'Audio landscape descriptions and low-motion cinematic options available'
      ]
    },
    budget: {
      estimatedPerDay: 85,
      currency: 'USD',
      level: 'Moderate'
    },
    bestTime: 'April to October for blooms & greenery; December to February for snow wonderland',
    estimatedDuration: '5 - 7 Days',
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80',
    threeDType: 'mountain',
    categories: ['Nature', 'Mountain', 'Culture', 'Peaceful' as any],
    coordinates: {
      lat: 34.0837,
      lng: 74.7973
    },
    hotspots: [
      {
        id: 'kashmir-dal-lake',
        title: 'Dal Lake Floating Pavilion',
        description: 'Glide quietly beside hand-carved cedarwood houseboats while water lilies bloom under morning mist.',
        audioNarration: 'Welcome to Dal Lake. Notice the gentle rhythmic splash of the heart-shaped wooden oar against crystal-clear Himalayan water.',
        position: [-4, 1.2, -3],
        category: 'landmark'
      },
      {
        id: 'kashmir-gulmarg',
        title: 'Apharwat Alpine Ridge',
        description: 'Stand atop one of the highest cable car drops in Asia, surrounded by towering pine trees blanketed in pure snow.',
        audioNarration: 'You are now at 13,780 feet above sea level. Feel the crisp mountain air and panoramic vista of the Pir Panjal range.',
        position: [4, 2.5, -5],
        category: 'viewpoint'
      },
      {
        id: 'kashmir-kahwa-pavilion',
        title: 'Saffron & Kahwa Tea House',
        description: 'Sample steaming brass samovars brewing organic saffron threads, cardamom pods, and crushed cinnamon.',
        audioNarration: 'Kahwa is Kashmir’s welcome embrace. Inhaling its saffron steam brings an instant sense of calmness.',
        position: [0, 0.8, -6],
        category: 'culture'
      }
    ]
  },
  {
    id: 'goa',
    name: 'Goa Coastal Sanctuary',
    region: 'Goa',
    country: 'India',
    description: 'Golden sun-drenched Arabian Sea coastlines, lush coconut groves, UNESCO Portuguese-heritage cathedrals, and a rejuvenating laid-back lifestyle.',
    culture: 'Harmonious Indo-Portuguese architecture, vibrant local music, bohemian artisan markets, and joyous coastal susegad philosophy.',
    food: [
      'Goan Fish Curry with steamed red rice',
      'Bebinca (traditional seven-layered dessert)',
      'Poi (local crusty leavened bread)',
      'Vegetable Caldin stew with coconut milk',
      'Kokum Sol Kadhi digestive cooler'
    ],
    attractions: [
      'Basilica of Bom Jesus (UNESCO Site)',
      'Palolem Crescent Beach',
      'Fontainhas Latin Quarter',
      'Dudhsagar Waterfalls',
      'Divar Island Spice Plantations'
    ],
    activities: [
      'Sunset dolphin bay observation',
      'Colonial heritage audio architecture walk',
      'Spice garden sensory tour',
      'Beachside yoga and low-impact meditation',
      'Bicycle tour through sleepy backwater hamlets'
    ],
    accessibility: {
      wheelchairAccessible: true,
      audioGuidesAvailable: true,
      lowPhysicalDemand: true,
      restAreasScore: 9,
      highlights: [
        'Beach wheelchair access mats installed at Candolim and Palolem',
        'Paved pathways throughout Fontainhas and Old Goa churches',
        'Step-free catamaran cruises available on Mandovi River'
      ]
    },
    budget: {
      estimatedPerDay: 70,
      currency: 'USD',
      level: 'Budget'
    },
    bestTime: 'November to March for gentle breezes and crystal waters',
    estimatedDuration: '4 - 6 Days',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    threeDType: 'coastal',
    categories: ['Beach', 'Culture', 'Nature'],
    coordinates: {
      lat: 15.2993,
      lng: 74.1240
    },
    hotspots: [
      {
        id: 'goa-palolem-cove',
        title: 'Palolem Sunset Cove',
        description: 'Curved bay sheltered by gentle headlands where gentle waves lap softly against amber sands.',
        audioNarration: 'Listen to the steady rolling waves and offshore breeze rustling through tall coconut palms.',
        position: [-3.5, 0.5, -4],
        category: 'viewpoint'
      },
      {
        id: 'goa-fontainhas',
        title: 'Fontainhas Heritage Quarter',
        description: 'Vibrant pastel yellow, cobalt, and terracotta colonial mansions with ornate tiled balconies.',
        audioNarration: 'These quiet cobbled lanes date back to the late 1700s. Notice the hand-painted azulejo ceramic tiles.',
        position: [3, 1, -3],
        category: 'culture'
      },
      {
        id: 'goa-lighthouse',
        title: 'Aguada Coastal Bastion',
        description: '17th-century Portuguese fortress overlooking the vast expanse of the shimmering Arabian Sea.',
        audioNarration: 'Strategically perched above the waves, this bastion once guided sailors navigating spice routes.',
        position: [0, 2, -6],
        category: 'landmark'
      }
    ]
  },
  {
    id: 'kerala',
    name: 'Kerala Backwaters & Hills',
    region: 'Kerala',
    country: 'India',
    description: 'Lush tropical waterways of Alleppey, emerald tea gardens of Munnar, and centuries-old Ayurvedic holistic wellness traditions.',
    culture: 'Kathakali classical dance drama, temple percussion ensembles, snake boat races, and ancient herbal wellness sanctuaries.',
    food: [
      'Appam with vegetable stew & coconut milk',
      'Traditional Kerala Sadya on banana leaf',
      'Puttu and Kadala curry',
      'Fresh coconut water with tender pulp',
      'Parippu Vada crispy lentil treats'
    ],
    attractions: [
      'Alleppey Tranquil Canal Network',
      'Munnar Tea Hills & Kolukkumalai',
      'Periyar Wildlife Sanctuary',
      'Kochi Fort & Chinese Fishing Nets',
      'Varkala Cliff and Mineral Springs'
    ],
    activities: [
      'Solar-powered eco-kettuvallam boat tour',
      'Ayurvedic sensory herbal garden walk',
      'Kathakali mask makeup storytelling',
      'Tea plantation mist walk simulation',
      'Birdwatching at Kumarakom Sanctuary'
    ],
    accessibility: {
      wheelchairAccessible: true,
      audioGuidesAvailable: true,
      lowPhysicalDemand: true,
      restAreasScore: 9,
      highlights: [
        'Accessible eco-houseboats equipped with hydraulic lifts and wide gangways',
        'Paved tea museum tours with seating stops every 50 meters',
        'Sensory soundscapes with 3D audio binaural recordings'
      ]
    },
    budget: {
      estimatedPerDay: 75,
      currency: 'USD',
      level: 'Moderate'
    },
    bestTime: 'September to March; monsoon season (June-August) for therapeutic Ayurveda',
    estimatedDuration: '6 - 8 Days',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    threeDType: 'nature',
    categories: ['Nature', 'Culture', 'Peaceful' as any],
    coordinates: {
      lat: 9.4981,
      lng: 76.3388
    },
    hotspots: [
      {
        id: 'kerala-kettuvallam',
        title: 'Alleppey Backwater Waterway',
        description: 'Cruise tranquil palm-fringed canals where kingfishers dart above mirror-smooth waters.',
        audioNarration: 'The silence of the backwaters is punctuated only by water lilies brushing against the cedar hull.',
        position: [-4, 0.4, -4],
        category: 'landmark'
      },
      {
        id: 'kerala-munnar-tea',
        title: 'Munnar High-Range Tea Terrace',
        description: 'Vast slopes carpeted in manicured tea bushes rising into gentle rolling highland clouds.',
        audioNarration: 'Breathe in the subtle aroma of fresh tea leaves mingling with eucalyptus and morning mist.',
        position: [3.5, 2.2, -5],
        category: 'viewpoint'
      }
    ]
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan Royal Citadel',
    region: 'Rajasthan',
    country: 'India',
    description: 'Majestic golden sandstone forts, royal palaces, vibrant desert folklore, and the shimmering lakes of Udaipur and Jodhpur.',
    culture: 'Royal Rajput heritage, soulful Sarangi folk ballads, intricate mirror-work textiles, and monumental palace courtyards.',
    food: [
      'Dal Baati Churma with pure ghee',
      'Gatte ki Sabzi in rich spiced gravy',
      'Ker Sangri desert bean delicacy',
      'Mawa Kachori sweet pastry',
      'Spiced Masala Buttermilk'
    ],
    attractions: [
      'Mehrangarh Fort of Jodhpur',
      'City Palace & Lake Pichola Udaipur',
      'Hawa Mahal & Amber Fort Jaipur',
      'Jaisalmer Golden Fort in the Thar Desert',
      'Pushkar Sacred Lake and Ghats'
    ],
    activities: [
      'Fort ramparts panorama with royal history guide',
      'Puppet theatre and miniature painting preview',
      'Palace courtyard acoustic resonance experience',
      'Desert stargazing quiet zone simulation',
      'Architectural jali screen light-and-shadow exploration'
    ],
    accessibility: {
      wheelchairAccessible: true,
      audioGuidesAvailable: true,
      lowPhysicalDemand: false,
      restAreasScore: 8,
      highlights: [
        'Mehrangarh Fort has modern elevator towers reaching the highest palatial terraces',
        'Golf cart transfers available across Udaipur City Palace courtyards',
        'Tactile scale models and multilingual audio wands at museum entries'
      ]
    },
    budget: {
      estimatedPerDay: 95,
      currency: 'USD',
      level: 'Moderate'
    },
    bestTime: 'October to March for pleasant sunny days and cool starlit desert evenings',
    estimatedDuration: '7 - 10 Days',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    threeDType: 'palace',
    categories: ['Heritage', 'Culture'],
    coordinates: {
      lat: 26.9124,
      lng: 75.7873
    },
    hotspots: [
      {
        id: 'raj-mehrangarh',
        title: 'Mehrangarh Citadel Heights',
        description: 'Imposing cliffside fortress towers high above the maze of indigo-blue painted houses of Jodhpur.',
        audioNarration: 'Gaze out across the Blue City below. The ramparts carry echoes of royal cannon salutes and folk trumpets.',
        position: [-3.8, 2.5, -4],
        category: 'landmark'
      },
      {
        id: 'raj-udaipur-pichola',
        title: 'Lake Pichola Palace Terrace',
        description: 'White marble arches framing tranquil waters reflecting the Aravalli mountain ridges.',
        audioNarration: 'At twilight, the lamps along the ghats ignite, casting golden ribbons across the calm surface of the lake.',
        position: [4, 1.2, -4],
        category: 'viewpoint'
      }
    ]
  },
  {
    id: 'ladakh',
    name: 'Ladakh High-Altitude Plateau',
    region: 'Ladakh',
    country: 'India',
    description: 'The "Land of High Passes" features lunar-like rock canyons, cobalt Pangong Tso lake, and sacred Buddhist monasteries clinging to mountain crags.',
    culture: 'Tibetan Buddhist traditions, chanting monks, intricate thangka tapestries, prayer wheels, and festivals celebrating mountain spirits.',
    food: [
      'Steaming vegetable momos with chili dip',
      'Thukpa hearty noodle soup',
      'Butter Tea (Gur Gur Chai)',
      'Tsampa roasted barley porridge',
      'Skyu traditional pasta stew'
    ],
    attractions: [
      'Pangong Tso High-Altitude Lake',
      'Thiksey & Hemis Monasteries',
      'Nubra Valley & Hunder Sand Dunes',
      'Khardung La Mountain Pass',
      'Magnetic Hill & Indus Zanskar Confluence'
    ],
    activities: [
      'Morning monastery chanting mindfulness session',
      'Virtual high-altitude pass drive without altitude stress',
      'Bactrian camel desert panorama',
      'Starlight Milky Way observatory session',
      'Spinning the gilded prayer wheels at Thiksey'
    ],
    accessibility: {
      wheelchairAccessible: false,
      audioGuidesAvailable: true,
      lowPhysicalDemand: false,
      restAreasScore: 7,
      highlights: [
        'VIRTUAL VISIT ADVANTAGE: Experience 14,000ft altitudes without Acute Mountain Sickness (AMS) or oxygen requirements',
        'Lower courtyard access at Thiksey Monastery equipped with ramps',
        'Full high-definition 360 audio guides for non-ambulatory explorers'
      ]
    },
    budget: {
      estimatedPerDay: 110,
      currency: 'USD',
      level: 'Luxury'
    },
    bestTime: 'June to September for open passes and crystal-blue skies',
    estimatedDuration: '6 - 9 Days',
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
    threeDType: 'mountain',
    categories: ['Adventure', 'Mountain', 'Heritage', 'Culture'],
    coordinates: {
      lat: 34.1526,
      lng: 77.5771
    },
    hotspots: [
      {
        id: 'ladakh-pangong',
        title: 'Pangong Tso Shoreline',
        description: 'Vast saline lake shifting between aquamarine, deep cobalt, and purple hues against barren peaks.',
        audioNarration: 'You are looking out across a lake stretching over 130 kilometers across international borders at 14,270 feet.',
        position: [-4.2, 0.8, -4],
        category: 'landmark'
      },
      {
        id: 'ladakh-thiksey',
        title: 'Thiksey Chanting Hall',
        description: 'Twelve-tiered whitewashed monastic complex reminiscent of the Potala Palace of Lhasa.',
        audioNarration: 'Deep, resonant tones from the 10-foot alpine horns resonate off the ancient stone and clay walls.',
        position: [3.8, 2.8, -5],
        category: 'culture'
      }
    ]
  },
  {
    id: 'konark',
    name: 'Konark Sun Temple & Coast',
    region: 'Odisha',
    country: 'India',
    description: 'UNESCO World Heritage masterpiece carved as a colossal stone chariot of the Sun God Surya, complete with 24 intricately sculpted wheels along the Bay of Bengal.',
    culture: 'Kalinga architectural genius, Odissi classical dance rhythm, stone carving guilds, and sacred coastal festivals.',
    food: [
      'Chhena Poda (caramelized baked cheese dessert)',
      'Dalma (lentil stew with raw papaya & pumpkin)',
      'Odisha Khaja crisp layered sweet',
      'Fresh coconut malai',
      'Pakhala Bhat cooling fermented rice dish'
    ],
    attractions: [
      'Konark Sun Temple Sanctuary',
      'Chandrabhaga Clean Blue Flag Beach',
      'Konark Archaeological Museum',
      'Marine Drive Golden Sands Eco Retreat',
      'Raghurajpur Heritage Pattachitra Crafts Village'
    ],
    activities: [
      'Decoding the ancient stone sundial timekeeping wheel',
      'Odissi classical dance mudra demonstration',
      'Sunrise beach meditation audio experience',
      'Pattachitra palm-leaf scroll painting walkthrough',
      'Architectural balance & magnetic myth exploration'
    ],
    accessibility: {
      wheelchairAccessible: true,
      audioGuidesAvailable: true,
      lowPhysicalDemand: true,
      restAreasScore: 9,
      highlights: [
        'Smooth wide paved stone pathways throughout the entire perimeter of the Sun Temple',
        'Wheelchair ramps leading to all major viewing platforms',
        'Braille signage panels and synchronized descriptive audio guide wands'
      ]
    },
    budget: {
      estimatedPerDay: 60,
      currency: 'USD',
      level: 'Budget'
    },
    bestTime: 'October to March for gentle sea breezes and pleasant sunshine',
    estimatedDuration: '3 - 5 Days',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
    threeDType: 'temple',
    categories: ['Heritage', 'Culture', 'Beach'],
    coordinates: {
      lat: 19.8876,
      lng: 86.0945
    },
    hotspots: [
      {
        id: 'konark-sundial-wheel',
        title: 'The Great Chariot Sundial',
        description: 'Exquisitely carved stone wheel whose spokes accurately calculate exact time to the minute using sunlight shadows.',
        audioNarration: 'Look closely at the spokes and medallions. Each carving reveals the daily rhythm of life in 13th-century Odisha.',
        position: [-3.5, 1.5, -4],
        category: 'landmark'
      },
      {
        id: 'konark-chandrabhaga',
        title: 'Chandrabhaga Sunrise Beach',
        description: 'Golden sand shores where dawn paints the Bay of Bengal in pink and liquid gold.',
        audioNarration: 'Breathe in the mineral salt air as fishing boats glide through the morning surf under the golden sun.',
        position: [4, 0.4, -4.5],
        category: 'viewpoint'
      }
    ]
  }
];

export const SAMPLE_ACHIEVEMENTS = [
  {
    id: 'explorer',
    title: 'Explorer',
    description: 'Visited 3 unique destinations virtually or in simulation.',
    icon: 'Compass',
    unlocked: true,
    unlockedAt: '2026-10-01',
    progress: 3,
    maxProgress: 3
  },
  {
    id: 'culture-explorer',
    title: 'Culture Explorer',
    description: 'Discovered the cultural arts and local cuisine of 2 regions.',
    icon: 'Sparkles',
    unlocked: true,
    unlockedAt: '2026-10-02',
    progress: 2,
    maxProgress: 2
  },
  {
    id: 'heritage-hunter',
    title: 'Heritage Hunter',
    description: 'Explored a UNESCO World Heritage architectural site.',
    icon: 'Landmark',
    unlocked: true,
    unlockedAt: '2026-10-03',
    progress: 1,
    maxProgress: 1
  },
  {
    id: 'virtual-adventurer',
    title: 'Virtual Adventurer',
    description: 'Completed a 3D Virtual Visit experience and interacted with all hotspots.',
    icon: 'Glasses',
    unlocked: false,
    progress: 1,
    maxProgress: 3
  },
  {
    id: 'mountain-soul',
    title: 'Mountain Soul',
    description: 'Simulated or virtually visited Kashmir or Ladakh.',
    icon: 'Mountain',
    unlocked: true,
    unlockedAt: '2026-10-03',
    progress: 1,
    maxProgress: 1
  }
];
