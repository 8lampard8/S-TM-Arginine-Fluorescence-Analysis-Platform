import React, { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';
import type { Data, Layout, Config } from 'plotly.js-dist-min';

interface PlotlyChartProps {
  data: Data[];
  layout: Partial<Layout>;
  config?: Partial<Config>;
  className?: string;
  style?: React.CSSProperties;
  onHover?: (event: Plotly.PlotHoverEvent) => void;
  onClick?: (event: Plotly.PlotMouseEvent) => void;
}

export const PlotlyChart: React.FC<PlotlyChartProps> = ({
  data,
  layout,
  config,
  className,
  style,
  onHover,
  onClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const defaultConfig: Partial<Config> = {
      responsive: true,
      displayModeBar: true,
      modeBarButtonsToRemove: ['lasso2d', 'select2d'],
      displaylogo: false,
      toImageButtonOptions: {
        format: 'png',
        filename: 'fluorescence_plot',
        height: 600,
        width: 900,
        scale: 2,
      },
      ...config,
    };

    const mergedLayout: Partial<Layout> = {
      autosize: true,
      margin: { l: 55, r: 25, t: 40, b: 45 },
      paper_bgcolor: 'transparent',
      plot_bgcolor: '#ffffff',
      font: { family: 'system-ui, sans-serif', size: 12, color: '#334155' },
      ...layout,
    };

    Plotly.react(containerRef.current, data, mergedLayout, defaultConfig);

    const el = containerRef.current as any;
    if (onHover && el.on) {
      el.on('plotly_hover', onHover);
    }
    if (onClick && el.on) {
      el.on('plotly_click', onClick);
    }

    const handleResize = () => {
      if (containerRef.current) {
        Plotly.Plots.resize(containerRef.current);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        Plotly.purge(containerRef.current);
      }
    };
  }, [data, layout, config, onHover, onClick]);

  return <div ref={containerRef} className={className} style={{ width: '100%', minHeight: '350px', ...style }} />;
};
