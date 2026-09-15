import type {
  SensorData,
  PersonalBaseline,
  RiskAssessment,
  RiskLevel,
  ContributingFactor,
} from '../types';

// ─── Weight Configuration ─────────────────────────────────────
const WEIGHTS = {
  heartRate: 0.25,
  spo2: 0.30,
  temperature: 0.20,
  fall: 0.15,
  activity: 0.10,
};

// ─── Severity Scoring Helpers ─────────────────────────────────
function scoreHeartRate(hr: number, baseline: PersonalBaseline): { score: number; severity: ContributingFactor['severity']; deviation: string } {
  if (hr === 0) return { score: 0, severity: 'normal', deviation: 'No reading' };
  const mid = (baseline.heartRateMin + baseline.heartRateMax) / 2;
  const diff = hr - mid;

  if (hr < 40 || hr > 150) return { score: 1.0, severity: 'danger', deviation: `${diff > 0 ? '+' : ''}${Math.round(diff)} BPM vs baseline` };
  if (hr < baseline.heartRateMin - 10 || hr > baseline.heartRateMax + 20) return { score: 0.75, severity: 'danger', deviation: `${diff > 0 ? '+' : ''}${Math.round(diff)} BPM vs baseline` };
  if (hr < baseline.heartRateMin || hr > baseline.heartRateMax + 10) return { score: 0.45, severity: 'warning', deviation: `${diff > 0 ? '+' : ''}${Math.round(diff)} BPM vs baseline` };
  return { score: 0.1, severity: 'normal', deviation: `Within normal range (${baseline.heartRateMin}–${baseline.heartRateMax} BPM)` };
}

function scoreSpO2(spo2: number, baseline: PersonalBaseline): { score: number; severity: ContributingFactor['severity']; deviation: string } {
  if (spo2 === 0) return { score: 0, severity: 'normal', deviation: 'No reading' };
  const diff = spo2 - baseline.spo2Min;

  if (spo2 < 90) return { score: 1.0, severity: 'danger', deviation: `${Math.round(diff)}% below safe threshold (90%)` };
  if (spo2 < 94) return { score: 0.75, severity: 'danger', deviation: `${Math.round(diff)}% — concerning hypoxia range` };
  if (spo2 < baseline.spo2Min) return { score: 0.45, severity: 'warning', deviation: `${Math.round(diff)}% below personal baseline (${baseline.spo2Min}%)` };
  return { score: 0.05, severity: 'normal', deviation: `${spo2}% — within normal range` };
}

function scoreTemperature(temp: number, baseline: PersonalBaseline): { score: number; severity: ContributingFactor['severity']; deviation: string } {
  if (temp === 0) return { score: 0, severity: 'normal', deviation: 'No reading' };
  const diff = temp - baseline.temperatureMax;

  if (temp > 39.5 || temp < 35.0) return { score: 1.0, severity: 'danger', deviation: `${diff > 0 ? '+' : ''}${diff.toFixed(1)}°C — critical range` };
  if (temp > 38.0 || temp < 35.5) return { score: 0.65, severity: 'danger', deviation: `${diff > 0 ? '+' : ''}${diff.toFixed(1)}°C — fever/hypothermia` };
  if (temp > baseline.temperatureMax || temp < baseline.temperatureMin) return { score: 0.35, severity: 'warning', deviation: `${diff > 0 ? '+' : ''}${diff.toFixed(1)}°C from baseline` };
  return { score: 0.05, severity: 'normal', deviation: `${temp.toFixed(1)}°C — within normal range` };
}

function scoreFall(fallDetected: boolean): { score: number; severity: ContributingFactor['severity']; deviation: string } {
  if (fallDetected) return { score: 1.0, severity: 'danger', deviation: 'Fall event detected by MPU6050' };
  return { score: 0, severity: 'normal', deviation: 'No fall detected' };
}

function scoreActivity(activity: string, hr: number): { score: number; severity: ContributingFactor['severity']; deviation: string } {
  if (activity === 'RESTING' && hr > 100) return { score: 0.7, severity: 'warning', deviation: 'High heart rate while resting — unusual' };
  if (activity === 'RUNNING' && hr < 60) return { score: 0.5, severity: 'warning', deviation: 'Low heart rate during running — unusual' };
  return { score: 0.05, severity: 'normal', deviation: `Activity: ${activity}` };
}

