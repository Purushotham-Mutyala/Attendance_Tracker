import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const colleges = [
  'Amrita Vishwa Vidyapeetham',
  'Indian Institute of Technology Madras',
  'Indian Institute of Technology Delhi',
  'Indian Institute of Technology Bombay',
  'National Institute of Technology Tiruchirappalli',
  'Vellore Institute of Technology',
  'Birla Institute of Technology and Science',
  'Indian Institute of Science',
  'Anna University',
  'Jadavpur University'
];

const CollegeSelect: React.FC = () => {
  const { college, setCollege } = useTheme();

  return (
    <select
      value={college}
      onChange={(e) => setCollege(e.target.value)}
      className="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
    >
      {colleges.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  );
};

export default CollegeSelect;