import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DESTINATIONS } from '../data/destinations';
import { Itinerary, ItineraryDay } from '../types';
import { useGamification } from '../context/GamificationContext';
import { aiApi } from '../lib/api';
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  DollarSign,
  Accessibility,
  BookmarkCheck,
  RotateCcw,
  ArrowLeft,
  Share2,
  Luggage,
  Loader2
} from 'lucide-react';

const CANONICAL_ITINERARIES: Record<
  string,
  { days: ItineraryDay[]; totalBudget: string; packing: string[] }
> = {
  kashmir: {
    totalBudget: '$275 USD',
    packing: ['Layered light woolens', 'Slip-resistant walking shoes', 'Noise-canceling headphones', 'Thermal water flask'],
    days: [
      {
        day: 1,
        title: 'Arrival, Cedar Houseboat Check-in & Sunset Shikara',
        morning: 'Scenic transit arrival and check-in to verified step-free boutique sanctuary.',
        afternoon: 'Unpack, rest, and enjoy aromatic saffron Kahwa tea in the quiet courtyard pavilion.',
        evening: 'Tranquil twilight Shikara cruise on Dal Lake with low-motion sensory pace.',
        accessibilityTip: 'Boarding ramps and luggage attendants on standby at Jetty 4.',
        estimatedExpense: '$65'
      },
      {
        day: 2,
        title: 'Alpine Vista Gondola & Pine Forest Meditation Walk',
        morning: 'Morning gondola ride to alpine ridge with designated elevator boarding.',
        afternoon: 'Gentle guided meadow photography walk with bench rest points every 75 meters.',
        evening: 'Traditional Kashmiri Wazwan tasting dinner with organic seasonal vegetables.',
        accessibilityTip: 'Phase 1 Gondola terminal features level thresholds and priority accessible cars.',
        estimatedExpense: '$90'
      },
      {
        day: 3,
        title: 'Mughal Terraced Gardens & Artisan Weaving Workshop',
        morning: 'Step-free paved exploration through Nishat Bagh cascading water fountains.',
        afternoon: 'Hands-on preview of royal Pashmina and silk carpet loom craftsmanship.',
        evening: 'Acoustic Sufi string performance at local cultural amphitheater.',
        accessibilityTip: 'Wheelchair loan available free of charge at the garden visitor reception.',
        estimatedExpense: '$50'
      },
      {
        day: 4,
        title: 'High-Altitude Valley Vista & Local Spice Bazaars',
        morning: 'Smooth electric golf-cart or private cab transit to scenic river valley.',
        afternoon: 'Sample fragrant saffron harvests, dried morels, and pure walnut oil.',
        evening: 'Sunset reflection journal session overlooking the Himalayan mountain silhouette.',
        accessibilityTip: 'Level stone pathways throughout the inner spice market arcade.',
        estimatedExpense: '$70'
      }
    ]
  },
  goa: {
    totalBudget: '$240 USD',
    packing: ['Breathable linen/cotton', 'Polarized sunglasses', 'Beach sandals with heel strap', 'Mineral reef-safe sunscreen'],
    days: [
      {
        day: 1,
        title: 'Palolem Beach Arrival, Amber Sands & Sol Kadhi Welcome',
        morning: 'Scenic coastal transfer and check-in to beachfront accessible eco-bungalow.',
        afternoon: 'Sip cooling kokum sol kadhi under shady swaying coconut palms.',
        evening: 'Gentle sunset stroll along Palolem cove utilizing beach wheelchair accessibility mats.',
        accessibilityTip: 'Beach access mats and gentle ramps leading directly to the tide line.',
        estimatedExpense: '$55'
      },
      {
        day: 2,
        title: 'Fontainhas Latin Quarter & Portuguese Ceramic Art',
        morning: 'Step-free walk along terracotta, cobalt, and mustard heritage Portuguese havelis.',
        afternoon: 'Azulejo hand-glazed ceramic tile workshop demonstration.',
        evening: 'Tasting seven-layered Bebinca dessert with traditional acoustic coastal melodies.',
        accessibilityTip: 'Smooth paved pavements throughout Rua 31 de Janeiro.',
        estimatedExpense: '$65'
      },
      {
        day: 3,
        title: 'UNESCO Basilica of Bom Jesus & River Eco-Cruise',
        morning: 'Explore 16th-century golden baroque architecture with descriptive audio guide wands.',
        afternoon: 'Step-free catamaran cruise on the tranquil Mandovi River.',
        evening: 'Authentic Goan vegetable caldin and red rice tasting in heritage courtyard.',
        accessibilityTip: 'Wide level stone thresholds and priority step-free boat boarding.',
        estimatedExpense: '$60'
      },
      {
        day: 4,
        title: 'Divar Island Organic Spice Plantation & Dolphin Bay',
        morning: 'Early morning dolphin-spotting boat ride with quiet electric motor.',
        afternoon: 'Sensory walking tour through vanilla, nutmeg, and cinnamon plantations.',
        evening: 'Sunset shoreline reflection and coastal souvenir crafting.',
        accessibilityTip: 'Flat shaded garden paths with golf-cart transfers available upon request.',
        estimatedExpense: '$60'
      }
    ]
  },
  rajasthan: {
    totalBudget: '$310 USD',
    packing: ['Wide-brim hat', 'UV-protection sunglasses', 'Light breathable cottons', 'Hydration electrolyte flask'],
    days: [
      {
        day: 1,
        title: 'Arrival in Jodhpur, Mehrangarh Ramparts & Desert Sunset',
        morning: 'Arrival and private transfer to royal heritage haveli courtyard.',
        afternoon: 'High-speed elevator ride to Mehrangarh 400-foot basalt ramparts.',
        evening: 'Blue City panoramic sunset vista accompanied by welcome saffron lassi.',
        accessibilityTip: 'Heavy-duty elevators connect the main gate to upper palace courtyards.',
        estimatedExpense: '$80'
      },
      {
        day: 2,
        title: 'City Palace Courtyards & Pichola Lake Step-Free Cruise',
        morning: 'Electric buggy tour through marble courtyards and Sheesh Mahal mirror galleries.',
        afternoon: 'Traditional Dal Baati Churma authentic royal thali lunch.',
        evening: 'Level boarding sunset boat cruise across Lake Pichola under illuminated palace walls.',
        accessibilityTip: 'Step-free boarding docks and complimentary electric mobility buggies.',
        estimatedExpense: '$85'
      },
      {
        day: 3,
        title: 'Amber Fort Citadel & Textile Block-Printing Guilds',
        morning: 'Smooth vehicle drop-off at Amber Fort ground terrace with audio guide.',
        afternoon: 'Live demonstration of natural vegetable dye wooden block-printing.',
        evening: 'Rajasthani puppet theater and live desert sarangi string performance.',
        accessibilityTip: 'Designated flat viewing terraces and tactile craft stations.',
        estimatedExpense: '$75'
      },
      {
        day: 4,
        title: 'Thar Sand Dune Horizon & Stargazing Banquet',
        morning: 'Gentle sunrise photo walk over calm undulating desert sands.',
        afternoon: 'Restful shade break with chilled spiced buttermilk and almond ghevar.',
        evening: 'Stargazing dinner accompanied by Manganiyar folk ballads.',
        accessibilityTip: 'Raised wooden walkways over soft sand dunes at desert camps.',
        estimatedExpense: '$70'
      }
    ]
  },
  kerala: {
    totalBudget: '$220 USD',
    packing: ['Breathable rain shell', 'Comfortable walking sandals', 'Mosquito repellent spray', 'Herbal cooling mist'],
    days: [
      {
        day: 1,
        title: 'Fort Kochi Promenade & Chinese Fishing Nets',
        morning: 'Check-in to serene heritage colonial hotel overlooking the Arabian Sea harbor.',
        afternoon: 'Paved stroll beside monumental cantilevered Chinese fishing nets.',
        evening: 'Sample steamed Appam with fragrant coconut vegetable stew.',
        accessibilityTip: 'Smooth paved waterfront promenade with abundant rest benches.',
        estimatedExpense: '$50'
      },
      {
        day: 2,
        title: 'Alleppey Solar Kettuvallam Houseboat & Lagoon Cruise',
        morning: 'Step-free ramp boarding onto silent solar-powered bamboo houseboat.',
        afternoon: 'Float through emerald canals fringed with blooming water lilies and paddy fields.',
        evening: 'Fresh pearl spot fish/plantain curry prepared on board by personal chef.',
        accessibilityTip: 'Houseboats equipped with boarding gangways and wide ground-deck staterooms.',
        estimatedExpense: '$65'
      },
      {
        day: 3,
        title: 'Munnar Highland Tea Estate & Cardamom Vista',
        morning: 'Scenic drive through rolling emerald hills at 5,000 feet altitude.',
        afternoon: 'Gentle terrace walk through lush tea bushes and Tata tea museum.',
        evening: 'Aromatic cardamom, clove, and cinnamon tea tasting masterclass.',
        accessibilityTip: 'Paved garden paths and wheelchair-accessible museum galleries.',
        estimatedExpense: '$55'
      },
      {
        day: 4,
        title: 'Ayurvedic Botanical Sanctuary & Kathakali Performance',
        morning: 'Guided herbal garden stroll learning ancient wellness and healing flora.',
        afternoon: 'Restorative Ayurvedic consultation and warm herbal oil compress.',
        evening: 'Classical Kathakali dance-theatre performance showcasing expressive facial mudras.',
        accessibilityTip: 'Auditorium ground-floor reserved seating with audio translation headset.',
        estimatedExpense: '$50'
      }
    ]
  },
  ladakh: {
    totalBudget: '$340 USD',
    packing: ['Thermal fleece & windproof coat', 'UV 400 alpine sunglasses', 'Insulated thermal water bottle', 'Moisturizing lip balm'],
    days: [
      {
        day: 1,
        title: 'Leh Plateau Arrival, Acclimatization & Po Cha Tea',
        morning: 'Gentle flight arrival into Leh (11,500 ft) and assisted hotel transfer.',
        afternoon: 'Mandatory restful acclimatization with warm Tibetan butter tea and tsampa.',
        evening: 'Short flat walk around Leh Peace Market with zero elevation gain.',
        accessibilityTip: 'Oxygen concentrators and 24/7 medical assistance available at hotels.',
        estimatedExpense: '$80'
      },
      {
        day: 2,
        title: 'Thiksey Monastery Sunrise Chants & Shanti Stupa',
        morning: 'Witness morning prayer chants and copper butter lamps in the 12-story gompa.',
        afternoon: 'Vehicle transfer directly to Shanti Stupa upper parking for step-free valley vista.',
        evening: 'Steaming Tibetan vegetable Thukpa noodle soup and steamed momos.',
        accessibilityTip: 'Vehicle access roads lead to upper monastery courtyards, minimizing stairs.',
        estimatedExpense: '$90'
      },
      {
        day: 3,
        title: 'Pangong Tso Cobalt Waters & Lakeside Reflection',
        morning: 'Scenic journey through the high Himalayas past Marmot meadows.',
        afternoon: 'Stand on the shores of the world’s highest saltwater lake as its hue shifts.',
        evening: 'Lakeside solar-heated cottage stay with pristine unpolluted night sky.',
        accessibilityTip: 'Paved lakefront boardwalks with wheelchair loan stations.',
        estimatedExpense: '$95'
      },
      {
        day: 4,
        title: 'Nubra Valley White Dunes & Bactrian Camel Walk',
        morning: 'Cross scenic Khardungla pass with panoramic high-altitude viewing platform.',
        afternoon: 'Gentle double-humped camel ride across the cold desert sand dunes.',
        evening: 'Diskit monastery giant Maitreya Buddha statue photography under sunset glow.',
        accessibilityTip: 'Flat viewing decks at passes and level sand access pathways.',
        estimatedExpense: '$75'
      }
    ]
  },
  konark: {
    totalBudget: '$210 USD',
    packing: ['Light airy cottons', 'Sun umbrella / parasol', 'Polarized eyewear', 'Comfortable walking flats'],
    days: [
      {
        day: 1,
        title: 'Golden Coast Arrival & Marine Drive Sunset Stroll',
        morning: 'Arrival and check-in to eco-retreat along the Bay of Bengal coastline.',
        afternoon: 'Sample authentic Odisha Dalma lentil stew and fresh sweet tender coconut water.',
        evening: 'Gentle sunset walk along Chandrabhaga Blue Flag beach boardwalk.',
        accessibilityTip: 'Beach boardwalks and level promenade with rest gazebos every 50 meters.',
        estimatedExpense: '$45'
      },
      {
        day: 2,
        title: 'Konark Sun Temple Sanctuary & Ancient Sundial Decoding',
        morning: 'Step-free tour around the monumental 13th-century stone chariot of Surya.',
        afternoon: 'Interactive decoding of carved chariot wheels that tell exact astronomical time.',
        evening: 'Chhena Poda caramelized baked cottage cheese dessert tasting.',
        accessibilityTip: 'Perimeter pathways around the temple are completely paved and ramped.',
        estimatedExpense: '$60'
      },
      {
        day: 3,
        title: 'Chandrabhaga Sunrise Meditation & Archaeological Museum',
        morning: 'Spectacular dawn meditation overlooking morning fishing catamarans in the surf.',
        afternoon: 'Explore the Konark Archaeological Museum galleries with braille and audio guide.',
        evening: 'Marine Drive scenic ocean breeze drive and coastal handicraft stalls.',
        accessibilityTip: 'Museum features step-free entrance ramps, tactile replicas, and elevators.',
        estimatedExpense: '$50'
      },
      {
        day: 4,
        title: 'Raghurajpur Heritage Crafts Village & Odissi Dance',
        morning: 'Visit the UNESCO artisan hamlet where every home is an open art workshop.',
        afternoon: 'Hands-on palm-leaf pattachitra scroll painting demonstration.',
        evening: 'Intimate classical Odissi dance mudra recital at heritage amphitheater.',
        accessibilityTip: 'Level stone pathways throughout the artisan village street.',
        estimatedExpense: '$55'
      }
    ]
  }
};

