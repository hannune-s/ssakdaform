const fs = require('fs');
const file = 'src/app/components/DashboardWidget.tsx';
let c = fs.readFileSync(file, 'utf8');

// Replace the old render block with the new larger block
const oldStr = `          {recentActivities.map((activity, i) => (
            <div key={i} onClick={() => setActiveTab(activity.tab)} className="flex items-center gap-3 py-3.5 px-2 bg-white hover:bg-gray-50/40 transition-colors cursor-pointer active:scale-[0.99] group">
              <div className={\`w-1.5 h-1.5 rounded-full shrink-0 \${activity.isNew ? 'bg-indigo-500' : 'bg-gray-300'}\`} />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5 gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className={\`px-1.5 py-0.5 rounded text-[10.5px] font-bold shrink-0 \${
                      activity.tab === 'delivery' ? 'bg-blue-50 text-blue-600' :
                      activity.tab === 'order' ? 'bg-purple-50 text-purple-600' :
                      activity.tab === 'reservation' ? 'bg-green-50 text-green-600' :
                      'bg-orange-50 text-orange-600'
                    }\`}>
                      {activity.type}
                    </span>
                    <p className={\`text-[12.5px] sm:text-[13px] font-bold truncate \${activity.isNew ? 'text-gray-900' : 'text-gray-600'}\`}>{activity.name}</p>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-medium text-gray-400 whitespace-nowrap shrink-0">{activity.time}</span>
                </div>
                <p className="text-[11.5px] sm:text-[12px] text-gray-500 truncate">{activity.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity ml-1 shrink-0" />
            </div>
          ))}`;

const newStr = `          {recentActivities.map((activity, i) => (
            <div key={i} onClick={() => setActiveTab(activity.tab)} className="flex items-center gap-3 py-4 px-3 sm:px-4 bg-white hover:bg-gray-50/40 transition-colors cursor-pointer active:scale-[0.99] group rounded-xl">
              <div className={\`w-2 h-2 rounded-full shrink-0 \${activity.isNew ? 'bg-indigo-500' : 'bg-gray-300'}\`} />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1.5 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={\`px-2 py-0.5 rounded-md text-[11.5px] sm:text-[12px] font-bold shrink-0 \${
                      activity.tab === 'delivery' ? 'bg-blue-50 text-blue-600' :
                      activity.tab === 'order' ? 'bg-purple-50 text-purple-600' :
                      activity.tab === 'reservation' ? 'bg-green-50 text-green-600' :
                      'bg-orange-50 text-orange-600'
                    }\`}>
                      {activity.type}
                    </span>
                    <p className={\`text-[14px] sm:text-[15px] font-extrabold truncate \${activity.isNew ? 'text-gray-900' : 'text-gray-600'}\`}>{activity.name}</p>
                  </div>
                  <span className="text-[11px] sm:text-[12px] font-medium text-gray-400 whitespace-nowrap shrink-0">{activity.time}</span>
                </div>
                <p className="text-[13px] sm:text-[14px] text-gray-500 truncate">{activity.desc}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity ml-1 shrink-0" />
            </div>
          ))}`;

if (c.includes(oldStr)) {
  c = c.replace(oldStr, newStr);
  fs.writeFileSync(file, c);
  console.log('Successfully increased notification sizes');
} else {
  console.log('Target string not found');
}