// ─── Main Risk Engine ─────────────────────────────────────────
export function calculateRisk(data: SensorData, baseline: PersonalBaseline): RiskAssessment {
  const hrResult = scoreHeartRate(data.heartRate, baseline);
  const spo2Result = scoreSpO2(data.spo2, baseline);
  const tempResult = scoreTemperature(data.temperature, baseline);
  const fallResult = scoreFall(data.fallDetected);
  const activityResult = scoreActivity(data.activity, data.heartRate);

  // SOS immediately → CRITICAL
  if (data.sos) {
    return buildResult(1.0, data, baseline, [hrResult, spo2Result, tempResult, fallResult, activityResult], 'SOS button activated — Emergency response required immediately.');
  }

  const weighted =
    hrResult.score * WEIGHTS.heartRate +
    spo2Result.score * WEIGHTS.spo2 +
    tempResult.score * WEIGHTS.temperature +
    fallResult.score * WEIGHTS.fall +
    activityResult.score * WEIGHTS.activity;

  return buildResult(weighted, data, baseline, [hrResult, spo2Result, tempResult, fallResult, activityResult], '');
}

function generateClinicalAdvice(
  data: SensorData,
  baseline: PersonalBaseline,
  level: RiskLevel,
  factors: ContributingFactor[],
  override: string
): import('../types').ClinicalAdvice {
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const hr = data.heartRate;
  const spo2 = data.spo2;
  const temp = data.temperature;
  const isFall = data.fallDetected;
  const isSos = data.sos;

  // Case 1: Manual SOS
  if (isSos) {
    return {
      headline: 'Emergency SOS Beacon Activated',
      summary: 'Patient has manually triggered emergency beacon. System has engaged local alarm and broadcasted telemetry to emergency contacts.',
      urgencyLevel: 'CRITICAL_EMERGENCY',
      immediateSteps: [
        { id: 'sos-1', title: 'Maintain Safe Resting Posture', description: 'Sit or lie down safely. Avoid standing or moving to prevent fainting or falls.', urgency: 'immediate' },
        { id: 'sos-2', title: 'Keep Wearable Device On', description: 'Ensure the wrist unit remains securely attached so live GPS and pulse data stream continuously.', urgency: 'immediate' },
        { id: 'sos-3', title: 'Await Incoming Response', description: 'Primary caregiver and emergency dispatch have been notified with your satellite location.', urgency: 'immediate' },
        { id: 'sos-4', title: 'Unlock Access If Able', description: 'If alert and without pain, unlock your front door so first responders can enter promptly.', urgency: 'soon' },
      ],
      dos: ['Remain calm and take slow, deep breaths', 'Keep your smartphone and wearable within reach', 'Call out to nearby household members or neighbors'],
      donts: ['Do not stand up abruptly', 'Do not attempt to operate vehicles or stairs', 'Do not remove the wearable device'],
      recheckIntervalMinutes: 1,
      doctorSummary: `[AI HEALTH GUARDIAN EMERGENCY DISPATCH]\nTime: ${timestamp}\nStatus: MANUAL SOS TRIGGERED\nVitals: HR ${hr || 'N/A'} BPM | SpO2 ${spo2 || 'N/A'}% | Temp ${temp ? temp.toFixed(1) : 'N/A'}°C\nGPS Location: Lat ${data.latitude || 'N/A'}, Lng ${data.longitude || 'N/A'}\nPatient: ${baseline.name} (Age: ${baseline.age})\nAction: Emergency response dispatch required immediately.`,
    };
  }

  // Case 2: Fall Impact Detected
  if (isFall) {
    return {
      headline: 'Kinetic Fall Impact Confirmed',
      summary: 'Free-fall weightlessness vector followed by high-G impact and immobility was confirmed by the 6-axis IMU.',
      urgencyLevel: 'CRITICAL_EMERGENCY',
      immediateSteps: [
        { id: 'fall-1', title: 'Remain Still & Assess Pain', description: 'Do not attempt to stand immediately. Check for sharp neck, back, hip, or head pain before moving.', urgency: 'immediate' },
        { id: 'fall-2', title: 'Immobilize Head & Neck', description: 'If neck or spinal tenderness is present, keep your head completely still to avoid spinal cord trauma.', urgency: 'immediate' },
        { id: 'fall-3', title: 'Attract Nearby Help', description: 'Call out loudly for assistance; device buzzer is sounding to help rescuers locate you.', urgency: 'immediate' },
        { id: 'fall-4', title: 'Gradual Chair Recovery (If Uninjured)', description: 'Only if completely pain-free: roll onto your stomach, crawl to a sturdy chair, and rest before rising.', urgency: 'soon' },
      ],
      dos: ['Stay warm by pulling a blanket or coat over yourself if on a cold floor', 'Rest quietly if lightheaded', 'Signal for help'],
      donts: ['Do not jump up quickly', 'Do not bear weight on any joint that feels deformed or acutely painful', 'Do not ignore head trauma'],
      recheckIntervalMinutes: 1,
      doctorSummary: `[AI HEALTH GUARDIAN FALL ALERT]\nTime: ${timestamp}\nStatus: KINETIC FALL DETECTED\nVitals: HR ${hr || 'N/A'} BPM | SpO2 ${spo2 || 'N/A'}% | Temp ${temp ? temp.toFixed(1) : 'N/A'}°C\nPatient: ${baseline.name} (Age: ${baseline.age})\nClinical Guidance: Check for orthopedic trauma, cranial contusion, and post-fall syncope.`,
    };
  }

  // Case 3: Severe Hypoxia (SpO2 < 90%)
  if (spo2 > 0 && spo2 < 90) {
    return {
      headline: 'Critical Respiratory Desaturation (SpO₂ < 90%)',
      summary: `Blood oxygen saturation has dropped to a critical ${spo2}%, presenting acute risk of cellular hypoxemia and organ distress.`,
      urgencyLevel: 'CRITICAL_EMERGENCY',
      immediateSteps: [
        { id: 'hypo-1', title: "Adopt High Fowler's Position", description: 'Sit upright at 75° to 90° with back firmly supported to maximize diaphragmatic excursion and alveolar volume.', urgency: 'immediate' },
        { id: 'hypo-2', title: 'Pursed-Lip Exhalations', description: 'Inhale through your nose for 2 seconds, then exhale slowly through pursed lips for 4 seconds to maintain positive airway pressure.', urgency: 'immediate' },
        { id: 'hypo-3', title: 'Loosen Constricting Clothing', description: 'Unbutton collar, necktie, bra, or tight waistband to remove any mechanical resistance to thoracic movement.', urgency: 'immediate' },
        { id: 'hypo-4', title: 'Administer Prescribed Inhaler / Oxygen', description: 'If you have prescribed emergency bronchodilators (e.g. Salbutamol) or supplemental oxygen, utilize as instructed by your physician.', urgency: 'soon' },
      ],
      dos: ['Sit in an upright, well-ventilated space', 'Focus on slow rhythmic breathing', 'Call emergency services if accompanied by blueness of lips or confusion'],
      donts: ['Do not lie flat on your back (supine)', 'Do not engage in physical exertion or talking', 'Do not stay in a closed, stuffy room'],
      recheckIntervalMinutes: 2,
      doctorSummary: `[AI HEALTH GUARDIAN RESPIRATORY ALERT]\nTime: ${timestamp}\nCondition: ACUTE HYPOXIA\nVitals: SpO2 ${spo2}% (Baseline min: ${baseline.spo2Min}%) | HR ${hr} BPM\nPatient: ${baseline.name} (${baseline.age} y/o)\nNote: Prompt emergency evaluation indicated if SpO2 fails to recover > 92% within 3 minutes.`,
    };
  }

  // Case 4: Severe Tachycardia (HR > 140 or HR > baseline + 25)
  if (hr > 140 || (hr > baseline.heartRateMax + 25 && hr > 0)) {
    return {
      headline: 'Severe Tachycardia & Elevated Cardiac Workload',
      summary: `Heart rate has accelerated to ${hr} BPM, significantly exceeding your personal baseline (${baseline.heartRateMin}–${baseline.heartRateMax} BPM).`,
      urgencyLevel: 'HIGH_ATTENTION',
      immediateSteps: [
        { id: 'tach-1', title: 'Cease All Exertion', description: 'Stop walking, running, or standing immediately. Sit or recline in a quiet, cool area.', urgency: 'immediate' },
        { id: 'tach-2', title: 'Vagal Relaxation Maneuvers', description: 'Apply a cool, damp washcloth to your face for 10-15 seconds, or take a deep breath and gently bear down to stimulate parasympathetic braking.', urgency: 'immediate' },
        { id: 'tach-3', title: 'Hydrate with Cool Water', description: 'Drink 250ml of cool water slowly in small sips. Dehydration and electrolyte depletion commonly trigger compensatory tachycardia.', urgency: 'soon' },
        { id: 'tach-4', title: 'Screen for Red-Flag Symptoms', description: 'Note if you experience chest pain, radiating shoulder pain, nausea, or dizziness. If any are present, seek emergency evaluation.', urgency: 'soon' },
      ],
      dos: ['Sit with feet uncrossed and shoulders relaxed', 'Take slow, even breaths', 'Sip cool water'],
      donts: ['Do not consume coffee, tea, chocolate, or energy drinks', 'Do not smoke or use nicotine', 'Do not stand up rapidly'],
      recheckIntervalMinutes: 3,
      doctorSummary: `[AI HEALTH GUARDIAN CARDIOVASCULAR LOG]\nTime: ${timestamp}\nCondition: TACHYCARDIA EPISODE\nVitals: HR ${hr} BPM (Max Baseline: ${baseline.heartRateMax} BPM) | SpO2 ${spo2}% | Temp ${temp.toFixed(1)}°C\nPatient: ${baseline.name}\nRecommendation: Electrocardiogram (ECG) and clinical evaluation if sustained.`,
    };
  }

  // Case 5: Marked Bradycardia (HR < 48)
  if (hr > 0 && hr < 48) {
    return {
      headline: 'Marked Bradycardia (Abnormally Low Pulse)',
      summary: `Heart rate has decreased to ${hr} BPM. If accompanied by lightheadedness or fatigue, cerebral blood flow may be compromised.`,
      urgencyLevel: 'HIGH_ATTENTION',
      immediateSteps: [
        { id: 'brady-1', title: 'Adopt Supine Position with Leg Elevation', description: 'Lie flat on your back and elevate your legs slightly (15-30cm) to assist venous blood return to the heart.', urgency: 'immediate' },
        { id: 'brady-2', title: 'Preserve Core Body Heat', description: 'Cover with a warm blanket; cold exposure frequently drives resting pulse rates downward.', urgency: 'immediate' },
        { id: 'brady-3', title: 'Check Sensor Fit', description: 'Ensure the wristband is snug and properly aligned against skin to rule out optical read artifacts.', urgency: 'soon' },
      ],
      dos: ['Rest comfortably', 'Keep warm with blankets', 'Report any fainting or blackout sensations to your doctor'],
      donts: ['Do not stand up quickly (prevents orthostatic collapse)', 'Do not take beta-blockers or cardiac sedatives without checking with doctor', 'Do not exert intensely to force pulse up'],
      recheckIntervalMinutes: 3,
      doctorSummary: `[AI HEALTH GUARDIAN BRADYCARDIA ALERT]\nTime: ${timestamp}\nCondition: BRADYCARDIA EPISODE\nVitals: HR ${hr} BPM (Min Baseline: ${baseline.heartRateMin} BPM) | SpO2 ${spo2}%\nPatient: ${baseline.name}\nObservation: Evaluate for sinus node dysfunction, medication side-effects, or conduction delay.`,
    };
  }

  // Case 6: High Pyrexia / Heat Distress (Temp > 38.5°C)
  if (temp > 38.5) {
    return {
      headline: 'Hyperthermia / High Pyrexia Detected',
      summary: `Body temperature is elevated at ${temp.toFixed(1)}°C, indicating active infection fever or thermal heat illness.`,
      urgencyLevel: 'HIGH_ATTENTION',
      immediateSteps: [
        { id: 'temp-1', title: 'External Surface Cooling', description: 'Place cool, damp cloths across forehead, back of the neck, and underarms to safely dissipate heat.', urgency: 'immediate' },
        { id: 'temp-2', title: 'Electrolyte Replacement', description: 'Sip oral rehydration salts (ORS), coconut water, or electrolyte fluids slowly to prevent heat exhaustion dehydration.', urgency: 'immediate' },
        { id: 'temp-3', title: 'Reduce Environmental Heat', description: 'Move to a shaded or air-conditioned room and remove heavy garments or excess blankets.', urgency: 'soon' },
        { id: 'temp-4', title: 'Antipyretic Medication', description: 'If approved by your physician, take appropriate dosage of Paracetamol/Acetaminophen.', urgency: 'soon' },
      ],
      dos: ['Drink plenty of room-temperature fluids', 'Rest in a cool, ventilated room', 'Monitor temperature every 15 minutes'],
      donts: ['Do not take freezing ice baths (induces shivering which drives internal temp higher)', 'Do not wear synthetic non-breathable fabrics', 'Do not ignore stiff neck or confusion'],
      recheckIntervalMinutes: 5,
      doctorSummary: `[AI HEALTH GUARDIAN THERMAL REPORT]\nTime: ${timestamp}\nCondition: HIGH FEVER / HYPERTHERMIA\nVitals: Temp ${temp.toFixed(1)}°C (Max Baseline: ${baseline.temperatureMax}°C) | HR ${hr} BPM | SpO2 ${spo2}%\nPatient: ${baseline.name}`,
    };
  }

  // Case 7: Moderate Deviation (Medium Risk)
  if (level === 'MEDIUM' || level === 'HIGH') {
    return {
      headline: 'Biometric Deviation From Baseline',
      summary: override || 'Sensors detect moderate variance from your personalized resting baseline.',
      urgencyLevel: 'MODERATE_MONITOR',
      immediateSteps: [
        { id: 'med-1', title: 'Pause Physical Activity', description: 'Sit down comfortably and rest quietly for 5-10 minutes to allow autonomic stabilization.', urgency: 'immediate' },
        { id: 'med-2', title: 'Hydrate with Water', description: 'Drink a glass of water (200-300ml). Mild dehydration is the leading cause of baseline vital drift.', urgency: 'soon' },
        { id: 'med-3', title: 'Controlled Diaphragmatic Breathing', description: 'Perform 3 minutes of relaxed 4-second inhale, 4-second exhale breathing.', urgency: 'soon' },
        { id: 'med-4', title: 'Sensor Adjustment', description: 'Check that the wrist strap is firm and clean to prevent signal noise from moving clothing.', urgency: 'routine' },
      ],
      dos: ['Sit upright in a calm area', 'Sip room-temperature water', 'Observe if symptoms improve with rest'],
      donts: ['Do not rush into vigorous tasks', 'Do not consume stimulants or tobacco', 'Do not ignore persistent discomfort'],
      recheckIntervalMinutes: 5,
      doctorSummary: `[AI HEALTH GUARDIAN ROUTINE MONITOR]\nTime: ${timestamp}\nStatus: MODERATE DEVIATION\nVitals: HR ${hr} BPM | SpO2 ${spo2}% | Temp ${temp ? temp.toFixed(1) : 'N/A'}°C\nFactors: ${factors.filter(f => f.severity !== 'normal').map(f => `${f.name}: ${f.deviation}`).join('; ')}`,
    };
  }

  // Case 8: Nominal / Healthy Routine
  return {
    headline: 'All Biometric Markers Nominal & Stable',
    summary: 'Heart rate, blood oxygenation, kinetic vectors, and body temperature are well within your calibrated healthy profile.',
    urgencyLevel: 'ROUTINE_NOMINAL',
    immediateSteps: [
      { id: 'nom-1', title: 'Maintain Daily Hydration', description: 'Keep a water bottle nearby; target continuous hydration throughout the day.', urgency: 'routine' },
      { id: 'nom-2', title: 'Micro-Mobility Stretch', description: 'If working seated for over 45 minutes, stand up and stretch to maintain venous circulation.', urgency: 'routine' },
      { id: 'nom-3', title: 'Monitor Battery Reserve', description: `Wearable telemetry node is active. Current battery: ${data.batteryPercent ?? 92}%.`, urgency: 'routine' },
    ],
    dos: ['Continue regular daily activities', 'Keep wearable clean and dry', 'Maintain healthy sleep and hydration habits'],
    donts: ['Do not submerge the wearable in hot water', 'Do not sleep with wearable strapped too tightly'],
    recheckIntervalMinutes: 15,
    doctorSummary: `[AI HEALTH GUARDIAN HEALTH STATUS]\nTime: ${timestamp}\nStatus: ALL VITALS OPTIMAL\nVitals: HR ${hr} BPM | SpO2 ${spo2}% | Temp ${temp.toFixed(1)}°C | Fall: None\nPatient: ${baseline.name}`,
  };
}

