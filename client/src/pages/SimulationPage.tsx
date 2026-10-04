import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { DESTINATIONS } from '../data/destinations';
import { SimulationParams, SimulationResult, SimulationStage, AccessibilityPreference } from '../types';
import { useGamification } from '../context/GamificationContext';
import {
  SlidersHorizontal,
  Calendar,
  Users,
  DollarSign,
  Hotel,
  Bus,
  Accessibility,
  Compass,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  CloudSun,
  CheckCircle2,
  Clock,
  Layers
} from 'lucide-react';

const SIMULATION_STAGES: { name: string; percentage: number; detail: string }[] = [
  { name: 'Hotel & Lodging Accessibility', percentage: 15, detail: 'Validating elevator availability, step-free access, and quiet zones...' },
  { name: 'Transportation & Transit Route', percentage: 30, detail: 'Calculating travel distance, transit transfers, and boarding ramps...' },
  { name: 'Road & Elevation Conditions', percentage: 45, detail: 'Forecasting altitude changes, road hairpin turns, and transit comfort...' },
  { name: 'Tourist Destination Telemetry', percentage: 60, detail: 'Mapping monument terrain, paved avenues, and rest pavilions...' },
  { name: 'Crowd Density Estimation', percentage: 75, detail: 'Simulating visitor footfall, peak queue windows, and sensory congestion...' },
  { name: 'Weather & Microclimate Simulation', percentage: 88, detail: 'Evaluating precipitation probability, temperature, and sun exposure...' },
  { name: 'Activities & Sensory Pacing', percentage: 100, detail: 'Calibrating physical demands, rest intervals, and customized plans...' },
];

