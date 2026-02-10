import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";

interface EmbeddedWebsiteProps {
  url: string;
  title: string;
}

export default function EmbeddedWebsite({ url, title }: EmbeddedWebsiteProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    document.title = `${title} - Webodise`;
  }, [title]);

  return (
    <div className="w-full min-h-screen bg-background">
      {hasError ? (
        // Fallback - If iframe is blocked
        <div className="w-full h-screen flex items-center justify-center">
          <div className="text-center space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
              <p className="text-muted-foreground">
                This website cannot be embedded directly. Please open it in a new window.
              </p>
            </div>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
            >
              <ExternalLink className="w-4 h-4" />
              Open Website
            </a>
          </div>
        </div>
      ) : (
        <div className="w-full h-screen overflow-hidden">
          <iframe
            src={url}
            title={title}
            className="w-full h-full border-0"
            allowFullScreen
            style={{
              position: "relative",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "block",
            }}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
          />
        </div>
      )}
    </div>
  );
}
