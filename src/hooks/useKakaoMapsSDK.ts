import { useEffect, useState } from 'react';

const KAKAO_SDK_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&autoload=false`;

export function useKakaoMapsSDK() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof kakao !== 'undefined' && kakao.maps) {
      setIsLoaded(true);
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src*="dapi.kakao.com"]'
    );

    if (existingScript) {
      existingScript.addEventListener('load', () => {
        kakao.maps.load(() => setIsLoaded(true));
      });
      return;
    }

    if (!import.meta.env.VITE_KAKAO_MAP_API_KEY) {
      setError('.env 파일에 VITE_KAKAO_MAP_API_KEY를 설정해주세요.');
      return;
    }

    const script = document.createElement('script');
    script.src = KAKAO_SDK_URL;
    script.async = true;

    script.onload = () => {
      kakao.maps.load(() => setIsLoaded(true));
    };

    script.onerror = () => {
      setError('카카오맵 SDK 로드에 실패했습니다. API 키를 확인해주세요.');
    };

    document.head.appendChild(script);
  }, []);

  return { isLoaded, error };
}
