export type AdsConfig = {
  enabled: boolean;
  preview: boolean;
  client: string;
  bannerSlot: string;
  interstitialSlot: string;
};

export function readAdsConfig(
  env: Record<string, string | undefined>,
  search = "",
): AdsConfig {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  return {
    enabled: env.VITE_ADS_ENABLED === "true",
    preview: params.get("ads") === "preview",
    client: env.VITE_ADSENSE_CLIENT ?? "",
    bannerSlot: env.VITE_ADSENSE_BANNER_SLOT ?? "",
    interstitialSlot: env.VITE_ADSENSE_INTERSTITIAL_SLOT ?? "",
  };
}

export function adsActive(config: AdsConfig): boolean {
  return config.enabled || config.preview;
}

export function shouldLoadAdsense(config: AdsConfig): boolean {
  return config.enabled && !config.preview && config.client.length > 0;
}
