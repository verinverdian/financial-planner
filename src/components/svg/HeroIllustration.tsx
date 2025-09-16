export default function HeroIllustration(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 600"
        fill="none"
      >
        <circle cx="400" cy="300" r="250" fill="#d1fae5" />
        <rect x="280" y="180" width="240" height="180" rx="20" fill="#10b981" />
        <rect x="310" y="210" width="180" height="20" rx="5" fill="white" />
        <rect x="310" y="250" width="140" height="20" rx="5" fill="white" />
        <rect x="310" y="290" width="160" height="20" rx="5" fill="white" />
        <circle cx="380" cy="400" r="40" fill="#34d399" />
        <path d="M370 400 l10 10 l20 -20" stroke="white" strokeWidth="5" />
      </svg>
    );
  }
  