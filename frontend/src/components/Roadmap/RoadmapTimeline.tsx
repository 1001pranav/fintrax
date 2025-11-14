'use client';

import { useEffect, useState, useMemo } from 'react';
import Timeline, {
  TimelineHeaders,
  SidebarHeader,
  DateHeader,
  TimelineGroup,
  TimelineItem,
} from 'react-calendar-timeline';
import moment from 'moment';
import { Todo } from '@/lib/api';
import { useTodoStore } from '@/lib/todoStore';

// Import timeline styles (we'll need to add this to globals.css)
import 'react-calendar-timeline/lib/Timeline.css';

interface RoadmapTimelineProps {
  roadmapId: number;
  startDate: string;
  endDate: string;
}

export default function RoadmapTimeline({ roadmapId, startDate, endDate }: RoadmapTimelineProps) {
  const { tasks, updateTask } = useTodoStore();
  const [zoomLevel, setZoomLevel] = useState<'day' | 'week' | 'month'>('week');
  const [isDragging, setIsDragging] = useState(false);

  const roadmapTasks = tasks.filter((task) => task.roadmap_id === roadmapId);

  // Convert tasks to timeline items
  const items: TimelineItem[] = useMemo(() => {
    return roadmapTasks.map((task) => ({
      id: task.task_id,
      group: getStatusGroup(task.status),
      title: task.title,
      start_time: moment(task.start_date).valueOf(),
      end_time: moment(task.end_date).valueOf(),
      itemProps: {
        className: `timeline-item priority-${task.priority}`,
        style: {
          background: getPriorityColor(task.priority),
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
        },
      },
    }));
  }, [roadmapTasks]);

  // Define groups (by status)
  const groups: TimelineGroup[] = [
    { id: 1, title: 'To Do' },
    { id: 2, title: 'In Progress' },
    { id: 3, title: 'Done' },
  ];

  const getStatusGroup = (status: number): number => {
    if (status === 1) return 1; // To Do
    if (status === 2) return 2; // In Progress
    return 3; // Done (3, 4, 5, 6)
  };

  const getPriorityColor = (priority: number): string => {
    if (priority >= 4) return '#ef4444'; // High - red
    if (priority >= 2) return '#f59e0b'; // Medium - yellow
    return '#3b82f6'; // Low - blue
  };

  // Calculate visible time range based on zoom level
  const getTimeRange = () => {
    const start = moment(startDate);
    const end = moment(endDate);

    switch (zoomLevel) {
      case 'day':
        return {
          defaultTimeStart: start.toDate(),
          defaultTimeEnd: start.clone().add(7, 'days').toDate(),
        };
      case 'week':
        return {
          defaultTimeStart: start.toDate(),
          defaultTimeEnd: start.clone().add(4, 'weeks').toDate(),
        };
      case 'month':
        return {
          defaultTimeStart: start.toDate(),
          defaultTimeEnd: end.toDate(),
        };
    }
  };

  const handleItemMove = async (itemId: number, dragTime: number, newGroupOrder: number) => {
    const task = roadmapTasks.find((t) => t.task_id === itemId);
    if (!task) return;

    const duration = moment(task.end_date).diff(moment(task.start_date), 'milliseconds');
    const newStartDate = moment(dragTime).toISOString();
    const newEndDate = moment(dragTime).add(duration, 'milliseconds').toISOString();

    // Determine new status based on group
    let newStatus = task.status;
    if (newGroupOrder === 1) newStatus = 1; // To Do
    else if (newGroupOrder === 2) newStatus = 2; // In Progress
    else if (newGroupOrder === 3) newStatus = 3; // Done

    try {
      await updateTask(itemId, {
        start_date: newStartDate,
        end_date: newEndDate,
        status: newStatus,
      });
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleItemResize = async (
    itemId: number,
    time: number,
    edge: 'left' | 'right'
  ) => {
    const task = roadmapTasks.find((t) => t.task_id === itemId);
    if (!task) return;

    const updateData: any = {};

    if (edge === 'left') {
      updateData.start_date = moment(time).toISOString();
    } else {
      updateData.end_date = moment(time).toISOString();
    }

    try {
      await updateTask(itemId, updateData);
    } catch (error) {
      console.error('Failed to resize task:', error);
    }
  };

  const timeRange = getTimeRange();

  return (
    <div className="roadmap-timeline">
      {/* Zoom Controls */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Task Timeline</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setZoomLevel('day')}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              zoomLevel === 'day'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Day
          </button>
          <button
            onClick={() => setZoomLevel('week')}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              zoomLevel === 'week'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setZoomLevel('month')}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              zoomLevel === 'month'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Month
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ background: '#ef4444' }}></div>
          <span className="text-gray-700">High Priority</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ background: '#f59e0b' }}></div>
          <span className="text-gray-700">Medium Priority</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ background: '#3b82f6' }}></div>
          <span className="text-gray-700">Low Priority</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
        {items.length > 0 ? (
          <Timeline
            groups={groups}
            items={items}
            defaultTimeStart={timeRange.defaultTimeStart}
            defaultTimeEnd={timeRange.defaultTimeEnd}
            canMove={true}
            canResize="both"
            canChangeGroup={true}
            onItemMove={handleItemMove}
            onItemResize={handleItemResize}
            lineHeight={50}
            itemHeightRatio={0.75}
            minZoom={24 * 60 * 60 * 1000} // 1 day
            maxZoom={365 * 24 * 60 * 60 * 1000} // 1 year
          >
            <TimelineHeaders>
              <SidebarHeader>
                {({ getRootProps }) => (
                  <div {...getRootProps()} className="bg-gray-50 font-semibold text-gray-700">
                    Status
                  </div>
                )}
              </SidebarHeader>
              <DateHeader unit="primaryHeader" />
              <DateHeader />
            </TimelineHeaders>
          </Timeline>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No tasks found for this roadmap</p>
            <p className="text-sm mt-1">Add tasks with start and end dates to see them here</p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-900">
          <strong>Tip:</strong> Drag tasks to reschedule them, resize by dragging edges, and move between status groups.
        </p>
      </div>
    </div>
  );
}
