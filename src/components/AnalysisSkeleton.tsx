import { Sparkles } from "lucide-react";

const AnalysisSkeleton = () => {
  return (
    <div className="bg-card border border-border rounded p-6 hard-shadow">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          <div className="absolute inset-0 bg-primary/20 blur-lg animate-ping" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-muted-foreground">Analyzing artwork</span>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Main Result Skeleton */}
        <div className="text-center py-6 border border-border rounded bg-background">
          <div className="skeleton h-4 w-24 mx-auto mb-3" />
          <div className="skeleton h-10 w-48 mx-auto mb-4" />
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="text-center">
              <div className="skeleton h-12 w-20 mx-auto mb-2" />
              <div className="skeleton h-3 w-16 mx-auto" />
            </div>
          </div>
        </div>

        {/* Description Skeleton */}
        <div className="bg-muted/30 rounded p-4 border border-border">
          <div className="skeleton h-3 w-20 mb-3" />
          <div className="space-y-2">
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-5/6" />
            <div className="skeleton h-4 w-4/6" />
          </div>
        </div>

        {/* Progress Skeleton */}
        <div>
          <div className="flex justify-between mb-2">
            <div className="skeleton h-4 w-28" />
            <div className="skeleton h-4 w-12" />
          </div>
          <div className="h-3 bg-muted rounded overflow-hidden">
            <div className="h-full bg-foreground/20 animate-pulse w-0" 
              style={{ 
                animation: 'progressGrow 2s ease-out infinite',
              }} 
            />
          </div>
        </div>

        {/* Analyzing Steps */}
        <div className="space-y-3 pt-4 border-t border-border">
          <p className="text-xs font-mono text-muted-foreground">ANALYSIS STEPS</p>
          {[
            { label: 'Extracting visual features', delay: 0 },
            { label: 'Analyzing color palette', delay: 200 },
            { label: 'Detecting patterns & motifs', delay: 400 },
            { label: 'Matching art style characteristics', delay: 600 },
          ].map((step, index) => (
            <div 
              key={step.label}
              className="flex items-center gap-3 animate-fade-in"
              style={{ animationDelay: `${step.delay}ms` }}
            >
              <div className="relative w-4 h-4">
                <div className="absolute inset-0 rounded-full border-2 border-foreground/30" />
                <div 
                  className="absolute inset-0 rounded-full border-2 border-t-foreground border-r-transparent border-b-transparent border-l-transparent animate-spin"
                  style={{ animationDuration: '1s' }}
                />
              </div>
              <span className="text-sm text-muted-foreground">{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes progressGrow {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 95%; }
        }
      `}</style>
    </div>
  );
};

export default AnalysisSkeleton;
