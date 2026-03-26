import React from 'react';

const stats = [
  { id: 1, name: 'e-Waste Collected', value: '50k+', unit: 'kg', color: 'text-green-600' },
  { id: 2, name: 'Active Users', value: '12k+', unit: '', color: 'text-blue-600' },
  { id: 3, name: 'Partner Recyclers', value: '25+', unit: '', color: 'text-emerald-600' },
  { id: 4, name: 'Carbon Offset', value: '150', unit: 'tons', color: 'text-teal-600' },
];

const Stats = () => {
  return (
    <section className="bg-white py-12 lg:py-24 border-b border-gray-100 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-green-50 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50"></div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 relative z-10">
        <div className="bg-white/50 backdrop-blur-xl border border-gray-100 rounded-[2.5rem] p-8 sm:p-12 lg:p-16 shadow-lg shadow-gray-200/50">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-center divide-x-0 divide-y-0 lg:divide-x lg:divide-gray-100">
            {stats.map((stat) => (
              <div key={stat.id} className="flex flex-col items-center justify-center p-2">
                <dd className={`text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter mb-2 ${stat.color}`}>
                  {stat.value}
                </dd>
                <dt className="text-xs sm:text-sm lg:text-base font-medium text-gray-500 uppercase tracking-widest">
                  {stat.name}
                  {stat.unit && <span className="normal-case ml-1 text-gray-400">({stat.unit})</span>}
                </dt>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