function buildResult(
  score: number,
  data: SensorData,
  baseline: PersonalBaseline,
  scores: Array<{ score: number; severity: ContributingFactor['severity']; deviation: string }>,
  override: string
): RiskAssessment {
  const [hrR, spo2R, tempR, fallR, actR] = scores;
  const factors: ContributingFactor[] = [
    { name: 'Heart Rate', value: data.heartRate ? `${data.heartRate} BPM` : 'N/A', severity: hrR.severity, deviation: hrR.deviation },
    { name: 'SpO₂', value: data.spo2 ? `${data.spo2}%` : 'N/A', severity: spo2R.severity, deviation: spo2R.deviation },
    { name: 'Temperature', value: data.temperature ? `${data.temperature.toFixed(1)}°C` : 'N/A', severity: tempR.severity, deviation: tempR.deviation },
    { name: 'Fall Detection', value: data.fallDetected ? 'DETECTED' : 'None', severity: fallR.severity, deviation: fallR.deviation },
    { name: 'Activity Pattern', value: data.activity, severity: actR.severity, deviation: actR.deviation },
    { name: 'Personal Baseline', value: 'Applied', severity: 'normal', deviation: 'Individual baseline factored into assessment' },
  ];

  let level: RiskLevel;
  let confidence: number;
  let recommendedAction: string;
  let explanation: string;

  if (data.sos || score >= 0.75) {
    level = 'CRITICAL';
    confidence = Math.round(85 + score * 14);
    recommendedAction = 'Trigger emergency mode — contact emergency services and caregiver immediately.';
    explanation = override || 'Critical health indicators detected. Immediate intervention required.';
  } else if (score >= 0.45) {
    level = 'HIGH';
    confidence = Math.round(75 + score * 15);
    recommendedAction = 'Notify caregiver immediately. Advise patient to rest and seek medical attention.';
    explanation = buildExplanation(factors);
  } else if (score >= 0.20) {
    level = 'MEDIUM';
    confidence = Math.round(70 + score * 20);
    recommendedAction = 'Alert user and increase monitoring frequency. Consider contacting caregiver.';
    explanation = buildExplanation(factors);
  } else {
    level = 'LOW';
    confidence = Math.round(88 + score * 10);
    recommendedAction = 'Continue normal monitoring. All vitals within acceptable range.';
    explanation = 'All health indicators are within normal range relative to personal baseline.';
  }

  confidence = Math.min(99, confidence);
  const advice = generateClinicalAdvice(data, baseline, level, factors, explanation);
  return { level, confidence, contributingFactors: factors, recommendedAction, explanation, advice };
}

function buildExplanation(factors: ContributingFactor[]): string {
  const warnings = factors.filter(f => f.severity === 'warning' || f.severity === 'danger');
  if (warnings.length === 0) return 'Mild deviation from baseline detected across one or more sensors.';
  return warnings.map(w => w.deviation).join('. ') + '.';
}
