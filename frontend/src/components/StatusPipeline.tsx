const STEPS = ["submitted", "processing", "approved", "issued"] as const;

const STEP_LABELS: Record<string, string> = {
  submitted: "Submitted",
  processing: "Processing",
  approved: "Approved",
  issued: "Issued",
};

interface StatusPipelineProps {
  status: string;
}

export default function StatusPipeline({ status }: StatusPipelineProps) {
  const currentIndex = STEPS.indexOf(status as any);

  return (
    <div className="flex items-center gap-1 w-full">
      {STEPS.map((step, i) => {
        const isComplete = i <= currentIndex;
        const isCurrent = i === currentIndex;
        const isLast = i === STEPS.length - 1;

        return (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              {/* Circle */}
              <div
                className={`
                  w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                  transition-all duration-500 ease-out
                  ${isComplete
                    ? isCurrent
                      ? "bg-green-500 text-white ring-4 ring-green-200 scale-110"
                      : "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-400"
                  }
                `}
              >
                {isComplete && !isCurrent ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              {/* Label */}
              <span
                className={`
                  text-[10px] mt-1 font-medium transition-colors duration-300
                  ${isComplete ? "text-green-700" : "text-gray-400"}
                `}
              >
                {STEP_LABELS[step]}
              </span>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div className="flex-1 h-0.5 mx-1 -mt-4 relative overflow-hidden rounded-full bg-gray-200">
                <div
                  className="absolute inset-y-0 left-0 bg-green-500 rounded-full transition-all duration-700 ease-out"
                  style={{ width: i < currentIndex ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
