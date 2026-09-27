'use client';

import React from 'react';
import { RetrievalResult } from '@/lib/retrieval-engine';
import { Cpu, CheckCircle2, Zap, Database, Sliders, Layers } from 'lucide-react';

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
      <div className="w-full bg-[#f0fdf4] border border-emerald-300 rounded-2xl p-4 shadow-sm animate-pulse flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center animate-spin">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-900">
              Executing Multi-Vector Retrieval Pipeline...
            </p>
            <p className="text-[11px] text-emerald-700">
              Evaluating 11,127 candidates in memory across vector & lexical indexes
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-mono bg-white px-2.5 py-1 rounded-lg border border-emerald-200 text-emerald-800 font-bold">
            Pipeline Active
          </span>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const { queryContext, matches } = result;

  return (
    <div className="w-full bg-white rounded-2xl border border-[#d8e6dc] p-4 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Left: Pipeline Status & Strategy */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 border border-emerald-200">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black text-[#0f291e] tracking-tight">
                Retrieval Pipeline Executed Successfully
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 font-mono">
                {queryContext.strategy}
              </span>
            </div>
            <p className="text-[11px] text-[#52705e] font-medium mt-0.5">
              Filtered & ranked from <span className="font-bold text-[#143224]">{queryContext.candidatesEvaluated.toLocaleString()} candidates</span> across lexical BM25 and vector spaces.
            </p>
          </div>
        </div>

        {/* Right: Telemetry Metrics */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#f0fdf4] border border-emerald-200 rounded-xl text-emerald-900 font-bold">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>{queryContext.pipelineLatencyMs} ms</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#f4fbf7] border border-[#d6e7dc] rounded-xl text-[#2a4d3a] font-semibold">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>{matches.length} Top Matches</span>
          </div>

          {queryContext.tokensParsed.length > 0 && (
            <div className="hidden lg:flex items-center gap-1 text-[11px] text-[#698875] bg-gray-50 px-2 py-1 rounded-xl border border-gray-200">
              <span className="font-medium">Tokens:</span>
              <span className="font-mono text-emerald-800 truncate max-w-[150px]">
                {queryContext.tokensParsed.slice(0, 4).join(', ')}
              </span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
