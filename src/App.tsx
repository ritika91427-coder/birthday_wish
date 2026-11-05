import { useState } from 'react';
import { EnvelopeIntro } from './components/EnvelopeIntro';
import { CelebrationView } from './components/CelebrationView';
import { soundSynth } from './utils/soundSynthesizer';

export default function App() {
  const [hasOpenedEnvelope, setHasOpenedEnvelope] = useState<boolean>(false);

  const handleOpenEnvelope = () => {
    setHasOpenedEnvelope(true);
  };

  const handleReplay = () => {
    soundSynth.playSparkle();
    soundSynth.stopBackgroundMusic();
    setHasOpenedEnvelope(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#110A20] text-white font-sans antialiased selection:bg-[#E2D4F0] selection:text-[#3C2A54]">
      {!hasOpenedEnvelope ? (
        <EnvelopeIntro
          isOpen={hasOpenedEnvelope}
          onOpen={handleOpenEnvelope}
        />
      ) : (
        <CelebrationView onReplay={handleReplay} />
      )}
    </div>
  );
}
