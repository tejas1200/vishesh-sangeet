import { supabase } from '../lib/supabase';

function createPresenceKey() {
  return (
    'user-' +
    Date.now().toString(36) +
    '-' +
    Math.random()
      .toString(36)
      .substring(2, 10)
  );
}

export async function trackOnlineUsers(
  onCountChange: (count: number) => void
) {
  const presenceKey = createPresenceKey();

  console.log(
    '🟡 Starting online presence:',
    presenceKey
  );

  const channel = supabase.channel(
    'jinsangeet-online',
    {
      config: {
        presence: {
          key: presenceKey,
        },
      },
    }
  );

  const updateCount = () => {
    const state = channel.presenceState();

    console.log(
      '👥 Presence state:',
      state
    );

    const count = Object.values(state).reduce(
      (total, presences) =>
        total + presences.length,
      0
    );

    console.log(
      '🟢 REAL ONLINE COUNT:',
      count
    );

    onCountChange(count);
  };

  channel.on(
    'presence',
    {
      event: 'sync',
    },
    () => {
      console.log(
        '🔄 Presence SYNC'
      );

      updateCount();
    }
  );

  channel.on(
    'presence',
    {
      event: 'join',
    },
    ({ key }) => {
      console.log(
        '🟢 USER JOINED:',
        key
      );

      updateCount();
    }
  );

  channel.on(
    'presence',
    {
      event: 'leave',
    },
    ({ key }) => {
      console.log(
        '🔴 USER LEFT:',
        key
      );

      updateCount();
    }
  );

  await channel.subscribe(
    async (status, error) => {
      console.log(
        '📡 Realtime status:',
        status
      );

      if (error) {
        console.error(
          '❌ Realtime error:',
          error
        );
      }

      if (status === 'SUBSCRIBED') {
        console.log(
          '✅ Connected to Supabase Presence'
        );

        try {
          await channel.track({
            online_at:
              new Date().toISOString(),
            session_id:
              presenceKey,
          });

          console.log(
            '✅ User presence tracked'
          );

          updateCount();
        } catch (trackError) {
          console.error(
            '❌ Presence tracking failed:',
            trackError
          );
        }
      }
    }
  );

  return () => {
    console.log(
      '🔴 Removing online presence'
    );

    supabase.removeChannel(
      channel
    );
  };
}