export const SimulationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { saveSimulation } = useGamification();

  const initialDest = searchParams.get('destination') || 'kashmir';

  const [step, setStep] = useState<number>(1);
  const [destinationId, setDestinationId] = useState<string>(initialDest);
  const [startDate, setStartDate] = useState<string>('2026-11-10');
  const [endDate, setEndDate] = useState<string>('2026-11-15');
  const [travellers, setTravellers] = useState<number>(2);
  const [budget, setBudget] = useState<'Budget' | 'Moderate' | 'Luxury'>('Moderate');
  const [accommodation, setAccommodation] = useState<'Boutique Hotel' | 'Eco Resort' | 'Heritage Homestay' | 'Standard Hotel'>('Boutique Hotel');
  const [transportation, setTransportation] = useState<'Scenic Train' | 'Private Cab' | 'Flight' | 'Accessible Tour Bus'>('Private Cab');
  const [selectedActivities, setSelectedActivities] = useState<string[]>(['Shikara sunrise cruise with audio meditation', 'Local market virtual souvenir stroll']);
  const [accessibilityReqs, setAccessibilityReqs] = useState<AccessibilityPreference[]>(['Low Motion', 'Senior Friendly']);

  // Engine run state
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  const selectedDestination = DESTINATIONS.find((d) => d.id === destinationId) || DESTINATIONS[0];

  const toggleAccessibility = (item: AccessibilityPreference) => {
    setAccessibilityReqs(prev =>
      prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]
    );
  };

  const toggleActivity = (act: string) => {
    setSelectedActivities(prev =>
      prev.includes(act) ? prev.filter(x => x !== act) : [...prev, act]
    );
  };

  const handleStartSimulation = () => {
    setIsSimulating(true);
    setCurrentStageIndex(0);
    setSimulationResult(null);

    // Progress animation loop
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx < SIMULATION_STAGES.length) {
        setCurrentStageIndex(idx);
      } else {
        clearInterval(interval);
        finishSimulation();
      }
    }, 600);
  };

  const finishSimulation = () => {
    const diffDays = Math.max(
      1,
      Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24))
    );

    const basePerDay = budget === 'Budget' ? 55 : budget === 'Moderate' ? 95 : 170;
    const estimatedTotal = diffDays * travellers * basePerDay;

    const result: SimulationResult = {
      id: `sim-${Date.now()}`,
      params: {
        destinationId,
        startDate,
        endDate,
        travellers,
        budget,
        accommodation,
        transportation,
        selectedActivities,
        accessibilityRequirements: accessibilityReqs
      },
      estimatedDuration: `${diffDays} Days / ${diffDays - 1} Nights`,
      estimatedBudget: estimatedTotal,
      currency: 'USD',
      accommodationDetail: `${accommodation} with verified accessible ground-floor entry and quiet courtyard.`,
      transportationDetail: `${transportation} booked with luggage assistance and low-vibration transit.`,
      crowdLevel: 'Moderate',
      crowdInsight: 'Peak tourist influx expected between 11:30 AM and 2:30 PM. Recommended touring slots: Early morning (7:30 - 10:00 AM) and serene twilight.',
      weatherConditions: {
        temp: '14°C - 19°C (57°F - 66°F)',
        condition: 'Clear skies with crisp evening breeze',
        clothingAdvice: 'Layered thermal clothing, wool wrap, comfortable walking shoes with rubber grip.'
      },
      accessibilityAnalysis: {
        score: selectedDestination.accessibility.restAreasScore,
        rating: selectedDestination.accessibility.restAreasScore >= 8 ? 'Excellent' : 'Good',
        notes: [
          'Step-free transit vehicles are available upon booking reservation.',
          'Designated rest pavilions every 100 meters at major heritage entryways.',
          'Audio transcripts and sensory quiet spots verified for low sensory fatigue.'
        ]
      },
      activitiesPlanned: selectedActivities.length > 0 ? selectedActivities : selectedDestination.activities.slice(0, 2),
      potentialChallenges: [
        'Potential road switchbacks during ascent; motion-sickness precautions suggested.',
        'High afternoon sunlight exposure near open courtyards; wide-brim hat advised.'
      ],
      aiRecommendations: [
        `Book the sunrise slot for ${selectedDestination.name} to avoid queue waiting times.`,
        'Carry local cash for small artisan craft purchases and tea stalls.',
        'Download offline maps via TravelTwin for continuous sensory guides.'
      ],
      createdAt: new Date().toISOString()
    };

    setIsSimulating(false);
    setSimulationResult(result);
    saveSimulation(result);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
          <SlidersHorizontal className="w-3.5 h-3.5 text-teal-400" />
          <span>Real-World Trip Confidence Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Pre-Travel Journey Simulator
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Simulate hotel, transportation, road, crowd levels, weather conditions, and accessibility constraints before committing real-world time or resources.
        </p>
      </div>

      {/* Main Container */}
      {!simulationResult && !isSimulating && (
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl space-y-8">
          {/* Step Indicators */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10 text-xs">
            <span className="font-bold text-white">
              Simulation Setup • Stage {step} of 4
            </span>
            <span className="text-slate-400 text-[11px]">
              Destination: <strong className="text-brand-300">{selectedDestination.name}</strong>
            </span>
          </div>

          {/* STEP 1: Destination & Dates */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-base font-bold text-white mb-1">Select Destination & Travel Dates</h3>
                <p className="text-xs text-slate-400">Choose the destination sanctuary and prospective travel window.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Destination</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {DESTINATIONS.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDestinationId(d.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        destinationId === d.id
                          ? 'bg-brand-500/20 border-brand-400 text-white shadow-glow-sky'
                          : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="font-bold text-xs">{d.name}</div>
                      <div className="text-[10px] text-slate-400">{d.region}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-400"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold text-xs shadow-glow-sky flex items-center space-x-2"
                >
                  <span>Next: Travellers & Budget</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Travellers, Budget, & Lodging */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-base font-bold text-white mb-1">Party Size & Hospitality Tier</h3>
                <p className="text-xs text-slate-400">Configure financial bandwidth and lodging style.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Number of Travellers</label>
                  <select
                    value={travellers}
                    onChange={(e) => setTravellers(parseInt(e.target.value, 10))}
                    className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-400"
                  >
                    <option value={1}>Solo Explorer (1)</option>
                    <option value={2}>Couple / Pair (2)</option>
                    <option value={3}>Small Group (3)</option>
                    <option value={4}>Family (4)</option>
                    <option value={6}>Group Travel (6+)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Budget Comfort Tier</label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-400"
                  >
                    <option value="Budget">Budget ($55/day/person)</option>
                    <option value="Moderate">Moderate Comfort ($95/day/person)</option>
                    <option value="Luxury">Luxury & Wellness ($170/day/person)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Accommodation Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['Boutique Hotel', 'Eco Resort', 'Heritage Homestay', 'Standard Hotel'] as const).map((acc) => (
                    <button
                      key={acc}
                      type="button"
                      onClick={() => setAccommodation(acc)}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        accommodation === acc
                          ? 'bg-brand-500/20 border-brand-400 text-white'
                          : 'bg-white/5 border-white/5 text-slate-300'
                      }`}
                    >
                      {acc}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 text-slate-300 text-xs font-semibold"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold text-xs shadow-glow-sky flex items-center space-x-2"
                >
                  <span>Next: Transit & Activities</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Transportation & Activities */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-base font-bold text-white mb-1">Transportation & Desired Activities</h3>
                <p className="text-xs text-slate-400">Choose vehicle preference and prioritize destinations highlights.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Primary Transportation</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['Private Cab', 'Accessible Tour Bus', 'Scenic Train', 'Flight'] as const).map((tr) => (
                    <button
                      key={tr}
                      type="button"
                      onClick={() => setTransportation(tr)}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        transportation === tr
                          ? 'bg-teal-500/20 border-teal-400 text-white'
                          : 'bg-white/5 border-white/5 text-slate-300'
                      }`}
                    >
                      {tr}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Select Activities to Simulate at {selectedDestination.name}
                </label>
                <div className="space-y-2">
                  {selectedDestination.activities.map((act) => {
                    const isChecked = selectedActivities.includes(act);
                    return (
                      <button
                        key={act}
                        type="button"
                        onClick={() => toggleActivity(act)}
                        className={`w-full p-3 rounded-xl border text-left text-xs flex items-center justify-between transition-all ${
                          isChecked
                            ? 'bg-brand-500/20 border-brand-400 text-white'
                            : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <span>{act}</span>
                        {isChecked && <CheckCircle2 className="w-4 h-4 text-brand-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 text-slate-300 text-xs font-semibold"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-semibold text-xs shadow-glow-teal flex items-center space-x-2"
                >
                  <span>Next: Accessibility Checks</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Accessibility & Trigger Simulation */}
          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-base font-bold text-white mb-1">Accessibility Constraints & Requirements</h3>
                <p className="text-xs text-slate-400">
                  Select any requirements to evaluate against local infrastructure.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(['Low Motion', 'Senior Friendly', 'Mobility Friendly', 'Audio Guide', 'Text Guide'] as AccessibilityPreference[]).map((acc) => {
                  const isChecked = accessibilityReqs.includes(acc);
                  return (
                    <button
                      key={acc}
                      type="button"
                      onClick={() => toggleAccessibility(acc)}
                      className={`p-3 rounded-xl border text-left text-xs flex items-center justify-between transition-all ${
                        isChecked
                          ? 'bg-teal-500/20 border-teal-400 text-white'
                          : 'bg-white/5 border-white/5 text-slate-300'
                      }`}
                    >
                      <span>{acc}</span>
                      {isChecked && <CheckCircle2 className="w-4 h-4 text-teal-400" />}
                    </button>
                  );
                })}
              </div>

              {/* Ready to Simulate Box */}
              <div className="p-4 rounded-2xl bg-white/5 border border-teal-500/30 text-xs space-y-1">
                <div className="font-bold text-teal-300">Ready to Launch Multi-Stage Simulation Engine</div>
                <p className="text-[11px] text-slate-400">
                  The simulation engine will assess hotel ramp telemetry, crowd density forecasts, weather exposure, and route feasibility.
                </p>
              </div>

              <div className="flex justify-between pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 text-slate-300 text-xs font-semibold"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleStartSimulation}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-brand-500 hover:opacity-95 text-white font-semibold text-xs shadow-glow-teal flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start Simulation</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SIMULATION ENGINE LIVE PROGRESS ANIMATION */}
      {isSimulating && (
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-teal-500/30 shadow-2xl space-y-8 animate-fade-in text-center">
          <div className="space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 animate-spin" />
              Live Simulation Engine Active
            </span>
            <h2 className="text-2xl font-bold text-white">
              Simulating Journey to {selectedDestination.name}
            </h2>
            <p className="text-xs text-slate-400">
              {SIMULATION_STAGES[currentStageIndex].detail}
            </p>
          </div>

          {/* Large Progress Bar */}
          <div className="max-w-md mx-auto space-y-2">
            <div className="flex justify-between text-xs font-semibold text-teal-300">
              <span>{SIMULATION_STAGES[currentStageIndex].name}</span>
              <span>{SIMULATION_STAGES[currentStageIndex].percentage}%</span>
            </div>
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-teal-400 via-sky-400 to-brand-400 rounded-full transition-all duration-500 shadow-glow-teal"
                style={{ width: `${SIMULATION_STAGES[currentStageIndex].percentage}%` }}
              />
            </div>
          </div>

          {/* Stepper Grid showing stages */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 max-w-2xl mx-auto text-[10px]">
            {SIMULATION_STAGES.map((s, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-xl border text-center transition-colors ${
                  idx <= currentStageIndex
                    ? 'bg-teal-500/20 border-teal-400 text-white'
                    : 'bg-white/5 border-white/5 text-slate-500'
                }`}
              >
                {s.name.split(' ')[0]} ({s.percentage}%)
              </div>
            ))}
          </div>

          {/* Label required by prompt */}
          <div className="p-3 rounded-xl bg-navy-950/80 border border-white/10 text-[11px] text-slate-400 max-w-md mx-auto">
            * <em>Estimated / Simulated Information</em> — Generated using synthetic telemetry and regional travel patterns.
          </div>
        </div>
      )}

      {/* SIMULATION RESULT DISPLAY */}
      {simulationResult && !isSimulating && (
        <div className="space-y-8 animate-fade-in">
          {/* Top Banner Notice */}
          <div className="p-3 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-xs text-brand-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-400 shrink-0" />
              <span>
                <strong>Estimated / Simulated Information:</strong> Simulated trip models completed for{' '}
                {selectedDestination.name}.
              </span>
            </div>
            <span className="text-[10px] text-teal-400 font-mono">+200 XP ADDED</span>
          </div>

          <div className="glass-card rounded-3xl p-6 sm:p-10 border border-teal-500/30 shadow-2xl space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400">
                  Simulation Results Summary
                </span>
                <h2 className="text-2xl font-bold text-white mt-1">
                  Trip to {selectedDestination.name}
                </h2>
                <div className="text-xs text-slate-400 mt-1">
                  {simulationResult.estimatedDuration} • {travellers} Traveller(s) • Tier: {budget}
                </div>
              </div>

              {/* Action: Generate AI Itinerary */}
              <button
                type="button"
                onClick={() => navigate(`/itinerary/${destinationId}?simId=${simulationResult.id}`)}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-teal-500 to-brand-500 hover:opacity-95 text-white font-semibold text-xs shadow-glow-teal flex items-center space-x-2 transition-all shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate AI Travel Plan</span>
              </button>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-teal-400" />
                  Estimated Budget
                </span>
                <div className="text-xl font-extrabold text-white">
                  ${simulationResult.estimatedBudget} {simulationResult.currency}
                </div>
                <div className="text-[10px] text-slate-400">Includes lodging & local transit</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-sky-400" />
                  Crowd Density
                </span>
                <div className="text-xl font-extrabold text-sky-300">
                  {simulationResult.crowdLevel}
                </div>
                <div className="text-[10px] text-slate-400">Low queue windows at dawn</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                  <Accessibility className="w-3.5 h-3.5 text-brand-400" />
                  Accessibility Score
                </span>
                <div className="text-xl font-extrabold text-brand-300">
                  {simulationResult.accessibilityAnalysis.score}/10 ({simulationResult.accessibilityAnalysis.rating})
                </div>
                <div className="text-[10px] text-slate-400">Rest areas & step-free paths</div>
              </div>
            </div>

            {/* Deep Dive Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hotel & Transportation */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-navy-900/60 border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Hotel className="w-4 h-4 text-brand-400" />
                    <span>Accommodation Feasibility</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {simulationResult.accommodationDetail}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-navy-900/60 border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Bus className="w-4 h-4 text-teal-400" />
                    <span>Transportation & Route Analysis</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {simulationResult.transportationDetail}
                  </p>
                </div>
              </div>

              {/* Weather & Crowd */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-navy-900/60 border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <CloudSun className="w-4 h-4 text-amber-400" />
                    <span>Weather & Microclimate Conditions</span>
                  </div>
                  <div className="text-xs text-slate-200 font-semibold">
                    {simulationResult.weatherConditions.temp} • {simulationResult.weatherConditions.condition}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Advice: {simulationResult.weatherConditions.clothingAdvice}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-navy-900/60 border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Users className="w-4 h-4 text-sky-400" />
                    <span>Crowd Considerations</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {simulationResult.crowdInsight}
                  </p>
                </div>
              </div>
            </div>

            {/* Potential Challenges & AI Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-300">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Potential Challenges Identified</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {simulationResult.potentialChallenges.map((c, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-rose-400 mt-1">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-teal-300">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Recommendations</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {simulationResult.aiRecommendations.map((r, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setSimulationResult(null)}
                className="text-slate-400 hover:text-white"
              >
                ← Run Another Simulation
              </button>

              <button
                type="button"
                onClick={() => navigate(`/itinerary/${destinationId}?simId=${simulationResult.id}`)}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-teal-500 to-brand-500 text-white font-semibold shadow-glow-teal"
              >
                Generate Day-by-Day AI Plan →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
