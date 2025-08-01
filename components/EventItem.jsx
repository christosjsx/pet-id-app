import { View, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const ICON_SIZE = 13;
const ICON_CONTAINER_SIZE = 24;
const MAX_NOTE_LENGTH = 30;

const iconMap = {
  'vet visit': { name: 'heartbeat', color: '#ff4d4d' },
  grooming: { name: 'cut', color: '#4da6ff' },
  medication: { name: 'pills', color: '#33cc33' },
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const formatDateTime = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return '';

  const date = new Date(`${dateStr}T${timeStr}`);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
  const month = months[date.getMonth()];
  const day = date.getDate();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'p.m.' : 'a.m.';
  hours = hours % 12;
  hours = hours ? hours : 12;

  return `${month} ${day} ${hours}:${minutes} ${ampm}`;
};

const EventItem = ({ event }) => {
  const eventType = event.event_type?.toLowerCase() || '';
  const { name: iconName, color: iconColor } = iconMap[eventType] || {
    name: 'calendar-alt',
    color: '#999999',
  };

  const rawNotes = event.notes ? event.notes.trim().replace(/\.$/, '') : '';

  const fullNoteText = rawNotes
    ? `${rawNotes} for ${event.pet_name}.`
    : `No event note provided for ${event.pet_name}`;
  const fallbackText = `${capitalize(eventType)} for ${event.pet_name}.`;

  const displayText =
    fullNoteText.length <= MAX_NOTE_LENGTH ? fullNoteText : fallbackText;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
      <View
        style={{
          width: ICON_CONTAINER_SIZE,
          height: ICON_CONTAINER_SIZE,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: ICON_CONTAINER_SIZE / 2,
          backgroundColor: iconColor,
          marginRight: 12,
        }}
      >
        <FontAwesome5 name={iconName} size={ICON_SIZE} color="white" />
      </View>

      <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'nowrap' }}>
        <Text
          style={{ color: 'white', fontWeight: '600', flexShrink: 1 }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {displayText.includes(event.pet_name) ? (
            <>
              {displayText.split(event.pet_name)[0]}
              <Text style={{ fontWeight: 'bold', color: '#00C5CB' }}>
                {event.pet_name}
              </Text>
              {displayText.split(event.pet_name)[1]}
            </>
          ) : (
            displayText
          )}
        </Text>
      </View>

      <View style={{ marginLeft: 'auto' }}>
        <Text style={{ color: '#94A3B8', fontSize: 13 }}>
          {formatDateTime(event.date, event.time)}
        </Text>
      </View>
    </View>
  );
};

export default EventItem;
