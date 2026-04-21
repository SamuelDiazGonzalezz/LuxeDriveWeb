export interface FeatureBlock {
  icon: string;
  title: string;
  description: string;
}

export interface SiteContent {
  hero: {
    title: string;
    highlight: string;
    subtitle: string;
    image: string;
    cta: string;
  };
  about: {
    title: string;
    text: string;
    image: string;
    features: FeatureBlock[];
  };
  contact: {
    title: string;
    subtitle: string;
    emails: string[];
    phones: string[];
    address: string[];
  };
}
