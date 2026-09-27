'use client';

import React from 'react';
import { RetrievalResult } from '@/lib/retrieval-engine';
import { Cpu, CheckCircle2, Zap, Database } from 'lucide-react';

interface RetrievalPipelineBannerProps {
  result: RetrievalResult | null;
  isLoading: boolean;
}

export const RetrievalPipelineBanner: React.FC<RetrievalPipelineBannerProps> = ({
  result,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="w-full bg-indigo-50/60 border border-indigo-200 rounded-xl p-3.5 shadow-2xs animate-pulse flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center animate-spin">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-indigo-950">
              Executing Multi-Vector Pipeline...
            </p>
            <p className="text-[11px] text-indigo-700">
              Evaluating 11,127 candidates in memory across vector & lexical indexes
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const { queryContext, matches } = result;

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Left: Pipeline Status & Strategy */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0 border border-indigo-200">
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black text-slate-900 tracking-tight">
                Pipeline Executed Successfully
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
                {queryContext.strategy}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Ranked from <span className="font-bold text-slate-800">{queryContext.candidatesEvaluated.toLocaleString()} candidates</span> across lexical BM25 and vector spaces.
            </p>
          </div>
        </div>

        {/* Right: Telemetry Metrics */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-900 font-bold">
            <Zap className="w-3.5 h-3.5 text-indigo-600" />
            <span>{queryContext.pipelineLatencyMs} ms</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold">
            <Database className="w-3.5 h-3.5 text-slate-600" />
            <span>{matches.length} Top Matches</span>
          </div>

          {queryContext.tokensParsed.length > 0 && (
            <div className="hidden lg:flex items-center gap-1 text-[11px] text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
              <span className="font-medium">Tokens:</span>
              <span className="font-mono text-indigo-700 truncate max-w-[150px]">
                {queryContext.tokensParsed.slice(0, 4).join(', ')}
              </span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
