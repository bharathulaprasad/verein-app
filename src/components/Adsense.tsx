'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle?: { [key: string]: unknown }[];
  }
}

type AdsenseProps = {
  adSlot: string;
  adFormat?: string;
  adLayoutKey?: string;
  style?: React.CSSProperties;
  className?: string;
};

const Adsense: React.FC<AdsenseProps> = ({
  adSlot,
  adFormat = 'auto',
  adLayoutKey,
  style = { display: 'block' },
  className = '',
}) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('Adsense error:', err);
    }
  }, []);

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-ad-layout-key={adLayoutKey}
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default Adsense;