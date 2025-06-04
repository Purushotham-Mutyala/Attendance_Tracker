import React, { useEffect, useRef } from 'react';

interface ChartData {
  present: number;
  absent: number;
  total: number;
}

interface AttendancePieChartProps {
  data: ChartData;
  size?: number;
  animate?: boolean;
}

const AttendancePieChart: React.FC<AttendancePieChartProps> = ({
  data,
  size = 200,
  animate = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const percentage = Math.round((data.present / data.total) * 100) || 0;
  
  // Determine color based on percentage
  const getColor = () => {
    if (percentage >= 75) return '#22c55e'; // Green
    if (percentage >= 60) return '#eab308'; // Yellow
    return '#ef4444'; // Red
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);
    
    // Set up dimensions
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (size / 2) * 0.8;
    
    // Draw background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#e5e7eb'; // Light gray
    ctx.fill();
    
    // Draw attendance arc
    const presentPercentage = data.present / data.total;
    const startAngle = -Math.PI / 2; // Start from top
    const endAngle = startAngle + (2 * Math.PI * presentPercentage);
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.fillStyle = getColor();
    ctx.fill();
    
    // Draw inner circle for donut effect
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    
    // Draw text in center
    ctx.fillStyle = '#111827';
    ctx.font = `bold ${size * 0.15}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${percentage}%`, centerX, centerY);
    
    // Draw smaller label text
    ctx.fillStyle = '#4b5563';
    ctx.font = `${size * 0.08}px sans-serif`;
    ctx.fillText('Attendance', centerX, centerY + (size * 0.1));
  }, [data, size, percentage]);

  return (
    <div className="flex flex-col items-center">
      <canvas 
        ref={canvasRef} 
        width={size} 
        height={size}
        className={animate ? 'transition-opacity duration-500 ease-in-out' : ''}
      />
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
          Present: {data.present} classes
        </p>
        <p className="text-sm text-gray-600">
          <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1"></span>
          Absent: {data.absent} classes
        </p>
        <p className="text-sm text-gray-600">
          Total: {data.total} classes
        </p>
      </div>
    </div>
  );
};

export default AttendancePieChart;