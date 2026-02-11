'use client';

import { ActivityCard, Activity } from './ActivityCard';

interface ActivitiesListProps {
  activities: Activity[];
}

export function ActivitiesList({ activities }: ActivitiesListProps) {
  const handleEdit = (id: string) => {
    console.log('Edit', id);
    // TODO: Implement navigation or modal logic
  };

  const handleDelete = (id: string) => {
    console.log('Delete', id);
    // TODO: Implement delete logic (maybe modal confirmation then Server Action)
  };

  const handleSend = (id: string) => {
    console.log('Send', id);
    // TODO: Implement send logic
  };

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <ActivityCard
          key={activity.id}
          activity={activity}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSend={handleSend}
        />
      ))}
    </div>
  );
}