export const ItineraryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { saveItinerary } = useGamification();

  const destination = DESTINATIONS.find((d) => d.id === id) || DESTINATIONS[0];

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const initialData =
    CANONICAL_ITINERARIES[destination.id] || CANONICAL_ITINERARIES['kashmir'];

  const [days, setDays] = useState<ItineraryDay[]>(initialData.days);
  const [totalBudget, setTotalBudget] = useState(initialData.totalBudget);
  const [packing, setPacking] = useState<string[]>(initialData.packing);

  // Sync when route params change
  useEffect(() => {
    const data =
      CANONICAL_ITINERARIES[destination.id] || CANONICAL_ITINERARIES['kashmir'];
    setDays(data.days);
    setTotalBudget(data.totalBudget);
    setPacking(data.packing);
  }, [destination.id]);

  const handleSave = () => {
    const newItinerary: Itinerary = {
      id: `itin-${Date.now()}`,
      destination: destination.name,
      title: `Curated ${days.length}-Day Journey: ${destination.name}`,
      summary: `Tailored travel blueprint for ${destination.name} featuring verified accessible routes and balanced cultural pacing.`,
      days,
      totalEstimatedBudget: totalBudget,
      suggestedPacking: packing,
      createdAt: new Date().toISOString()
    };

    saveItinerary(newItinerary);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const res = await aiApi.generateItinerary(destination.name, days.length || 4);
      if (res && res.itinerary && Array.isArray(res.itinerary.days) && res.itinerary.days.length > 0) {
        setDays(res.itinerary.days);
        if (res.itinerary.totalEstimatedBudget) {
          setTotalBudget(res.itinerary.totalEstimatedBudget);
        }
      } else {
        // Fallback variation
        setDays((prev) =>
          prev.map((d, i) => ({
            ...d,
            evening: i % 2 === 0 ? 'Twilight acoustic meditation and regional culinary tasting.' : d.evening
          }))
        );
      }
    } catch {
      // Graceful local variation
      setDays((prev) =>
        prev.map((d, i) => ({
          ...d,
          evening: i % 2 === 0 ? 'Sunset relaxation with sensory audio soundscape and local tea.' : d.evening
        }))
      );
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-10">
      {/* Top Banner Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard"
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/10 disabled:opacity-50"
          >
            {isRegenerating ? (
              <Loader2 className="w-3.5 h-3.5 text-brand-400 animate-spin" />
            ) : (
              <RotateCcw className="w-3.5 h-3.5 text-brand-400" />
            )}
            <span>{isRegenerating ? 'Generating...' : 'Regenerate with AI'}</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-brand-500 hover:opacity-95 text-white text-xs font-semibold shadow-glow-teal flex items-center gap-1.5 transition-all"
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>Save Trip Plan (+100 XP)</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs flex items-center justify-between animate-fade-in">
          <span className="flex items-center gap-2 font-medium">
            <Sparkles className="w-4 h-4 text-teal-400" />
            Itinerary successfully saved to your Traveler Dashboard!
          </span>
          <Link to="/dashboard" className="underline font-bold text-white text-[11px]">
            View in Dashboard →
          </Link>
        </div>
      )}

      {/* Hero Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400">
              AI Day-by-Day Master Blueprint
            </span>
            <h1 className="text-3xl font-extrabold text-white mt-1">
              {destination.name} Comprehensive Itinerary
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Optimized for sensory comfort, accessible pathways, crowd avoidance, and authentic regional gastronomy.
            </p>
          </div>

          <div className="text-right sm:border-l sm:border-white/10 sm:pl-6 shrink-0">
            <div className="text-xs text-slate-400">Estimated Total</div>
            <div className="text-2xl font-extrabold text-white">{totalBudget}</div>
            <div className="text-[10px] text-teal-300 font-semibold">{days.length} Days / {Math.max(1, days.length - 1)} Nights</div>
          </div>
        </div>

        {/* Suggested Packing */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1 text-[11px]">
            <Luggage className="w-3.5 h-3.5 text-brand-400" />
            Packing Essentials:
          </span>
          {packing.map((item, i) => (
            <span key={i} className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/5 text-[11px] text-slate-300">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Day by Day Cards */}
      <div className="space-y-6">
        {days.map((d) => (
          <div
            key={d.day}
            className="glass-card rounded-2xl p-6 border border-white/10 space-y-4 transition-all hover:border-brand-500/30"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-xs">
                  Day {d.day}
                </div>
                <h3 className="font-bold text-white text-sm sm:text-base">{d.title}</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">{d.estimatedExpense} approx</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  Morning (08:30 - 12:00)
                </span>
                <p className="text-slate-200 leading-relaxed">{d.morning}</p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300">
                  Afternoon (13:30 - 17:00)
                </span>
                <p className="text-slate-200 leading-relaxed">{d.afternoon}</p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
                  Evening (18:00 - 21:00)
                </span>
                <p className="text-slate-200 leading-relaxed">{d.evening}</p>
              </div>
            </div>

            {/* Accessibility Tip for the Day */}
            <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-[11px] text-teal-300 flex items-center gap-2">
              <Accessibility className="w-4 h-4 shrink-0 text-teal-400" />
              <span>
                <strong>Accessibility Tip:</strong> {d.accessibilityTip}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA to Return or Launch 3D */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white">Want to experience this route right now?</h4>
          <p className="text-xs text-slate-400">Launch the 3D virtual twin to explore these exact landmarks virtually.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate(`/experience/${destination.id}`)}
          className="py-2.5 px-6 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold text-xs shadow-glow-sky flex items-center gap-1.5 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Launch 3D Virtual Experience</span>
        </button>
      </div>
    </div>
  );
};
