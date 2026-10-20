import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Camera, 
  CameraOff, 
  Sparkles, 
  ShoppingBag, 
  Check, 
  Sliders, 
  RefreshCw,
  Eye,
  Smile
} from 'lucide-react';

const SHADES = [
  { id: 'dulce', name: 'Dulce de Leche', code: '46594', hex: '#C38B76', type: 'lip', priceGHS: 120 },
  { id: 'mango', name: 'Mango Glow', code: '46589', hex: '#E89058', type: 'lip', priceGHS: 120 },
  { id: 'raspberry', name: 'Raspberry Cream', code: '46590', hex: '#C4576C', type: 'lip', priceGHS: 120 },
  { id: 'berry', name: 'Midnight Berry', code: '46591', hex: '#8E2848', type: 'lip', priceGHS: 120 },
  { id: 'plum', name: 'Velvet Plum', code: '46592', hex: '#681B34', type: 'lip', priceGHS: 120 },
  { id: 'onyx-mascara', name: 'THE ONE Onyx Black Mascara', code: '47170', hex: '#11100F', type: 'lash', priceGHS: 186 }
];

export default function VirtualTryOnModal({
  isOpen,
  onClose,
  onAddToCart,
  formatPrice
}) {
  const [activeShade, setActiveShade] = useState(SHADES[0]);
  const [intensity, setIntensity] = useState(70);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [added, setAdded] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.warn('Camera access unavailable or declined, using Studio Model mode:', err);
      setCameraError('Camera access not detected. Showing Studio Model Live Preview.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  if (!isOpen) return null;

  const handleAcquire = () => {
    const productItem = {
      id: `try-on-${activeShade.id}`,
      code: activeShade.code,
      name: `OnColour / THE ONE — ${activeShade.name}`,
      subtitle: `${activeShade.type === 'lip' ? 'Luscious Lip Gloss' : 'High-Definition Mascara'} (Virtual Studio Match)`,
      category: 'Makeup',
      subCategory: activeShade.type === 'lip' ? 'Lips' : 'Eyes',
      priceGHS: activeShade.priceGHS,
      volume: '8 ml',
      page: 6,
      image: '/catalog/page_6.jpg',
      badge: 'AR Tested',
      selectedVariant: activeShade.name
    };
    onAddToCart(productItem, 1);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-[#0A0A0C] text-[#1A1615] dark:text-white rounded-3xl border border-[#EADBCE] dark:border-white/10 shadow-2xl overflow-hidden max-h-[95vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 dark:bg-zinc-800 text-[#1A1615] dark:text-white hover:bg-[#1A1615] hover:text-[#DEB573] flex items-center justify-center shadow-md transition-colors cursor-pointer"
          aria-label="Close studio"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Viewport: Live AR Mirror or Studio Portrait */}
        <div className="md:w-3/5 relative bg-[#111113] flex items-center justify-center overflow-hidden min-h-[380px] sm:min-h-[460px]">
          {isCameraActive ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform -scale-x-100"
            />
          ) : (
            /* Studio Beauty Model Portrait Simulation */
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src="/catalog/page_11.jpg"
                alt="Studio Beauty Model Face of Nigeria"
                className="w-full h-full object-cover object-top filter brightness-95"
              />
              {cameraError && (
                <div className="absolute top-4 left-4 right-4 bg-black/75 backdrop-blur-md text-white text-[11px] p-2.5 rounded-full text-center border border-white/10">
                  {cameraError}
                </div>
              )}
            </div>
          )}

          {/* AR Augmented Lip & Eye Tint Overlay */}
          <div 
            className="absolute inset-0 pointer-events-none transition-all duration-300"
            style={{
              boxShadow: `inset 0 0 100px ${activeShade.hex}${Math.round((intensity / 100) * 80).toString(16).padStart(2, '0')}`
            }}
          />

          {/* AR Reticle Indicator */}
          <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-xs font-mono flex items-center gap-2 border border-white/10">
            <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: activeShade.hex }} />
            <span>AR ACTIVE: {activeShade.name}</span>
          </div>

          {/* Camera Toggle Button */}
          <button
            onClick={() => {
              if (isCameraActive) stopCamera();
              else startCamera();
            }}
            className="absolute bottom-4 right-4 bg-white/90 dark:bg-zinc-800 text-[#1A1615] dark:text-white p-2.5 rounded-full shadow-lg hover:scale-105 transition-all cursor-pointer border border-white/20"
            title={isCameraActive ? 'Switch to Studio Model' : 'Activate Webcam'}
          >
            {isCameraActive ? <Camera className="w-4 h-4 text-[#DEB573]" /> : <CameraOff className="w-4 h-4" />}
          </button>
        </div>

        {/* Right Controls: Shade Palette & Acquisition */}
        <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between space-y-6 overflow-y-auto bg-white dark:bg-[#0A0A0C]">
          <div className="space-y-5">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C48B3B] dark:text-[#DEB573] block mb-1">
                Virtual Studio Atelier • Oriflame AR
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#1A1615] dark:text-white">
                Live Shade Try-On
              </h2>
              <p className="text-xs text-[#6E5D53] dark:text-zinc-400 mt-1 leading-relaxed">
                Test genuine Oriflame shades in real-time. Switch between vibrant lip glosses and high-definition lash volume.
              </p>
            </div>

            {/* Active Shade Highlight */}
            <div className="p-3.5 bg-[#FAF6F0] dark:bg-zinc-900 rounded-2xl border border-[#EADBCE] dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span 
                  className="w-7 h-7 rounded-full shadow-md border-2 border-white ring-2 ring-[#DEB573]"
                  style={{ backgroundColor: activeShade.hex }}
                />
                <div>
                  <h4 className="text-xs font-bold text-[#1A1615] dark:text-white">
                    {activeShade.name}
                  </h4>
                  <span className="text-[10px] font-mono text-[#8C7B72] dark:text-zinc-400">
                    Item Code: #{activeShade.code}
                  </span>
                </div>
              </div>
              <span className="text-sm font-bold text-[#1A1615] dark:text-white">
                {formatPrice(activeShade.priceGHS)}
              </span>
            </div>

            {/* Shade Swatch Grid */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C7B72] dark:text-zinc-400 block">
                Select Shade:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {SHADES.map((shade) => {
                  const isSelected = activeShade.id === shade.id;
                  return (
                    <button
                      key={shade.id}
                      onClick={() => setActiveShade(shade)}
                      className={`p-2 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                        isSelected 
                          ? 'border-[#DEB573] bg-[#FAF6F0] dark:bg-zinc-800 ring-2 ring-[#DEB573]/30 shadow-xs' 
                          : 'border-[#EADBCE] dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-[#DEB573]'
                      }`}
                    >
                      <span 
                        className="w-5 h-5 rounded-full border border-black/20"
                        style={{ backgroundColor: shade.hex }}
                      />
                      <span className="text-[10px] font-medium text-[#1A1615] dark:text-zinc-200 truncate max-w-full">
                        {shade.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Intensity Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#6E5D53] dark:text-zinc-300">Color Saturation:</span>
                <span className="font-mono text-[#C48B3B] dark:text-[#DEB573] font-bold">{intensity}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full accent-[#DEB573] cursor-pointer"
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-[#F5EFEB] dark:border-zinc-800 space-y-2">
            <button
              onClick={handleAcquire}
              disabled={added}
              className="w-full py-3.5 rounded-full bg-[#1A1615] dark:bg-[#DEB573] text-white dark:text-[#1A1615] hover:bg-[#26201E] dark:hover:bg-[#F5DFC2] text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {added ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-800" />
                  <span>Added Look to Bag!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-[#DEB573] dark:text-[#1A1615]" />
                  <span>Acquire {activeShade.name} ({formatPrice(activeShade.priceGHS)})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
