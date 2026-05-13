'use client';

import { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import UploadScreen from './components/UploadScreen';
import ReviewScreen from './components/ReviewScreen';
import SOWScreen from './components/SOWScreen';

export default function Home() {
  const [step, setStep] = useState(0);
  const [projectName, setProjectName] = useState('Commercial Demo Project');
  const [lineItems, setLineItems] = useState([]);
  const [sow, setSow] = useState('');

  const handleAnalyze = async ({ projectName: name, base64Data, mediaType }) => {
    setProjectName(name);

    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64Data, mediaType }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || `API error ${res.status}`);
    }

    if (!Array.isArray(data.items) || data.items.length === 0) {
      throw new Error('No demolition items found in the blueprint. Try a different image.');
    }

    setLineItems(data.items);
    setStep(2);
  };

  const handleGenerateSow = async (selectedItems) => {
    const res = await fetch('/api/generate-sow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectName, items: selectedItems }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || `API error ${res.status}`);
    }

    setSow(data.sow);
    setStep(3);
  };

  if (step === 0) {
    return <SplashScreen onUnlock={() => setStep(1)} />;
  }

  if (step === 1) {
    return <UploadScreen onAnalyze={handleAnalyze} />;
  }

  if (step === 2) {
    return (
      <ReviewScreen
        projectName={projectName}
        items={lineItems}
        onBack={() => setStep(1)}
        onGenerate={handleGenerateSow}
      />
    );
  }

  return (
    <SOWScreen
      projectName={projectName}
      sow={sow}
      onEditItems={() => setStep(2)}
    />
  );
}
